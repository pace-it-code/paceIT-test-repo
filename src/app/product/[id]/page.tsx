"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "../../utils/api";

interface Product {
  id: string;
  name: string;
  price: number | string;
  images?: string[]; // Optional since your API response does not include images
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
  const router = useRouter();

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const res = await api.get(`/${productId}`);
        console.log("Fetched Product Data:", res.data); // Debugging
        setProduct(res.data.data); // ✅ Fix applied here
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) return <p className="text-center text-lg">⏳ Loading product...</p>;
  if (error) return <p className="text-center text-red-500">❌ {error}</p>;
  if (!product) return <p className="text-center text-gray-500">Product not found.</p>;

  return (
    <div className="container mx-auto px-4 py-6">
      <button onClick={() => router.back()} className="bg-gray-200 px-4 py-2 rounded mb-4">⬅ Back</button>
      <div className="flex flex-col md:flex-row gap-6">
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
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-lg text-gray-700 mt-2">{product.description}</p>
          <p className="text-xl font-semibold mt-4">Price: ${product.price}</p>
          <p className="text-md text-gray-600">Category: {product.category}</p>
          <p className="text-md text-gray-600">Stock: {product.stock}</p>
        </div>
      </div>
    </div>
  );
}
