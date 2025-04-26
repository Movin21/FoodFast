import React from "react";
import { useDispatch } from "react-redux";
import { PlusIcon, MinusIcon, Trash2Icon } from "lucide-react";
import { 
  increaseQuantity, 
  decreaseQuantity, 
  removeFromCart 
} from "../redux/slices/cartSlice";

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

const CartItem: React.FC<CartItemProps> = ({
  id,
  name,
  price,
  quantity,
  imageUrl,
}) => {
  const dispatch = useDispatch();
  
  const handleIncreaseQuantity = () => {
    dispatch(increaseQuantity(id));
  };
  
  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      dispatch(decreaseQuantity(id));
    } else {
      dispatch(removeFromCart(id));
    }
  };
  
  const handleRemoveItem = () => {
    dispatch(removeFromCart(id));
  };

  return (
    <div className="flex items-center border border-gray-100 rounded-lg p-3 bg-white hover:border-gray-200 transition-all">
      <img
        src={imageUrl}
        alt={name}
        className="w-16 h-16 object-cover rounded-md mr-4"
      />
      <div className="flex-1">
        <h4 className="font-medium text-gray-800">{name}</h4>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border rounded-md overflow-hidden">
            <button
              onClick={handleDecreaseQuantity}
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {quantity === 1 ? (
                <Trash2Icon size={16} className="text-red-500" />
              ) : (
                <MinusIcon size={16} />
              )}
            </button>
            <span className="px-3 font-medium">{quantity}</span>
            <button
              onClick={handleIncreaseQuantity}
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <PlusIcon size={16} />
            </button>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-gray-800 mr-3">
              ${(price * quantity).toFixed(2)}
            </span>
            <button
              onClick={handleRemoveItem}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2Icon size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;