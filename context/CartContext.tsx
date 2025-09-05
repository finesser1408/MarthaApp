import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
  imageKey?: string;
  image?: any; // fallback support
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, newQuantity: number) => void;
  clearCart: () => void;
  getCount: () => number;
  getSubtotal: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Try to load AsyncStorage lazily to avoid crash if not installed yet
  let AsyncStorage: any = undefined;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    AsyncStorage = require('@react-native-async-storage/async-storage').default;
  } catch (e) {
    AsyncStorage = undefined;
  }

  const STORAGE_KEY = 'cart_items_v1';

  // Hydrate from storage on mount
  useEffect(() => {
    const hydrate = async () => {
      try {
        if (!AsyncStorage) return;
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
          const parsed = JSON.parse(json);
          if (Array.isArray(parsed)) setItems(parsed as CartItem[]);
        }
      } catch (_) {
        // ignore hydration errors
      }
    };
    hydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const updateQuantity = (id: string, newQuantity: number) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, newQuantity) } : i)));
  };

  const clearCart = () => setItems([]);

  const getCount = () => items.reduce((sum, i) => sum + i.quantity, 0);

  const getSubtotal = () => items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const value = useMemo(
    () => ({ items, addToCart, removeItem, updateQuantity, clearCart, getCount, getSubtotal }),
    [items]
  );

  // Persist when items change
  useEffect(() => {
    const persist = async () => {
      try {
        if (!AsyncStorage) return;
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch (_) {
        // ignore persist errors
      }
    };
    persist();
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};
