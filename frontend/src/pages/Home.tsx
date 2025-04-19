import React, { useState } from "react";
import RestaurantCard from "../components/RestaurantCard";
import { FilterIcon } from "lucide-react";
import OffersSection from "../components/OffersSection";
import CategoryScroll from "../components/CategoryScroll";
const restaurantsData = [
  {
    id: "1",
    name: "Burger Palace",
    imageUrl:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    rating: 4.7,
    deliveryTime: "15-25 min",
    deliveryFee: "$1.99",
    categories: ["Burgers", "American", "Fast Food"],
  },
  {
    id: "2",
    name: "Pizza Heaven",
    imageUrl:
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    rating: 4.5,
    deliveryTime: "20-30 min",
    deliveryFee: "$2.49",
    categories: ["Pizza", "Italian", "Vegetarian"],
  },
  {
    id: "3",
    name: "Sushi Express",
    imageUrl:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    rating: 4.8,
    deliveryTime: "25-35 min",
    deliveryFee: "$3.99",
    categories: ["Japanese", "Sushi", "Healthy"],
  },
  {
    id: "4",
    name: "Taco Fiesta",
    imageUrl:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    rating: 4.3,
    deliveryTime: "15-25 min",
    deliveryFee: "$1.49",
    categories: ["Mexican", "Tacos", "Burritos"],
  },
  {
    id: "5",
    name: "Pasta Paradise",
    imageUrl:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    rating: 4.6,
    deliveryTime: "25-40 min",
    deliveryFee: "$2.99",
    categories: ["Italian", "Pasta", "Mediterranean"],
  },
  {
    id: "6",
    name: "Salad & Co",
    imageUrl:
      "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    rating: 4.4,
    deliveryTime: "15-25 min",
    deliveryFee: "$1.99",
    categories: ["Healthy", "Salads", "Wraps"],
  },
];
const allCategories = Array.from(
  new Set(restaurantsData.flatMap((restaurant) => restaurant.categories))
);
const Home: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedPrice, setSelectedPrice] = useState<string>("All");
  const [selectedRating, setSelectedRating] = useState<string>("All");
  const [selectedDeliveryTime, setSelectedDeliveryTime] =
    useState<string>("All");
  const filteredRestaurants = restaurantsData.filter((restaurant) => {
    const matchesCategory =
      selectedCategory === "All" ||
      restaurant.categories.includes(selectedCategory);
    const matchesPrice =
      selectedPrice === "All" ||
      (selectedPrice === "Under $10" &&
        parseFloat(restaurant.deliveryFee.replace("$", "")) < 10);
    const matchesRating =
      selectedRating === "All" ||
      (selectedRating === "4.5+" && restaurant.rating >= 4.5) ||
      (selectedRating === "4.0+" && restaurant.rating >= 4.0);
    const matchesDeliveryTime =
      selectedDeliveryTime === "All" ||
      (selectedDeliveryTime === "Under 30" &&
        parseInt(restaurant.deliveryTime) < 30);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} {...restaurant} />
          ))}
        </div>
        {filteredRestaurants.length === 0 && (
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
