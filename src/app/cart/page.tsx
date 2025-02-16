"use client";

import { useEffect, useState } from "react";
import api from "../utils/api";

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

  const userId = "8KKj9YgkkVZ66UOx00u1dT7Xk4F2";

  // ✅ Fetch cart items initially
  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const res = await api.get(`/cart?userId=${userId}`);
      console.log("🛒 Fetched Cart Data:", res.data);
      setCart(res.data.cart);
    } catch (error) {
      console.error("❌ Error fetching cart:", error);
      setError("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Optimistic UI: Update cart instantly & sync with API
  const updateCartItem = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    // ✅ Instantly update UI before API call
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      )
    );

    try {
      await api.put("/cart", {
        userId,
        productId,
        quantity: newQuantity,
      });
    } catch (error) {
      console.error("❌ Error updating cart:", error);
    }
  };

  // ✅ Optimistic UI: Remove cart item instantly
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
            {/* ✅ Product Image */}
            <img
              src={item.images?.[0] || "/placeholder.jpg"}
              alt={item.name}
              className="w-20 h-20 object-cover rounded"
            />

            {/* ✅ Product Details */}
            <div className="flex-grow px-4">
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="text-gray-700">Price: ${item.price}</p>
            </div>

            {/* ✅ Quantity Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => updateCartItem(item.productId, item.quantity - 1)}
                className="px-3 py-2 bg-gray-300 rounded text-black"
              >
                ➖
              </button>
              <span className="text-lg font-semibold">{item.quantity}</span>
              <button
                onClick={() => updateCartItem(item.productId, item.quantity + 1)}
                className="px-3 py-2 bg-gray-300 rounded text-black"
              >
                ➕
              </button>
            </div>

            {/* ❌ Remove Button */}
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
