import React from "react";
import { Link } from "react-router-dom";
import { StarIcon, ClockIcon } from "lucide-react";
interface RestaurantCardProps {
  id: string;
  name: string;
  imageUrl: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: string;
  categories: string[];
}
const RestaurantCard: React.FC<RestaurantCardProps> = ({
  id,
  name,
  imageUrl,
  rating,
  deliveryTime,
  deliveryFee,
  categories,
}) => {
  return (
    <Link to={`/restaurant/${id}`} className="block group">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-800">{name}</h3>
          <div className="flex items-center mt-1">
            <div className="flex items-center bg-gray-10 px-2 py-1 rounded">
              <StarIcon size={16} className="text-gray-600 mr-1" />
              <span className="font-medium text-sm text-gray-800">
                {rating}
              </span>
            </div>
            <span className="mx-2 text-gray-300">•</span>
            <div className="flex items-center text-gray-600 text-sm">
              <ClockIcon size={14} className="mr-1" />
              <span>{deliveryTime}</span>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            <span className="block">{categories.join(", ")}</span>
            <span className="block mt-1">{deliveryFee} delivery fee</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
export default RestaurantCard;
