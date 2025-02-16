"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../app/utils/api";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  category: string;
  images?: string[];
}

export default function ProductDetail({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await api.get(`/product/${id}`);
        setProduct(res.data.product);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("❌ Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ✅ Handle loading & error states
  if (loading) return <p className="text-center text-lg">⏳ Loading product...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!product) return <p className="text-center text-gray-500">⚠️ Product not found.</p>;

  // ✅ Ensure a fallback image exists
  const productImages = product.images && product.images.length > 0 ? product.images : ["/placeholder.jpg"];

  return (
    <div className="container mx-auto p-4">
      {/* Back Button */}
      <button onClick={() => router.back()} className="bg-gray-200 px-4 py-2 rounded mb-6">
        ⬅ Back
      </button>

      {/* Product Details */}
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p className="text-lg text-gray-600">Price: ${product.price}</p>
      <p className="text-gray-700">{product.description}</p>
      <p className="text-md text-gray-500">Stock: {product.stock}</p>
      <p className="text-md text-gray-500">Category: {product.category}</p>

      {/* Display Product Images */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Images:</h2>
        <div className="grid grid-cols-3 gap-2">
          {productImages.map((image, index) => (
            <div key={index} className="relative w-full h-48 rounded-lg shadow-md overflow-hidden">
              <Image 
                src={image} 
                alt={`Product Image ${index + 1}`} 
                layout="fill" 
                objectFit="cover" 
                className="rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
