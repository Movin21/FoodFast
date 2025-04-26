import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { PlusIcon, MinusIcon, ShoppingBagIcon } from "lucide-react";
import { addToCart } from "../redux/slices/cartSlice";

interface FoodCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  restaurantId: string;
  restaurantName: string;
  isAvailable?: boolean;
  onAddToCart?: () => void;
}

const FoodCard: React.FC<FoodCardProps> = ({
  id,
  name,
  description,
  price,
  imageUrl,
  restaurantId,
  restaurantName,
  isAvailable = true,
  onAddToCart,
}) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (amount: number) => {
    const newQuantity = Math.max(1, quantity + amount);
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    if (!isAvailable) return;

    if (onAddToCart) {
      onAddToCart();
    } else {
      dispatch(
        addToCart({
          id,
          name,
          price,
          quantity,
          imageUrl,
          restaurantId,
          restaurantName,
        })
      );
    }

    // Reset quantity after adding to cart
    setQuantity(1);
  };

  return (
    <div className={`bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col md:flex-row ${!isAvailable ? 'opacity-70' : ''}`}>
      <div className="md:w-1/3 h-48 md:h-auto overflow-hidden relative">
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        {!isAvailable && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-medium px-4 py-2 bg-red-500 rounded-md">
              Unavailable
            </span>
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-lg text-gray-800">{name}</h3>
        <p className="text-gray-600 text-sm mt-1 flex-grow">{description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="font-bold text-gray-800">${price.toFixed(2)}</span>
          
          {isAvailable ? (
            <div className="flex items-center space-x-2">
              <div className="flex items-center border rounded-full overflow-hidden">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <MinusIcon size={16} />
                </button>
                <span className="px-3 font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <PlusIcon size={16} />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-full flex items-center transition-colors duration-300"
              >
                <ShoppingBagIcon size={16} className="mr-1" />
                <span>Add</span>
              </button>
            </div>
          ) : (
            <button
              disabled
              className="bg-gray-300 text-gray-500 py-2 px-4 rounded-full flex items-center cursor-not-allowed"
            >
              <span>Unavailable</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
