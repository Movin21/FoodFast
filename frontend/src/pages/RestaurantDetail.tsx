import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  StarIcon,
  ClockIcon,
  DollarSignIcon,
  InfoIcon,
  ChevronDownIcon,
} from "lucide-react";
import FoodCard from "../components/FoodCard";
import { useCart } from "../context/CartContext";
// Mock restaurant data
const restaurants = {
  "1": {
    id: "1",
    name: "Burger Palace",
    imageUrl:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    rating: 4.7,
    deliveryTime: "15-25 min",
    deliveryFee: "$1.99",
    categories: ["Burgers", "American", "Fast Food"],
    address: "123 Main St, Anytown, USA",
    description:
      "Serving juicy, delicious burgers since 2010. All our beef is locally sourced and our buns are baked fresh daily.",
  },
  "2": {
    id: "2",
    name: "Pizza Heaven",
    imageUrl:
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    rating: 4.5,
    deliveryTime: "20-30 min",
    deliveryFee: "$2.49",
    categories: ["Pizza", "Italian", "Vegetarian"],
    address: "456 Oak Ave, Anytown, USA",
    description:
      "Authentic Italian pizzas made with our secret family recipe. Wood-fired oven and premium ingredients.",
  },
  "3": {
    id: "3",
    name: "Sushi Express",
    imageUrl:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    rating: 4.8,
    deliveryTime: "25-35 min",
    deliveryFee: "$3.99",
    categories: ["Japanese", "Sushi", "Healthy"],
    address: "789 Pine St, Anytown, USA",
    description:
      "Fresh sushi and sashimi prepared by master chefs. We use only the freshest fish delivered daily.",
  },
  "4": {
    id: "4",
    name: "Taco Fiesta",
    imageUrl:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    rating: 4.3,
    deliveryTime: "15-25 min",
    deliveryFee: "$1.49",
    categories: ["Mexican", "Tacos", "Burritos"],
    address: "101 Maple Dr, Anytown, USA",
    description:
      "Authentic Mexican street food with a modern twist. Our salsas are made fresh daily.",
  },
  "5": {
    id: "5",
    name: "Pasta Paradise",
    imageUrl:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    rating: 4.6,
    deliveryTime: "25-40 min",
    deliveryFee: "$2.99",
    categories: ["Italian", "Pasta", "Mediterranean"],
    address: "202 Cedar Ln, Anytown, USA",
    description:
      "Homemade pasta and authentic Italian sauces. Every dish is prepared with love and tradition.",
  },
  "6": {
    id: "6",
    name: "Salad & Co",
    imageUrl:
      "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    rating: 4.4,
    deliveryTime: "15-25 min",
    deliveryFee: "$1.99",
    categories: ["Healthy", "Salads", "Wraps"],
    address: "303 Birch Blvd, Anytown, USA",
    description:
      "Fresh, healthy salads and wraps made with locally-sourced organic ingredients.",
  },
};
// Mock menu data
const menuItems = {
  "1": [
    {
      id: "101",
      name: "Classic Cheeseburger",
      description:
        "Juicy beef patty with melted cheddar cheese, lettuce, tomato, onion, and our special sauce.",
      price: 8.99,
      imageUrl:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      category: "Burgers",
    },
    {
      id: "102",
      name: "Bacon BBQ Burger",
      description:
        "Beef patty topped with crispy bacon, cheddar cheese, onion rings, and BBQ sauce.",
      price: 10.99,
      imageUrl:
        "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      category: "Burgers",
    },
    {
      id: "103",
      name: "Veggie Burger",
      description:
        "Plant-based patty with avocado, lettuce, tomato, and vegan mayo.",
      price: 9.99,
      imageUrl:
        "https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      category: "Vegetarian",
    },
    {
      id: "104",
      name: "French Fries",
      description: "Crispy golden fries seasoned with sea salt.",
      price: 3.99,
      imageUrl:
        "https://images.unsplash.com/photo-1576107232684-1279f390859f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      category: "Sides",
    },
    {
      id: "105",
      name: "Onion Rings",
      description: "Crispy battered onion rings served with dipping sauce.",
      price: 4.99,
      imageUrl:
        "https://images.unsplash.com/photo-1639024471283-03518883512d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      category: "Sides",
    },
    {
      id: "106",
      name: "Chocolate Milkshake",
      description:
        "Rich and creamy chocolate milkshake topped with whipped cream.",
      price: 5.99,
      imageUrl:
        "https://images.unsplash.com/photo-1572490122747-3968b75cc699?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      category: "Drinks",
    },
  ],
  "2": [
    {
      id: "201",
      name: "Margherita Pizza",
      description:
        "Classic pizza with tomato sauce, mozzarella, and fresh basil.",
      price: 12.99,
      imageUrl:
        "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      category: "Pizzas",
    },
    {
      id: "202",
      name: "Pepperoni Pizza",
      description: "Tomato sauce, mozzarella, and pepperoni slices.",
      price: 14.99,
      imageUrl:
        "https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      category: "Pizzas",
    },
  ],
  "3": [
    {
      id: "301",
      name: "California Roll",
      description: "Crab, avocado, and cucumber wrapped in seaweed and rice.",
      price: 7.99,
      imageUrl:
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      category: "Sushi Rolls",
    },
    {
      id: "302",
      name: "Salmon Nigiri",
      description: "Fresh salmon slices over pressed vinegared rice.",
      price: 6.99,
      imageUrl:
        "https://images.unsplash.com/photo-1534482421-64566f976cfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      category: "Nigiri",
    },
  ],
  "4": [
    {
      id: "401",
      name: "Beef Tacos",
      description:
        "Three corn tortillas filled with seasoned beef, lettuce, cheese, and salsa.",
      price: 9.99,
      imageUrl:
        "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      category: "Tacos",
    },
    {
      id: "402",
      name: "Chicken Burrito",
      description:
        "Large flour tortilla filled with grilled chicken, rice, beans, and cheese.",
      price: 10.99,
      imageUrl:
        "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      category: "Burritos",
    },
  ],
  "5": [
    {
      id: "501",
      name: "Spaghetti Carbonara",
      description:
        "Spaghetti with creamy sauce, pancetta, egg, and parmesan cheese.",
      price: 13.99,
      imageUrl:
        "https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      category: "Pasta",
    },
    {
      id: "502",
      name: "Fettuccine Alfredo",
      description: "Fettuccine pasta in a rich, creamy parmesan sauce.",
      price: 12.99,
      imageUrl:
        "https://images.unsplash.com/photo-1645112411341-6c4fd023882a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      category: "Pasta",
    },
  ],
  "6": [
    {
      id: "601",
      name: "Caesar Salad",
      description:
        "Romaine lettuce, croutons, parmesan cheese, and Caesar dressing.",
      price: 8.99,
      imageUrl:
        "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      category: "Salads",
    },
    {
      id: "602",
      name: "Chicken Wrap",
      description:
        "Grilled chicken, mixed grays, and avocado in a whole wheat wrap.",
      price: 9.99,
      imageUrl:
        "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      category: "Wraps",
    },
  ],
};
const RestaurantDetail: React.FC = () => {
  const { id } = useParams<{
    id: string;
  }>();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const { cartItems } = useCart();
  // Get restaurant data based on ID
  const restaurant = restaurants[id as keyof typeof restaurants];
  // Get menu items for this restaurant
  const menu = menuItems[id as keyof typeof menuItems] || [];
  // Get unique categories from menu items
  const categories = [
    "All",
    ...Array.from(new Set(menu.map((item) => item.category))),
  ];
  // Filter menu items by category
  const filteredMenu =
    activeCategory === "All"
      ? menu
      : menu.filter((item) => item.category === activeCategory);
  // Check if items from this restaurant are in cart
  const restaurantItemsInCart = cartItems.filter(
    (item) => item.restaurantId === id
  );
  const itemCount = restaurantItemsInCart.reduce(
    (total, item) => total + item.quantity,
    0
  );
  if (!restaurant) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Restaurant not found
        </h2>
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
          <div className="space-y-6">
            {filteredMenu.map((item) => (
              <FoodCard
                key={item.id}
                id={item.id}
                name={item.name}
                description={item.description}
                price={item.price}
                imageUrl={item.imageUrl}
                restaurantId={restaurant.id}
                restaurantName={restaurant.name}
              />
            ))}
          </div>
          {filteredMenu.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-600 text-lg">
                No items found in this category.
              </p>
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
                <span className="font-medium text-gray-800">View Cart</span>
              </div>
              <Link
                to="/checkout"
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded-full flex items-center transition-colors duration-300"
              >
                <span>Checkout</span>
                <ChevronDownIcon size={16} className="ml-1 rotate-270" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default RestaurantDetail;
