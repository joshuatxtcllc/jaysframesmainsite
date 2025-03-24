import React, { createContext, useState, useContext, useEffect } from "react";
import { CartItem } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface CartContextProps {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextProps>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getCartTotal: () => 0,
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    // Check if item is already in cart by comparing product ID and customization options
    const existingItemIndex = cartItems.findIndex(
      (cartItem) => {
        if (cartItem.productId !== item.productId) return false;
        
        // For custom frames, compare customization options
        if (item.details && cartItem.details) {
          const itemDetails = item.details;
          const cartItemDetails = cartItem.details;
          
          return (
            itemDetails.width === cartItemDetails.width &&
            itemDetails.height === cartItemDetails.height &&
            itemDetails.frameId === cartItemDetails.frameId &&
            itemDetails.matId === cartItemDetails.matId &&
            itemDetails.glassId === cartItemDetails.glassId
          );
        }
        
        return true;
      }
    );

    if (existingItemIndex !== -1) {
      // If item exists, update quantity
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += item.quantity;
      setCartItems(updatedCartItems);
      
      toast({
        title: "Cart updated",
        description: `Increased quantity of ${item.name}`,
      });
    } else {
      // If item doesn't exist, add it to cart
      setCartItems([...cartItems, { ...item, id: generateCartItemId(item) }]);
      
      toast({
        title: "Added to cart",
        description: `${item.name} has been added to your cart`,
      });
    }
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
    
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart",
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setCartItems(
      cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Generate a unique ID for cart items based on product and customization
  const generateCartItemId = (item: CartItem): string => {
    const baseId = `${item.productId}`;
    
    // For custom frames, include customization details in the ID
    if (item.details) {
      const { width, height, frameId, matId, glassId } = item.details;
      return `${baseId}-${width}-${height}-${frameId}-${matId}-${glassId}-${Date.now()}`;
    }
    
    return `${baseId}-${Date.now()}`;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
