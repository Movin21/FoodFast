import { useEffect, useState, useRef } from "react";
import io, { Socket } from "socket.io-client";
import axios from "axios";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { clearDriver } from "../redux/slices/driverSlice";
import {
  Clock,
  MapPin,
  Package,
  User,
  Phone,
  Bike,
  Store,
  Home,
  Check,
  ArrowRight,
  Navigation,
  Utensils,
  Award,
  Send,
  CheckCircle,
  ShoppingBag,
  LogOut,
  RefreshCw,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

// Interfaces
interface Coordinates {
  lat: number;
  lng: number;
}

interface Driver {
  id: string;
  name: string;
  licensePlate: string;
  model: string;
  location: Coordinates;
  distance: number;
  email: string;
  phone: string;
}

interface Delivery {
  _id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  pickupAddress: string;
  dropAddress: string;
  status: string;
  pickupCoords: Coordinates;
  dropCoords: Coordinates;
  driver: Driver;
  createdAt: string;
  updatedAt: string;
}

interface SocketLocationUpdate {
  orderId: string;
  location: Coordinates;
  status?: string;
}

interface DeliveryTrackingPageProps {
  isDriver?: boolean;
}

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

// Status steps for the milestone progress bar
const DELIVERY_STATUSES = [
  "Order confirmed",
  "On the way to pick up point",
  "Arrived at restaurant",
  "Order picked up",
  "On the way to delivery location",
  "Order delivered",
];

// API and Socket configuration
const API_BASE_URL = "http://localhost:8000"; // Replace with your actual API URL
const SOCKET_URL = "http://localhost:8000/socket"; // Replace with your actual Socket.io server URL

const DeliveryTrackingPage = ({}: DeliveryTrackingPageProps) => {
  const dispatch = useDispatch();
  const isDriver = useSelector((state: any) => state.driver.isDriver);
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [eta, setEta] = useState<string | null>(null);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [mapCenter, setMapCenter] = useState<Coordinates | null>(null);
  const [currentStatusIndex, setCurrentStatusIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [icons, setIcons] = useState<{
    bikerIcon?: google.maps.Icon;
    restaurantIcon?: google.maps.Icon;
    destinationIcon?: google.maps.Icon;
  }>({});
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(
    null
  );
  const [socketConnected, setSocketConnected] = useState<boolean>(false);
  const [retryingSocket, setRetryingSocket] = useState<boolean>(false);
  const [locationUpdateInterval, setLocationUpdateInterval] = useState<
    number | null
  >(null);

  const socketRef = useRef<Socket | null>(null);
  const { orderId } = useParams();
  const navigate = useNavigate();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyD-v327RRVZySPUiCCoGGitHNGTP53PimQ",
    libraries: ["geometry", "places"],
  });

  // Set map icons when Google Maps is loaded
  useEffect(() => {
    if (isLoaded && window.google) {
      setIcons({
        bikerIcon: {
          url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 40),
        },
        restaurantIcon: {
          url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 40),
        },
        destinationIcon: {
          url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 40),
        },
      });
    }
  }, [isLoaded]);

  // Get current location for driver
  useEffect(() => {
    if (isDriver && navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(location);

          // Update driver location via socket if connected
          if (socketRef.current?.connected && delivery) {
            socketRef.current.emit("update_location", {
              orderId: delivery.orderId,
              location: location,
              driverId: delivery.driver.id,
            });
          } else if (!socketConnected && delivery) {
            // If socket is not connected, update through API as fallback
            updateLocationViaAPI(location);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [isDriver, delivery, socketConnected]);

  // Fallback method to update location via API when socket is not connected
  const updateLocationViaAPI = async (location: Coordinates) => {
    if (!delivery) return;

    try {
      await axios.post(
        `${API_BASE_URL}/api/delivery/${delivery.orderId}/location`,
        {
          orderId: delivery.orderId,
          location: location,
          driverId: delivery.driver.id,
        }
      );

      // Update local state to reflect the change
      setDelivery((prev) =>
        prev ? { ...prev, driver: { ...prev.driver, location } } : prev
      );
    } catch (err) {
      console.error("Failed to update location via API:", err);
    }
  };

  // Fetch initial delivery data
  useEffect(() => {
    const fetchDeliveryData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/api/delivery/${orderId}`
        );
        const deliveryData = response.data;

        setDelivery(deliveryData);
        setMapCenter(
          isDriver && currentLocation
            ? currentLocation
            : deliveryData.driver.location
        );

        // Find current status index
        const statusIndex = DELIVERY_STATUSES.findIndex(
          (status) => status === deliveryData.status
        );
        setCurrentStatusIndex(statusIndex !== -1 ? statusIndex : 0);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching delivery data:", err);
        setError(
          "Failed to load delivery information. Please try again later."
        );
        setLoading(false);
      }
    };

    fetchDeliveryData();
  }, [orderId, isDriver, currentLocation]);

  // Setup pollfallback for location updates when socket fails
  useEffect(() => {
    if (isDriver && delivery && !socketConnected) {
      // Set up polling interval as fallback for socket
      const interval = window.setInterval(() => {
        if (currentLocation) {
          updateLocationViaAPI(currentLocation);
        }
      }, 10000); // Every 10 seconds

      setLocationUpdateInterval(interval);

      return () => {
        if (locationUpdateInterval) {
          window.clearInterval(locationUpdateInterval);
        }
      };
    }
  }, [isDriver, delivery, socketConnected, currentLocation]);

  // Initialize socket connection and handle real-time updates
  useEffect(() => {
    if (!delivery) return;

    const connectSocket = () => {
      // Initialize socket connection
      setRetryingSocket(true);
      socketRef.current = io(SOCKET_URL, {
        query: {
          orderId: delivery.orderId,
          location: JSON.stringify(delivery.driver.location),
          driverId: delivery.driver.id,
        },
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
        timeout: 10000,
      });

      // Handle connection events
      socketRef.current.on("connect", () => {
        console.log("Socket connected successfully");
        setSocketConnected(true);
        setRetryingSocket(false);

        // Clear fallback interval if it exists
        if (locationUpdateInterval) {
          window.clearInterval(locationUpdateInterval);
          setLocationUpdateInterval(null);
        }
      });

      // Handle driver location updates
      socketRef.current.on("location_update", (data: SocketLocationUpdate) => {
        if (data.orderId === delivery.orderId) {
          setDelivery((prev) =>
            prev
              ? {
                  ...prev,
                  driver: { ...prev.driver, location: data.location },
                  // Update status if provided
                  ...(data.status ? { status: data.status } : {}),
                }
              : prev
          );

          if (!isDriver) {
            setMapCenter(data.location);
          }

          // Update status index if status changed
          if (data.status) {
            const statusIndex = DELIVERY_STATUSES.findIndex(
              (status) => status === data.status
            );
            if (statusIndex !== -1) {
              setCurrentStatusIndex(statusIndex);
            }
          }
        }
      });

      // Handle status updates
      socketRef.current.on(
        "status_update",
        (data: { orderId: string; status: string }) => {
          if (data.orderId === delivery.orderId) {
            setDelivery((prev) =>
              prev ? { ...prev, status: data.status } : prev
            );

            const statusIndex = DELIVERY_STATUSES.findIndex(
              (status) => status === data.status
            );
            if (statusIndex !== -1) {
              setCurrentStatusIndex(statusIndex);
            }
          }
        }
      );

      // Handle disconnection
      socketRef.current.on("disconnect", () => {
        console.log("Socket disconnected");
        setSocketConnected(false);
      });

      // Handle connection errors
      socketRef.current.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        setSocketConnected(false);
        setRetryingSocket(false);
      });
    };

    connectSocket();

    // Cleanup function to disconnect socket
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (locationUpdateInterval) {
        window.clearInterval(locationUpdateInterval);
      }
    };
  }, [delivery]);

  // Retry connecting to socket
  const retrySocketConnection = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    if (delivery) {
      setRetryingSocket(true);
      setTimeout(() => {
        socketRef.current = io(SOCKET_URL, {
          query: {
            orderId: delivery.orderId,
            location: JSON.stringify(delivery.driver.location),
            driverId: delivery.driver.id,
          },
          reconnectionAttempts: 5,
          reconnectionDelay: 3000,
        });

        socketRef.current.on("connect", () => {
          setSocketConnected(true);
          setRetryingSocket(false);
        });

        socketRef.current.on("connect_error", () => {
          setSocketConnected(false);
          setRetryingSocket(false);
        });
      }, 1000);
    }
  };

  // Calculate ETA and directions when driver location changes
  useEffect(() => {
    if (
      isLoaded &&
      delivery?.driver?.location &&
      delivery.dropCoords &&
      window.google
    ) {
      const service = new window.google.maps.DistanceMatrixService();

      // Determine destination based on current status
      const destination =
        currentStatusIndex < 3
          ? delivery.pickupCoords // Before pickup, calculate ETA to restaurant
          : delivery.dropCoords; // After pickup, calculate ETA to customer

      service.getDistanceMatrix(
        {
          origins: [delivery.driver.location],
          destinations: [destination],
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === "OK" && response) {
            const duration =
              response.rows[0].elements[0].duration?.text || null;
            setEta(duration);
          }
        }
      );

      // Update directions based on current status
      const directionsService = new window.google.maps.DirectionsService();

      if (currentStatusIndex < 3) {
        // Before pickup: route from driver to restaurant
        directionsService.route(
          {
            origin: delivery.driver.location,
            destination: delivery.pickupCoords,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === "OK" && result) {
              setDirections(result);
            }
          }
        );
      } else {
        // After pickup: route from driver to customer
        directionsService.route(
          {
            origin: delivery.driver.location,
            destination: delivery.dropCoords,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === "OK" && result) {
              setDirections(result);
            }
          }
        );
      }
    }
  }, [
    isLoaded,
    delivery?.driver?.location,
    currentStatusIndex,
    delivery?.pickupCoords,
    delivery?.dropCoords,
  ]);

  // Function to update order status (for driver view)
  const updateOrderStatus = async (newStatus: string) => {
    if (!delivery) return;

    try {
      setIsUpdatingStatus(true);
      setError(null); // Clear any previous errors

      // API call to update order status
      await axios.put(
        `${API_BASE_URL}/api/delivery/${delivery.orderId}/status`,
        {
          orderId: delivery._id,
          status: newStatus,
        }
      );

      // If socket is connected, emit the status update
      if (socketRef.current?.connected) {
        socketRef.current.emit("status_update", {
          orderId: delivery.orderId,
          status: newStatus,
        });
      }

      // Update local state
      setDelivery((prev) => (prev ? { ...prev, status: newStatus } : prev));

      // Update status index
      const statusIndex = DELIVERY_STATUSES.findIndex(
        (status) => status === newStatus
      );
      if (statusIndex !== -1) {
        setCurrentStatusIndex(statusIndex);
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      setError("Failed to update order status. Please try again.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Function to get next status in sequence
  const getNextStatus = () => {
    if (currentStatusIndex < DELIVERY_STATUSES.length - 1) {
      return DELIVERY_STATUSES[currentStatusIndex + 1];
    }
    return null;
  };

  // Handle driver logout
  const handleLogout = () => {
    // Perform any cleanup needed
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    // Clear any local storage or cookies if needed
    localStorage.removeItem("driverToken");
    localStorage.removeItem("driverInfo");

    // Redirect to login page or home page
    navigate("/");
    dispatch(clearDriver());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-6 text-gray-600 font-medium">
            Loading your delivery status...
          </p>
        </div>
      </div>
    );
  }

  if (error || !delivery) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center p-8 max-w-md">
          <div className="text-red-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600">
            {error ||
              "Could not load the delivery information. Please try again later."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Format the date
  const formattedDate = new Date(delivery.createdAt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
      {/* Header with order info */}
      <div
        className={`${
          isDriver
            ? "bg-gradient-to-r from-green-600 to-green-800"
            : "bg-gradient-to-r from-blue-600 to-blue-800"
        } text-white p-6`}
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              {isDriver ? "Delivery Assignment" : "Tracking Order"} #
              {delivery.orderId}
            </h1>
            <p
              className={`${
                isDriver ? "text-green-100" : "text-blue-100"
              } mt-1`}
            >
              {isDriver ? "Assigned on" : "Ordered on"} {formattedDate}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className={`bg-white ${
                isDriver ? "text-green-800" : "text-blue-800"
              } font-semibold px-4 py-2 rounded-full text-sm`}
            >
              {eta ? `ETA ${eta}` : "Calculating ETA..."}
            </div>
            {isDriver && (
              <button
                onClick={handleLogout}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-2 rounded-full flex items-center transition-colors"
              >
                <LogOut className="w-4 h-4 mr-1" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Driver-specific status update section */}
      {isDriver && (
        <div className="p-4 bg-green-50 border-b border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-green-800">
                Current Status:{" "}
                <span className="font-bold">{delivery.status}</span>
              </h3>
              <p className="text-sm text-green-600 mt-1">
                Update the delivery status as you progress
              </p>
            </div>
            <div>
              {getNextStatus() && (
                <button
                  onClick={() => updateOrderStatus(getNextStatus() as string)}
                  disabled={isUpdatingStatus}
                  className={`px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center transition-colors ${
                    isUpdatingStatus ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {isUpdatingStatus ? (
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  ) : (
                    <Navigation className="w-4 h-4 mr-2" />
                  )}
                  <span>Update to {getNextStatus()}</span>
                </button>
              )}
              {!getNextStatus() && (
                <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Delivery completed!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Status milestone progress bar */}
      <div className="py-6 px-6 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Delivery Status
        </h2>
        <div className="relative">
          {/* Progress bar track */}
          <div className="h-1 bg-gray-200 absolute w-full top-7"></div>

          {/* Progress bar fill */}
          <div
            className={`h-1 ${
              isDriver ? "bg-green-600" : "bg-blue-600"
            } absolute top-7 transition-all duration-1000`}
            style={{
              width: `${
                (currentStatusIndex / (DELIVERY_STATUSES.length - 1)) * 100
              }%`,
            }}
          ></div>

          {/* Status points */}
          <div className="flex justify-between relative">
            {DELIVERY_STATUSES.map((status, index) => {
              const isActive = index <= currentStatusIndex;
              const isCurrentStep = index === currentStatusIndex;

              return (
                <div
                  key={index}
                  className="flex flex-col items-center relative"
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center z-10 transition-all duration-500 ${
                      isActive
                        ? isCurrentStep
                          ? isDriver
                            ? "bg-green-600 ring-4 ring-green-100 animate-pulse"
                            : "bg-blue-600 ring-4 ring-blue-100 animate-pulse"
                          : isDriver
                          ? "bg-green-600"
                          : "bg-blue-600"
                        : "bg-gray-300"
                    }`}
                  >
                    {isActive && index < currentStatusIndex && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <p
                    className={`text-xs mt-2 font-medium max-w-24 text-center ${
                      isActive
                        ? isDriver
                          ? "text-green-600"
                          : "text-blue-600"
                        : "text-gray-500"
                    }`}
                  >
                    {status}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Map section */}
      <div className="relative">
        {isLoaded && delivery && mapCenter && (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={isDriver && currentLocation ? currentLocation : mapCenter}
            zoom={14}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: true,
              zoomControl: true,
              styles: [
                {
                  featureType: "poi",
                  elementType: "labels",
                  stylers: [{ visibility: "off" }],
                },
              ],
            }}
          >
            {/* Restaurant marker */}
            {delivery?.pickupCoords && icons.restaurantIcon && (
              <Marker
                position={delivery.pickupCoords}
                icon={icons.restaurantIcon}
                title="Restaurant"
              />
            )}

            {/* Customer marker */}
            {delivery?.dropCoords && icons.destinationIcon && (
              <Marker
                position={delivery.dropCoords}
                icon={icons.destinationIcon}
                title="Delivery Location"
              />
            )}

            {/* Driver marker */}
            {(isDriver && currentLocation
              ? currentLocation
              : delivery?.driver?.location) &&
              icons.bikerIcon && (
                <Marker
                  position={
                    isDriver && currentLocation
                      ? currentLocation
                      : delivery.driver.location
                  }
                  icon={icons.bikerIcon}
                  title={isDriver ? "Your Location" : delivery.driver.name}
                  animation={window.google.maps.Animation.BOUNCE}
                />
              )}

            {directions && (
              <DirectionsRenderer
                directions={directions}
                options={{
                  suppressMarkers: true,
                  polylineOptions: {
                    strokeColor: isDriver ? "#16a34a" : "#3b82f6",
                    strokeWeight: 5,
                    strokeOpacity: 0.7,
                  },
                }}
              />
            )}
          </GoogleMap>
        )}

        {/* Map overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            {isDriver ? (
              currentStatusIndex < 3 ? (
                <p className="font-medium">
                  Pickup from: {delivery.pickupAddress}
                </p>
              ) : (
                <p className="font-medium">
                  Deliver to: {delivery.dropAddress}
                </p>
              )
            ) : (
              <p className="font-medium">
                Delivering to: {delivery.dropAddress}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Details section - Different for driver and customer */}
      {isDriver ? (
        // Driver view: Customer details
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-4">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{delivery.customerName}</h3>
              <p className="text-gray-600">{delivery.customerPhone}</p>
            </div>
            <div className="ml-auto">
              <a
                href={`tel:${delivery.customerPhone}`}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center transition-colors"
              >
                <Phone className="w-4 h-4 mr-2" />
                <span>Call Customer</span>
              </a>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold text-gray-800 mb-2">
              Delivery Instructions
            </h4>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex space-x-1">
                <Award className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-700">
                    Deliver the order to the front desk. The building has secure
                    access so please call when you arrive.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Customer view: Driver details
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{delivery.driver.name}</h3>
              <div className="flex items-center mt-1 text-gray-600">
                <Bike className="w-4 h-4 mr-1" />
                <span>
                  {delivery.driver.model} • {delivery.driver.licensePlate}
                </span>
              </div>
            </div>
            <div className="ml-auto">
              <a
                href={`tel:${delivery.driver.phone}`}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center transition-colors"
              >
                <Phone className="w-4 h-4 mr-2" />
                <span>Call Driver</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Location details */}
      <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center text-gray-600 mb-2">
            <Utensils className="w-4 h-4 mr-2 text-blue-600" />
            <span className="font-medium">Pickup Location</span>
          </div>
          <p className="text-gray-800">{delivery.pickupAddress}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center text-gray-600 mb-2">
            <ShoppingBag className="w-4 h-4 mr-2 text-blue-600" />
            <span className="font-medium">Delivery Location</span>
          </div>
          <p className="text-gray-800">{delivery.dropAddress}</p>
        </div>
      </div>

      {/* Connection status indicator with retry option */}
      <div className="bg-gray-50 p-4 text-center border-t border-gray-200">
        <div className="flex items-center justify-center text-sm space-x-3">
          <div className="flex items-center">
            <div
              className={`w-2 h-2 rounded-full mr-2 ${
                socketConnected ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <p className="text-gray-500">
              {socketConnected
                ? "Live tracking active"
                : "Operating in offline mode"}
            </p>
          </div>

          {!socketConnected && (
            <button
              onClick={retrySocketConnection}
              disabled={retryingSocket}
              className="text-blue-600 hover:text-blue-800 flex items-center disabled:opacity-50"
            >
              {retryingSocket ? (
                <span className="flex items-center">
                  <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                  Reconnecting...
                </span>
              ) : (
                <span className="flex items-center">
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Retry connection
                </span>
              )}
            </button>
          )}
        </div>

        {!socketConnected && !retryingSocket && (
          <p className="text-xs text-gray-500 mt-1">
            Don't worry! Your updates are still being saved, but tracking
            updates may be delayed.
          </p>
        )}
      </div>
    </div>
  );
};

export default DeliveryTrackingPage;
