"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import api from "../utils/api";
import Image from "next/image";

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
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");

  const isFetchingRef = useRef(false);
  const quantityChanges = useRef<Record<string, number>>({}); // ✅ Stores the final quantity of each product
  const latestCartRef = useRef<CartItem[]>([]); // ✅ Stores latest cart state

  // ✅ Get userId safely in useEffect to prevent SSR issues
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId") ?? "";
      setUserId(storedUserId);
    }
  }, []);

  // ✅ Fetch Cart Items
  const fetchCartItems = useCallback(async () => {
    if (!userId || isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      const res = await api.get(`/cart?userId=${userId}`);
      console.log("🛒 Fetched Cart Data:", res.data);
      setCart(res.data.cart);
      latestCartRef.current = res.data.cart;
    } catch (error) {
      console.error("❌ Error fetching cart:", error);
      setError("Failed to load cart");
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, [userId]);

  // ✅ Modify Cart Quantity
  const modifyCartQuantity = (productId: string, change: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId ? { ...item, quantity: item.quantity + change } : item
      )
    );

    // ✅ Store the latest quantity (NOT incremental)
    const updatedCart = latestCartRef.current.map((item) =>
      item.productId === productId ? { ...item, quantity: item.quantity + change } : item
    );

    latestCartRef.current = updatedCart; // ✅ Update reference state
    quantityChanges.current[productId] = updatedCart.find((item) => item.productId === productId)?.quantity || 0;
  };

  // ✅ Send Quantity Updates
  const sendQuantityUpdates = useCallback(async () => {
    if (!userId || Object.keys(quantityChanges.current).length === 0) return;

    try {
      console.log("🔄 Sending only final quantity updates:", quantityChanges.current);
      await Promise.all(
        Object.entries(quantityChanges.current).map(([productId, quantity]) =>
          api.put("/cart", { userId, productId, quantity })
        )
      );
      console.log("✅ Quantity updates successful!");
      quantityChanges.current = {}; // ✅ Reset after successful update
    } catch (error) {
      console.error("❌ Error updating cart quantities:", error);
    }
  }, [userId]);

  // ✅ Periodic Cart Updates
  useEffect(() => {
    if (!userId) return;
    fetchCartItems();
    const interval = setInterval(() => {
      sendQuantityUpdates();
    }, 5000);
    return () => clearInterval(interval);
  }, [userId, fetchCartItems, sendQuantityUpdates]);

  // ✅ Remove Cart Item
  const removeCartItem = async (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
    latestCartRef.current = latestCartRef.current.filter((item) => item.productId !== productId);
    delete quantityChanges.current[productId];

    try {
      await api.delete(`/cart?userId=${userId}&productId=${productId}`);
    } catch (error) {
      console.error("❌ Error removing item:", error);
    }
  };

  // ✅ Place Order
  const placeOrder = async () => {
    if (!userId) return alert("User ID not found!");
    if (cart.length === 0) return alert("Cart is empty!");

    try {
      setOrderStatus("Placing order...");
      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Order placement failed");

      console.log("✅ Order placed:", data);
      setOrderStatus("🎉 Order Confirmed!");
      setCart([]);
      latestCartRef.current = [];
    } catch (error) {
      if (error instanceof Error) {
        console.error("❌ Order Error:", error.message);
        setOrderStatus(`Error: ${error.message}`);
      } else {
        console.error("❌ Unknown Order Error:", error);
        setOrderStatus("❌ Order placement failed.");
      }
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
            {/* ✅ Use `next/image` with placeholder */}
            <Image
              src={item.images?.[0] ?? "/images.png"}
              alt={item.name}
              width={80}
              height={80}
              className="object-cover rounded"
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

      <div className="mt-6">
        <button
          onClick={placeOrder}
          className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-semibold"
        >
          🛒 Order Now
        </button>
      </div>

      {orderStatus && <p className="mt-4 text-lg text-blue-600">{orderStatus}</p>}
    </div>
  );
}
