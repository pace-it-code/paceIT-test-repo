// components/cart/CartSummary.tsx
import React from 'react';
import Image from "next/image";
import { v4 as uuidv4 } from 'uuid';

export interface CartItem {
  name: string;
  productId?: string;
  images?: string | string[];
  packageSize?: string;
  quantity: number;
  price: number;
  addedAt: string | number | Date;
}

interface CartSummaryProps {
  cart: CartItem[];
}

export const CartSummary: React.FC<CartSummaryProps> = ({ cart }) => {
  return (
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
  );
};

// Helper function to calculate total amount
export const calculateCartTotal = (cart: CartItem[]): number => {
  return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
};