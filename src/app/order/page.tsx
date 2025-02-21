"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../hooks/useCart";
import { useUserId } from "../hooks/useId";

interface Address {
  id: string; 
  line1: string;
  line2?: string;
  state: string;
  city: string;
  zip: string;
  phone: string;
}

export default function ConfirmOrderPage() {
  const router = useRouter();
  const userId = useUserId();
  const { cart, loading, error } = useCart(userId);

  const [address, setAddress] = useState<Address | null>(null);

  useEffect(() => {
    const fetchAddress = async () => {
      if (!userId) return;
      try {
        const res = await fetch(`/api/address?userId=${userId}`);
        const data = await res.json();
        if (data?.success && Array.isArray(data.data) && data.data.length > 0) {
          setAddress(data.data[0]); // Automatically select the first address
        } else {
          alert("No address found. Please add an address before placing an order.");
          router.push("/address"); // Redirect to address page if no address is found
        }
      } catch (err) {
        console.error("Error fetching address:", err);
      }
    };
    fetchAddress();
  }, [userId, router]);

  const handlePlaceOrder = async () => {
    if (!userId || !address) return;

    const response = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, addressId: address.id }),
    });

    const data = await response.json();

    if (data?.success) {
      alert("Order placed successfully!");
      router.push("/order");
    } else {
      alert("Failed to place order.");
    }
  };

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p>Error loading cart: {error}</p>;
  if (!address) return <p>Loading address...</p>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">🧾 Confirm Your Order</h1>

      <h2 className="text-xl font-semibold mb-2">Delivery Address:</h2>
      <div className="p-4 border rounded-lg mb-4">
        <p>{address.line1}</p>
        {address.line2 && <p>{address.line2}</p>}
        <p>{address.city}, {address.state}, {address.zip}</p>
        <p>📞 {address.phone}</p>
      </div>

      <h2 className="text-xl font-semibold mb-2">Cart Summary:</h2>
      {cart.map((item) => (
        <div key={item.productId} className="p-2 border rounded mb-2">
          {item.name} - Quantity: {item.quantity} - Price: ${item.price}
        </div>
      ))}

      <button
        onClick={handlePlaceOrder}
        className="bg-green-500 text-white px-6 py-3 rounded-lg mt-4"
      >
        ✅ Place Order
      </button>
    </div>
  );
}
