"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "../../utils/api";

interface Product {
  id: string;
  name: string;
  price: number | string;
  images?: string[];
  category: string;
  stock: number;
  description: string;
}

export default function ProductDetail() {
  const params = useParams();
  const productId = params?.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1); // ✅ Default quantity is 1
  const [adding, setAdding] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const res = await api.get(`/product/${productId}`);
        console.log("📦 Fetched Product Data:", res.data);
        setProduct(res.data.data);
      } catch (err) {
        console.error("❌ Error fetching product:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // ✅ Handle Quantity Change
  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1)); // ✅ Minimum quantity is 1
  };

  // ✅ Optimistic UI Add to Cart
  const addToCart = async () => {
    if (!product || quantity < 1) return;
    setAdding(true);

    try {
      await api.put("/cart", {
        userId: "8KKj9YgkkVZ66UOx00u1dT7Xk4F2",
        productId: product.id,
        quantity: quantity,
      });
      alert(`✅ ${quantity} item(s) added to cart!`);
    } catch (err) {
      console.error("❌ Error adding to cart:", err);
      alert("⚠️ Failed to add product to cart.");
    } finally {
      setAdding(false);
    }
  };

  // ✅ Handle Loading & Error States
  if (loading) return <p className="text-center text-lg">⏳ Loading product...</p>;
  if (error) return <p className="text-center text-red-500">❌ {error}</p>;
  if (!product) return <p className="text-center text-gray-500">⚠️ Product not found.</p>;

  return (
    <div className="container mx-auto px-4 py-6">
      <button onClick={() => router.back()} className="bg-gray-200 px-4 py-2 rounded mb-4">
        ⬅ Back
      </button>

      <div className="flex flex-col md:flex-row gap-6">
        {/* ✅ Product Image */}
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full md:w-1/2 h-auto object-cover rounded-lg shadow-md"
          />
        ) : (
          <div className="w-full md:w-1/2 h-auto bg-gray-200 flex items-center justify-center rounded-lg">
            <p className="text-gray-500">No Image Available</p>
          </div>
        )}

        {/* ✅ Product Details */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-lg text-gray-700 mt-2">{product.description}</p>
          <p className="text-xl font-semibold mt-4">Price: ${product.price}</p>
          <p className="text-md text-gray-600">Category: {product.category}</p>
          <p className="text-md text-gray-600">Stock: {product.stock}</p>

          {/* ✅ Quantity Controls */}
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={decreaseQuantity}
              className="px-4 py-2 bg-gray-300 text-black rounded-lg"
              disabled={quantity === 1}
            >
              ➖
            </button>
            <span className="text-lg font-semibold">{quantity}</span>
            <button
              onClick={increaseQuantity}
              className="px-4 py-2 bg-gray-300 text-black rounded-lg"
            >
              ➕
            </button>
          </div>

          {/* ✅ Optimized Add to Cart Button */}
          <button
            onClick={addToCart}
            className={`mt-4 px-6 py-3 rounded-lg text-white ${
              adding ? "bg-green-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={adding}
          >
            {adding ? "Adding..." : `➕ Add ${quantity} to Cart`}
          </button>
        </div>
      </div>
    </div>
  );
}
