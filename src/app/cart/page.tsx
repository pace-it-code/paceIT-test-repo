"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "../hooks/useCart";
import { useUserId } from "../hooks/useId";


export default function CartPage() {
   const router = useRouter();
  const userId = useUserId();
  const {
    cart,
    loading,
    error,
    modifyCartQuantity,
    removeCartItem,
   
    orderStatus,
    
   
  } = useCart(userId);

  const handleorder =()=>{
    router.push("/")
  }

  
  
  if (loading) {
    return <p className="text-center text-lg py-36 ">⏳ Loading cart...</p>;
  }
  
  if (error) {
    return <p className="text-center text-red-500">❌ {error}</p>;
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">🛒 Your Cart</h1>
  
      {!cart.length ? (
        <p className="text-center text-gray-500 text-2xl my-10">
          🛒 No items found in your cart.
        </p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.productId}
                className="p-4 border rounded-lg shadow-md flex items-center justify-between"
              >
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
              onClick={handleorder}
              className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-semibold"
            >
              🛒 Order Now
            </button>
          </div>
        </>
      )}
  
      {orderStatus && (
        <p className="mt-4 text-lg text-blue-600">{orderStatus}</p>
      )}
    </div>
  );
}  