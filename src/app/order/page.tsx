"use client";

import { v4 as uuidv4 } from 'uuid';
import api from "../utils/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../hooks/useCart";
import { useUserId } from "../hooks/useId";
import { CartItem } from "../hooks/useCart";
import Image from "next/image";
import Script from "next/script";
import axios from 'axios';

interface Address {
  id: string; 
  line1: string;
  line2?: string;
  state: string;
  city: string;
  zip: string;
  phone: string;
}
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  order_id: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  prefill: { contact: string };
  theme: { color: string };
  handler: (response: RazorpayResponse) => void;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
interface RazorpayInstance {
  open: () => void;
}

interface PaymentOrderResponse {
  id: string;
}


export default function ConfirmOrderPage() {
  const router = useRouter();
  const userId = useUserId();
  const { cart, loading, error } = useCart(userId);
  const [address, setAddress] = useState<Address | null>(null);
  const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

if (!razorpayKey) {
  throw new Error("Razorpay key is missing. Please set NEXT_PUBLIC_RAZORPAY_KEY_ID in environment variables.");
}


  useEffect(() => {
    const fetchAddress = async () => {
      if (!userId) return;
      try {
        const res = await api.get<{ success: boolean; data: Address }>(
          `/address?userId=${userId}`
        );
        if (res.data.success ) {
          setAddress(res.data.data);
        } else {
          alert("No address found. Please add an address before placing an order.");
          router.push("/address");
        }
      } catch (err) {
        console.error("Error fetching address:", err);
      }
    };
    fetchAddress();
  }, [userId, router]);

  const handlePlaceOrder = async () => {
    if (!userId || !address) return;

    const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    try {
      const res = await axios.post<PaymentOrderResponse>("/api/createOrder", {
        amount: totalAmount * 100,
      });
      const data = res.data;
      if (!data || !data.id) {
        alert("Failed to create payment order.");
        return;
      }

      const paymentData = {
        key: razorpayKey,
        order_id: data.id,
        amount: totalAmount * 100,
        currency: "INR",
        name: "Your Store Name",
        description: "Order Payment",
        prefill: { contact: address.phone },
        theme: { color: "#3399cc" },
        handler: async (response: RazorpayResponse) => {
          try {
            const verifyRes = await axios.post<{ isOk: boolean }>("/api/verifyOrder", {
              orderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (verifyRes.data.isOk) {
              const shiprocketResponse = await axios.post<{ success: boolean; data?: { order_id?: string }; error?: string }>(
                "/api/ship",
                { userId },
                { headers: { "Content-Type": "application/json" } }
              );

              if (shiprocketResponse.data.success) {
                const createdOrderId = shiprocketResponse.data.data?.order_id;
                alert("Order placed successfully in Shiprocket!");
                if (createdOrderId) {
                  router.push(`/order-confirmation?orderId=${createdOrderId}`);
                }
              } else {
                console.error("Shiprocket Order Error:", shiprocketResponse.data.error);
                alert("Failed to create order in Shiprocket. Please try again.");
              }
            } else {
              alert("Payment verification failed.");
            }
          } catch (error) {
            console.error("Error handling payment verification:", error);
            alert("Error occurred while processing payment verification.");
          }
        },
      };

      const payment = new (window).Razorpay(paymentData);
      payment.open();
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Error occurred while creating order.");
    }
  };

  if (loading) return <p className="text-center text-lg py-10">Loading cart...</p>;
  if (error) return <p className="text-center text-red-500 py-10">Error loading cart: {error}</p>;
  if (!address) return <p className="text-center text-lg py-10">Loading address...</p>;
  
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-white py-12">
      <Script
        type="text/javascript"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Confirm Your Order
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Delivery Address Card */}
          <div className="border p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Delivery Address
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>{address.line1}</p>
              {address.line2 && <p>{address.line2}</p>}
              <p>
                {address.city}, {address.state} {address.zip}
              </p>
              <p className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H5a2 2 0 00-2 2v5a2 2 0 002 2z" />
                </svg>
                {address.phone}
              </p>
            </div>
          </div>
          {/* Cart Summary Card */}
          <div className="border p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Cart Summary
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {cart.map((item: CartItem) => {
                const imageUrl =
                  (Array.isArray(item.images) ? item.images[0] : item.images) ||
                  "/images.png";

                return (
                  <div key={uuidv4()} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={imageUrl}
                        alt={item.name ?? "Unnamed Product"}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="font-semibold text-lg text-gray-800">{item.name}</p>
                      {item.packageSize && (
                        <p className="text-sm text-gray-500">Size: {item.packageSize}</p>
                      )}
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-600">Price: ₹{item.price}</p>
                      <p className="text-xs text-gray-400">
                        Added at: {new Date(item.addedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 border-t pt-4">
              <div className="flex justify-between items-center">
                <p className="text-lg font-medium text-gray-700">
                  Total Items: {cart.length}
                </p>
                <p className="text-lg font-bold text-indigo-600">
                  ₹
                  {cart.reduce(
                    (acc, item) => acc + item.price * item.quantity,
                    0
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <button
            onClick={handlePlaceOrder}
            className="bg-green-500 hover:bg-green-600 transition-colors text-white px-8 py-4 rounded-full text-xl font-semibold shadow-lg"
          >
            ✅ Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
