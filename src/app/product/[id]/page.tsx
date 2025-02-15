"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import api from "../../utils/api";

export default function ProductDetail() {
  const { id } = useParams(); // ✅ Correct way to access params
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Invalid product ID");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const res = await api.get(`/${id}`);
        setProduct(res.data.product);
      } catch (err: any) {
        console.error("Error fetching product:", err.message);
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p>⏳ Loading product...</p>;
  if (error) return <p className="text-red-500">❌ {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">{product?.name}</h1>
      <p>Price: ${product?.price}</p>
      <p>{product?.description}</p>
    </div>
  );
}
