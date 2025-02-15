"use client";
import { useState, useEffect } from "react";
import api from "./utils/api"; // Axios instance
import Link from "next/link";

export default function ProductList() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/");
        setProducts(res.data.data); // Set products from API response
      } catch (err: any) {
        console.error("Error fetching products:", err.message);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>⏳ Loading products...</p>;
  if (error) return <p className="text-red-500">❌ {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Product List</h1>
      <Link href="/add" className="btn bg-blue-500 text-white p-2 rounded">Add Product</Link>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="p-4 border rounded shadow">
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p>Price: ${product.price}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
