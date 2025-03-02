"use client";

import api from "../utils/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../hooks/useCart";
import { useUserId } from "../hooks/useId";
import Script from "next/script";

import { AddressCard } from "../../components/Addresscard";
import { CartSummary, calculateCartTotal } from "../../components/Cartsummary";
import { PaymentMethodSelector, PaymentMethod } from "../../components/Payementmethod";
import { createRazorpayOrder, verifyRazorpayPayment, createShiprocketOrder, initializeRazorpayPayment } from "../../components/Orderservice";

interface Address {
  id: string; 
  name: string;
  line1: string;
  line2?: string;
  state: string;
  city: string;
  zip: string;
  phone: string;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export default function ConfirmOrderPage() {
  const router = useRouter();
  const userId = useUserId();
  const { cart, loading, error } = useCart(userId);
  const [address, setAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('ONLINE');
  const [isProcessing, setIsProcessing] = useState(false);
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
        if (res.data.success) {
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

  const handleCODOrder = async () => {
    if (!userId || !address) return;
    setIsProcessing(true);
    
    try {
      // Create Shiprocket order directly for COD
      const orderId = await createShiprocketOrder(userId, 'COD');
      alert("Order placed successfully!");
      router.push(`/order-confirmation?orderId=${orderId}`);
    } catch (error) {
      console.error("Error processing COD order:", error);
      alert("Failed to process your order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOnlinePayment = async () => {
    if (!userId || !address) return;
    setIsProcessing(true);

    const totalAmount = calculateCartTotal(cart);

    try {
      // Create Razorpay order
      const orderId = await createRazorpayOrder(totalAmount);
      
      // Initialize Razorpay payment
      initializeRazorpayPayment(
        razorpayKey,
        orderId,
        totalAmount,
        address,
        async (response: RazorpayResponse) => {
          try {
            // Verify payment
            const isVerified = await verifyRazorpayPayment(response);
            
            if (isVerified) {
              // Create Shiprocket order
              const shiprocketOrderId = await createShiprocketOrder(userId, 'ONLINE');
              alert("Order placed successfully!");
              router.push(`/order-confirmation?orderId=${shiprocketOrderId}`);
            } else {
              alert("Payment verification failed.");
              setIsProcessing(false);
            }
          } catch (error) {
            console.error("Error handling payment verification:", error);
            alert("Error occurred while processing payment verification.");
            setIsProcessing(false);
          }
        }
      );
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Error occurred while creating order.");
      setIsProcessing(false);
    }
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === 'COD') {
      handleCODOrder();
    } else {
      handleOnlinePayment();
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
          <AddressCard address={address} />
          
          {/* Cart Summary Card */}
          <CartSummary cart={cart} />
        </div>

        {/* Payment Method Selection */}
        <div className="mt-8">
          <PaymentMethodSelector 
            selectedMethod={paymentMethod} 
            onMethodChange={setPaymentMethod} 
          />
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handlePlaceOrder}
            disabled={isProcessing}
            className={`${isProcessing ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'} transition-colors text-white px-8 py-4 rounded-full text-xl font-semibold shadow-lg`}
          >
            {isProcessing ? '⏳ Processing...' : `✅ Place Order ${paymentMethod === 'COD' ? '(COD)' : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
}