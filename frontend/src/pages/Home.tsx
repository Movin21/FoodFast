import React, { useState, useEffect } from "react";
import RestaurantCard from "../components/RestaurantCard";
import { FilterIcon } from "lucide-react";
import OffersSection from "../components/OffersSection";
import CategoryScroll from "../components/CategoryScroll";
import { getAllRestaurants } from "../services/customerService";
import LoadingSpinner from "../components/common/LoadingSpinner";

interface Restaurant {
  _id: string;
  name: string;
  imageUrl: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: string;
  categories: string[];
  openCloseStatus?: boolean;
}

const Home: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedPrice, setSelectedPrice] = useState<string>("All");
  const [selectedRating, setSelectedRating] = useState<string>("All");
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState<string>("All");

  // Fetch restaurants data from API
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await getAllRestaurants();
        if (response.success && response.restaurants) {
          setRestaurants(response.restaurants);
        } else {
          setError("Failed to load restaurants");
        }
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setError("An error occurred while fetching restaurants");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Get all unique categories from restaurant data
  const allCategories = Array.from(
    new Set(restaurants.flatMap((restaurant) => restaurant.categories))
  );

  // Apply filters to restaurants
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesCategory =
      selectedCategory === "All" ||
      restaurant.categories.includes(selectedCategory);
    
    const matchesPrice =
      selectedPrice === "All" ||
      (selectedPrice === "Under $10" &&
        parseFloat(restaurant.deliveryFee.replace("$", "")) < 10) ||
      (selectedPrice === "$10-$20" &&
        parseFloat(restaurant.deliveryFee.replace("$", "")) >= 10 &&
        parseFloat(restaurant.deliveryFee.replace("$", "")) <= 20) ||
      (selectedPrice === "$20+" &&
        parseFloat(restaurant.deliveryFee.replace("$", "")) > 20);
    
    const matchesRating =
      selectedRating === "All" ||
      (selectedRating === "4.5+" && restaurant.rating >= 4.5) ||
      (selectedRating === "4.0+" && restaurant.rating >= 4.0);
    
    // Extract min delivery time for comparison
    const minDeliveryTime = parseInt(restaurant.deliveryTime.split("-")[0]);
    const matchesDeliveryTime =
      selectedDeliveryTime === "All" ||
      (selectedDeliveryTime === "Under 30" && minDeliveryTime < 30) ||
      (selectedDeliveryTime === "Under 45" && minDeliveryTime < 45);
    
    return (
      matchesCategory && matchesPrice && matchesRating && matchesDeliveryTime
    );
  });

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-black text-white">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Food delivery from your favorite restaurants
          </h1>
          <p className="text-lg md:text-xl max-w-xl mb-6 text-gray-300">
            Order food from the best local restaurants and get it delivered to
            your doorstep.
          </p>
        </div>
      </div>
      
      <CategoryScroll
        onSelectCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
      />
      
      <div className="bg-white border-t border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap gap-4">
            {/* Price Dropdown */}
            <div className="flex flex-col w-32 text-sm">
              <button
                type="button"
                className="peer group w-full text-left px-4 pr-2 py-2 border rounded-full bg-white text-gray-700 border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none"
              >
                <span>Price</span>
                <svg
                  className="w-5 h-5 inline float-right transition-transform duration-200 -rotate-90 group-focus:rotate-0"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#6B7280"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 9-7 7-7-7"
                  />
                </svg>
              </button>
              <ul className="hidden overflow-hidden peer-focus:block w-full bg-white border border-gray-300 rounded shadow-md mt-1 py-2">
                <li
                  className="px-4 py-2 hover:bg-black hover:text-white cursor-pointer"
                  onClick={() => setSelectedPrice("All")}
                >
                  All Prices
                </li>
                <li
                  className="px-4 py-2 hover:bg-black hover:text-white cursor-pointer"
                  onClick={() => setSelectedPrice("Under $10")}
                >
                  Under $10
                </li>
                <li
                  className="px-4 py-2 hover:bg-black hover:text-white cursor-pointer"
                  onClick={() => setSelectedPrice("$10-$20")}
                >
                  $10-$20
                </li>
                <li
                  className="px-4 py-2 hover:bg-black hover:text-white cursor-pointer"
                  onClick={() => setSelectedPrice("$20+")}
                >
                  $20+
                </li>
              </ul>
            </div>

            {/* Rating Dropdown */}
            <div className="flex flex-col w-32 text-sm">
              <button
                type="button"
                className="peer group w-full text-left px-4 pr-2 py-2 border rounded-full bg-white text-gray-700 border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none"
              >
                <span>Rating</span>
                <svg
                  className="w-5 h-5 inline float-right transition-transform duration-200 -rotate-90 group-focus:rotate-0"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#6B7280"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 9-7 7-7-7"
                  />
                </svg>
              </button>
              <ul className="hidden overflow-hidden peer-focus:block w-full bg-white border border-gray-300 rounded shadow-md mt-1 py-2">
                <li
                  className="px-4 py-2 hover:bg-black hover:text-white cursor-pointer"
                  onClick={() => setSelectedRating("All")}
                >
                  All Ratings
                </li>
                <li
                  className="px-4 py-2 hover:bg-black hover:text-white cursor-pointer"
                  onClick={() => setSelectedRating("4.5+")}
                >
                  4.5+
                </li>
                <li
                  className="px-4 py-2 hover:bg-black hover:text-white cursor-pointer"
                  onClick={() => setSelectedRating("4.0+")}
                >
                  4.0+
                </li>
              </ul>
            </div>

            {/* Delivery Time Dropdown */}
            <div className="flex flex-col w-32 text-sm">
              <button
                type="button"
                className="peer group w-full text-left px-4 pr-2 py-2 border rounded-full bg-white text-gray-700 border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none"
              >
                <span>Time</span>
                <svg
                  className="w-5 h-5 inline float-right transition-transform duration-200 -rotate-90 group-focus:rotate-0"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#6B7280"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 9-7 7-7-7"
                  />
                </svg>
              </button>
              <ul className="hidden overflow-hidden peer-focus:block w-full bg-white border border-gray-300 rounded shadow-md mt-1 py-2">
                <li
                  className="px-4 py-2 hover:bg-black hover:text-white cursor-pointer"
                  onClick={() => setSelectedDeliveryTime("All")}
                >
                  All Times
                </li>
                <li
                  className="px-4 py-2 hover:bg-black hover:text-white cursor-pointer"
                  onClick={() => setSelectedDeliveryTime("Under 30")}
                >
                  Under 30 min
                </li>
                <li
                  className="px-4 py-2 hover:bg-black hover:text-white cursor-pointer"
                  onClick={() => setSelectedDeliveryTime("Under 45")}
                >
                  Under 45 min
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <OffersSection />
      
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-black mb-6">
          {selectedCategory === "All"
            ? "All Restaurants"
            : `${selectedCategory} Restaurants`}
        </h2>
        
        {loading ? (
          <div className="flex justify-center py-10">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500 text-lg">{error}</p>
            <button 
              className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard 
                key={restaurant._id} 
                id={restaurant._id}
                name={restaurant.name}
                imageUrl={restaurant.imageUrl}
                rating={restaurant.rating}
                deliveryTime={restaurant.deliveryTime}
                deliveryFee={restaurant.deliveryFee}
                categories={restaurant.categories}
              />
            ))}
          </div>
        )}
        
        {!loading && !error && filteredRestaurants.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-600 text-lg">
              No restaurants found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
