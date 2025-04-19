import React, { useEffect, useState, createContext, useContext } from 'react';
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  restaurantId: string;
  restaurantName: string;
}
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
  cartTotal: number;
}
const CartContext = createContext<CartContextType | undefined>(undefined);
export const CartProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  // Calculate cart total whenever items change
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setCartTotal(total);
  }, [cartItems]);
  const addToCart = (newItem: CartItem) => {
    setCartItems(prevItems => {
      // Check if we already have this item in cart
      const existingItem = prevItems.find(item => item.id === newItem.id);
      if (existingItem) {
        // Update quantity of existing item
        return prevItems.map(item => item.id === newItem.id ? {
          ...item,
          quantity: item.quantity + newItem.quantity
        } : item);
      } else {
        // Add new item
        return [...prevItems, newItem];
      }
    });
  };
  const removeFromCart = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };
  const increaseQuantity = (id: string) => {
    setCartItems(prevItems => prevItems.map(item => item.id === id ? {
      ...item,
      quantity: item.quantity + 1
    } : item));
  };
  const decreaseQuantity = (id: string) => {
    setCartItems(prevItems => prevItems.map(item => item.id === id && item.quantity > 1 ? {
      ...item,
      quantity: item.quantity - 1
    } : item));
  };
  const clearCart = () => {
    setCartItems([]);
  };
  return <CartContext.Provider value={{
    cartItems,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    cartTotal
  }}>
      {children}
    </CartContext.Provider>;
};
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};