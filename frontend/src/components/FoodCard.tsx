import React from "react";
import { useCart } from "../context/CartContext";
import { PlusIcon } from "lucide-react";
interface FoodCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  restaurantId: string;
  restaurantName: string;
}
const FoodCard: React.FC<FoodCardProps> = ({
  id,
  name,
  description,
  price,
  imageUrl,
  restaurantId,
  restaurantName,
}) => {
  const { addToCart } = useCart();
  const handleAddToCart = () => {
    addToCart({
      id,
      name,
      price,
      quantity: 1,
      imageUrl,
      restaurantId,
      restaurantName,
    });
  };
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col md:flex-row">
      <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-lg text-gray-800">{name}</h3>
        <p className="text-gray-600 text-sm mt-1 flex-grow">{description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="font-bold text-gray-800">${price.toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-full flex items-center transition-colors duration-300"
          >
            <PlusIcon size={16} className="mr-1" />
            <span>Add to cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default FoodCard;
