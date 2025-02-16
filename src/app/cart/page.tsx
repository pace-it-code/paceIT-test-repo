"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import api from "../utils/api";
// ✅ Import debounce from lodash

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  images?: string[];
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const isFetchingRef = useRef(false);
  const quantityChanges = useRef<Record<string, number>>({}); // ✅ Stores pending updates

  useEffect(() => {
    if (!userId) return;

    fetchCartItems();

    // ✅ Polling with throttling: fetch cart updates every 10 sec
    const interval = setInterval(() => {
      if (!isFetchingRef.current) {
        fetchCartItems();
      }
      sendQuantityUpdates(); // ✅ Send batched quantity updates every 10s
    }, 5000);

    return () => clearInterval(interval);
  }, [userId]);

  const fetchCartItems = async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      const res = await api.get(`/cart?userId=${userId}`);
      console.log("🛒 Fetched Cart Data:", res.data);
      setCart(res.data.cart);
    } catch (error) {
      console.error("❌ Error fetching cart:", error);
      setError("Failed to load cart");
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  };

  // ✅ Track clicks locally without immediate API call
  const modifyCartQuantity = (productId: string, change: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId ? { ...item, quantity: item.quantity + change } : item
      )
    );

    if (!quantityChanges.current[productId]) {
      quantityChanges.current[productId] = 0;
    }
    quantityChanges.current[productId] += change; // ✅ Accumulate changes
  };

  // ✅ Send batched quantity updates every 10 seconds
  const sendQuantityUpdates = async () => {
    const updates = Object.entries(quantityChanges.current);
    if (updates.length === 0) return;

    try {
      console.log("🔄 Sending batched quantity updates:", updates);
      await Promise.all(
        updates.map(([productId, change]) =>
          api.put("/cart", { userId, productId, quantity: change })
        )
      );
      console.log("✅ Quantity updates successful!");
      quantityChanges.current = {}; // ✅ Reset accumulated changes
    } catch (error) {
      console.error("❌ Error updating cart quantities:", error);
    }
  };

  const removeCartItem = async (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));

    try {
      await api.delete(`/cart?userId=${userId}&productId=${productId}`);
    } catch (error) {
      console.error("❌ Error removing item:", error);
    }
  };

  if (loading) return <p className="text-center text-lg">⏳ Loading cart...</p>;
  if (error) return <p className="text-center text-red-500">❌ {error}</p>;
  if (!cart.length) return <p className="text-center text-gray-500">🛒 Cart is empty.</p>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">🛒 Your Cart</h1>

      <div className="space-y-4">
        {cart.map((item) => (
          <div key={item.productId} className="p-4 border rounded-lg shadow-md flex items-center justify-between">
            <img
              src={item.images?.[0] || "/placeholder.jpg"}
              alt={item.name}
              className="w-20 h-20 object-cover rounded"
            />
            <div className="flex-grow px-4">
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="text-gray-700">Price: ${item.price}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => modifyCartQuantity(item.productId, -1)}
                className="px-3 py-2 bg-gray-300 rounded text-black"
              >
                ➖
              </button>
              <span className="text-lg font-semibold">{item.quantity}</span>
              <button
                onClick={() => modifyCartQuantity(item.productId, 1)}
                className="px-3 py-2 bg-gray-300 rounded text-black"
              >
                ➕
              </button>
            </div>
            <button
              onClick={() => removeCartItem(item.productId)}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              ❌ Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
