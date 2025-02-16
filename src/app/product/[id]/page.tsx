"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "../../utils/api";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

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
  const [quantity, setQuantity] = useState<number>(1);
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
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
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
    <div className="container mx-auto px-6 py-20">
      {/* Back Button */}
      <button onClick={() => router.back()} className="bg-gray-200 px-4 py-2 rounded mb-6">
        ⬅ Back
      </button>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Left Side - Thumbnails & Main Image */}
        <div className="w-full md:w-1/2 flex gap-4 relative">
          {/* Thumbnails */}
          <div className="h-auto flex flex-col gap-3 w-20">
            {product.images?.map((img, index) => (
              <div key={index} className="w-20 h-20 border rounded-lg overflow-hidden">
                <Image
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full cursor-pointer hover:border-blue-500"
                />
              </div>
            ))}
          </div>

          {/* Main Image */}
          <div className="w-full border rounded-lg shadow-md overflow-hidden relative">
            <Swiper navigation className="w-full">
              {product.images?.map((img, index) => (
                <SwiperSlide key={index}>
                  <Image src={img} alt="Main Product Image" width={500} height={500} className="w-full object-cover" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* Right Side - Product Details */}
        <div className="w-full md:w-1/2 flex flex-col">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-lg text-gray-700 mt-2">{product.description}</p>
          <p className="text-md text-gray-600">Category: {product.category}</p>
          <p className="text-md text-gray-600">Stock: {product.stock}</p>

          {/* Floating Purchase Box */}
          <div className="bg-white shadow-lg border p-6 rounded-lg mt-6 w-full md:w-3/4">
            <p className="text-2xl font-bold">₹{product.price}</p>
            <p className="text-gray-600">Inclusive of all taxes</p>

            {/* Quantity Selection */}
            <div className="mt-4">
              <p className="font-semibold">Quantity:</p>
              <div className="flex gap-3 mt-2">
                <button onClick={decreaseQuantity} className="px-4 py-2 bg-gray-200 rounded-md">
                  ➖
                </button>
                <p className="text-lg font-bold">{quantity}</p>
                <button onClick={increaseQuantity} className="px-4 py-2 bg-gray-200 rounded-md">
                  ➕
                </button>
              </div>
            </div>

            {/* Add to Cart & Buy Now */}
            <div className="mt-4 flex flex-col gap-3">
              <button
                onClick={addToCart}
                className={`w-full bg-yellow-500 text-white py-2 rounded-md font-semibold ${
                  adding ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={adding}
              >
                {adding ? "Adding..." : "🛒 Add to Cart"}
              </button>
              <button className="w-full bg-orange-500 text-white py-2 rounded-md font-semibold">⚡ Buy Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
