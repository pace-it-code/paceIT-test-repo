"use client";
import React from "react";
import { useState, useEffect } from "react";
import api from "../utils/api";

import ProductCard from "../../components/ProductCard";
import { Product } from "../../../types/types";

export default function ProductList() :  React.ReactElement {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get<{ data: Product[] }>("/product"); 
        setProducts(res.data.data);
      } catch (err: unknown) { 
        console.error("Error fetching products:", err);
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
    
      <div className="grid grid-cols-3 gap-4 mt-4">
        {products.length === 0 ? <p>No products found.</p> : products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
  
  );
}
