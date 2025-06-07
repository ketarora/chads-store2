import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDatabase } from '@/hooks/useDatabase';
import { CartItem as DBCartItem } from '@/lib/supabase';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getGST: () => number;
  getTotal: () => number;
  refreshCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user } = useAuth();
  const { addToCartDB, getCartItems, updateCartQuantity, removeFromCartDB, clearCartDB } = useDatabase();

  // Load cart from database when user changes
  useEffect(() => {
    if (user) {
      refreshCart();
    } else {
      // Load from localStorage if not authenticated
      try {
        const storedCart = localStorage.getItem('vibeThreadzCart');
        setCartItems(storedCart ? JSON.parse(storedCart) : []);
      } catch (error) {
        console.error('Error loading cart from localStorage', error);
        setCartItems([]);
      }
    }
  }, [user]);

  // Save to localStorage when cart changes (for non-authenticated users)
  useEffect(() => {
    if (!user) {
      localStorage.setItem('vibeThreadzCart', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const refreshCart = async () => {
    if (user) {
      const dbCartItems = await getCartItems();
      const formattedItems: CartItem[] = dbCartItems.map(item => ({
        id: item.product_id,
        name: item.product_name,
        price: item.product_price,
        image: item.product_image,
        category: item.product_category,
        quantity: item.quantity
      }));
      setCartItems(formattedItems);
    }
  };

  const addToCart = async (product: any, quantity = 1) => {
    if (user) {
      // Add to database
      await addToCartDB(product, quantity);
      refreshCart();
    } else {
      // Add to local state
      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === product.id);
        
        if (existingItem) {
          return prevItems.map(item => 
            item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
          );
        } else {
          return [...prevItems, { ...product, quantity }];
        }
      });
    }
  };

  const removeFromCart = async (productId: string) => {
    if (user) {
      await removeFromCartDB(productId);
      refreshCart();
    } else {
      setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    if (user) {
      await updateCartQuantity(productId, quantity);
      refreshCart();
    } else {
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = async () => {
    if (user) {
      await clearCartDB();
      refreshCart();
    } else {
      setCartItems([]);
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    // Calculate subtotal in INR by converting each item's price
    return cartItems.reduce((total, item) => total + ((item.price * 83) * item.quantity), 0);
  };

  const getGST = () => {
    const subtotal = getSubtotal();
    return subtotal * 0.18; // 18% GST (already in INR)
  };

  const getTotal = () => {
    return getSubtotal() + getGST();
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getSubtotal,
      getGST,
      getTotal,
      refreshCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
