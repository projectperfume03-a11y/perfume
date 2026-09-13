import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api.js';

const CartContext = createContext(null);
const STORAGE_KEY = 'roya_cart';
const SHIPPING_KEY = 'roya_shipping_cost';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);
  const [shippingCost, setShippingCost] = useState(() => {
    const saved = localStorage.getItem(SHIPPING_KEY);
    const parsed = parseFloat(saved);
    return !isNaN(parsed) && parsed >= 0 ? parsed : 7;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const refreshShippingCost = async () => {
    try {
      const data = await api.get('/settings');
      if (data && typeof data.shippingCost === 'number') {
        setShippingCost(data.shippingCost);
        localStorage.setItem(SHIPPING_KEY, data.shippingCost.toString());
      }
    } catch {
      // Fallback au coût actuel
    }
  };

  useEffect(() => {
    refreshShippingCost();
  }, []);

  const addItem = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product._id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product._id
            ? { ...i, quantity: Math.min(i.quantity + quantity, 99) }
            : i,
        );
      }
      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
        },
      ];
    });
    setIsOpen(true);
  };

  const removeItem = (productId) =>
    setItems((prev) => prev.filter((i) => i.productId !== productId));

  const updateQuantity = (productId, quantity) =>
    setItems((prev) =>
      prev
        .map((i) =>
          i.productId === productId ? { ...i, quantity: Math.max(0, quantity) } : i,
        )
        .filter((i) => i.quantity > 0),
    );

  const clearCart = () => setItems([]);

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items],
  );
  const count = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const grandTotal = useMemo(
    () => (items.length > 0 ? total + shippingCost : 0),
    [total, shippingCost, items.length],
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        count,
        shippingCost,
        grandTotal,
        setShippingCost,
        refreshShippingCost,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart doit être utilisé dans CartProvider');
  return ctx;
}
