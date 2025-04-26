import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  StarIcon,
  ClockIcon,
  DollarSignIcon,
  InfoIcon,
  ChevronDownIcon,
  ShoppingBagIcon,
} from "lucide-react";
import FoodCard from "../components/FoodCard";
import { RootState } from "../redux/store";
import { getRestaurantById, getRestaurantMenu } from "../services/customerService";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { addToCart } from "../redux/slices/cartSlice";

interface Restaurant {
  _id: string;
  name: string;
  imageUrl: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: string;
  categories: string[];
  address: string;
  description: string;
  openCloseStatus?: boolean;
}

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  isAvailable?: boolean;
}

const RestaurantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const cartItems = useSelector((state: RootState) => state.cart.items);
  
  // Fetch restaurant data from API
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Fetch restaurant details
        const restaurantResponse = await getRestaurantById(id);
        if (restaurantResponse.success && restaurantResponse.restaurant) {
          setRestaurant(restaurantResponse.restaurant);
        } else {
          setError("Failed to load restaurant details");
          return;
        }
        
        // Fetch menu items
        const menuResponse = await getRestaurantMenu(id);
        if (menuResponse.success && menuResponse.menuItems) {
          setMenuItems(menuResponse.menuItems);
        } else {
          setError("Failed to load menu items");
        }
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
        setError("An error occurred while loading restaurant data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  // Get unique categories from menu items
  const categories = [
    "All",
    ...Array.from(new Set(menuItems.map((item) => item.category))),
  ];
  
  // Filter menu items by category
  const filteredMenu =
    activeCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);
  
  // Check if items from this restaurant are in cart
  const restaurantItemsInCart = id 
    ? cartItems.filter((item) => item.restaurantId === id)
    : [];
    
  const itemCount = restaurantItemsInCart.reduce(
    (total, item) => total + item.quantity,
    0
  );
  
  const cartTotal = restaurantItemsInCart.reduce(
    (total, item) => total + (item.price * item.quantity),
    0
  );
  
  // Handle adding item to cart
  const handleAddToCart = (menuItem: MenuItem, quantity: number = 1) => {
    if (!restaurant) return;
    
    dispatch(addToCart({
      id: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: quantity,
      imageUrl: menuItem.imageUrl,
      restaurantId: restaurant._id,
      restaurantName: restaurant.name,
    }));
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (error || !restaurant) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {error || "Restaurant not found"}
        </h2>
        <button 
          className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Restaurant Banner */}
      <div className="relative h-64 md:h-80">
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold">{restaurant.name}</h1>
          <div className="flex items-center mt-2 text-sm md:text-base">
            <div className="flex items-center">
              <StarIcon size={18} className="text-yellow-400 mr-1" />
              <span className="font-medium">{restaurant.rating}</span>
            </div>
            <span className="mx-2">•</span>
            <div className="flex items-center">
              <ClockIcon size={16} className="mr-1" />
              <span>{restaurant.deliveryTime}</span>
            </div>
            <span className="mx-2">•</span>
            <div className="flex items-center">
              <DollarSignIcon size={16} className="mr-1" />
              <span>{restaurant.deliveryFee} delivery</span>
            </div>
          </div>
          <div className="mt-2 text-sm md:text-base">
            {restaurant.categories.join(" • ")}
          </div>
        </div>
      </div>
      
      {/* Restaurant Info */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-start">
            <InfoIcon
              size={20}
              className="text-gray-500 mt-1 mr-2 flex-shrink-0"
            />
            <div>
              <p className="text-gray-600">{restaurant.description}</p>
              <p className="text-gray-600 mt-2">{restaurant.address}</p>
              {restaurant.openCloseStatus === false && (
                <p className="text-red-500 mt-2 font-medium">
                  This restaurant is currently closed
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Category Tabs */}
        <div className="bg-white sticky top-16 z-10 shadow-sm mb-6">
          <div className="container mx-auto px-4">
            <div className="flex space-x-6 overflow-x-auto py-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`whitespace-nowrap px-1 py-2 border-b-2 text-sm font-medium ${
                    activeCategory === category
                      ? "border-gray-600 text-gray-600"
                      : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Menu Items */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {activeCategory === "All" ? "Full Menu" : activeCategory}
          </h2>
          
          {filteredMenu.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600 text-lg">
                No items found in this category.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredMenu.map((item) => (
                <FoodCard
                  key={item._id}
                  id={item._id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  imageUrl={item.imageUrl}
                  restaurantId={restaurant._id}
                  restaurantName={restaurant.name}
                  isAvailable={item.isAvailable !== false}
                  onAddToCart={() => handleAddToCart(item)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Cart Summary - Fixed at bottom if items in cart */}
      {itemCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                  {itemCount}
                </div>
                <div>
                  <span className="font-medium text-gray-800">View Cart</span>
                  <p className="text-gray-600 text-sm">${cartTotal.toFixed(2)}</p>
                </div>
              </div>
              <Link
                to="/checkout"
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded-full flex items-center transition-colors duration-300"
              >
                <ShoppingBagIcon size={16} className="mr-2" />
                <span>Checkout</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetail;
