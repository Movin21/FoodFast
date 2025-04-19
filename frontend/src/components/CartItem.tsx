import React from 'react';
import { useCart } from '../context/CartContext';
import { MinusIcon, PlusIcon, TrashIcon } from 'lucide-react';
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
  imageUrl
}) => {
  const {
    increaseQuantity,
    decreaseQuantity,
    removeFromCart
  } = useCart();
  return <div className="flex items-center py-4 border-b border-gray-100">
      <div className="h-16 w-16 rounded overflow-hidden flex-shrink-0">
        <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
      </div>
      <div className="ml-4 flex-grow">
        <h4 className="font-medium text-gray-800">{name}</h4>
        <div className="text-gray-600 font-medium mt-1">
          ${price.toFixed(2)}
        </div>
      </div>
      <div className="flex items-center">
        <button onClick={() => quantity > 1 ? decreaseQuantity(id) : removeFromCart(id)} className="p-1 rounded-full hover:bg-gray-100">
          {quantity > 1 ? <MinusIcon size={16} /> : <TrashIcon size={16} className="text-red-500" />}
        </button>
        <span className="mx-3 w-6 text-center">{quantity}</span>
        <button onClick={() => increaseQuantity(id)} className="p-1 rounded-full hover:bg-gray-100">
          <PlusIcon size={16} />
        </button>
      </div>
    </div>;
};
export default CartItem;