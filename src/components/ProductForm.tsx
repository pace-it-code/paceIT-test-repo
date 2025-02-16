"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import api from "../app/utils/api";

interface ProductFormData {
  name: string;
  price: string;
  description: string;
  category: string;
  stock: string;
  images: string[];
}

export default function ProductForm() {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
    images: []
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>(""); // New state for image URL input
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddImageUrl = () => {
    if (imageUrl) {
      setFormData({ ...formData, images: [...formData.images, imageUrl] });
      setImageUrl(""); // Clear input field after adding URL
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/", formData);
      router.push("/product"); // Redirect after success
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error("❌ Axios Error:", error.response?.data || error.message);
        setError(error.response?.data?.message || "❌ Failed to load product");
        console.log(error)
      } else {
        console.error("❌ Unknown Error:", error);
        setError("❌ An unexpected error occurred.");
        
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input name="name" type="text" placeholder="Product Name" className="border p-2" onChange={handleChange} />
      <input name="price" type="number" placeholder="Price" className="border p-2" onChange={handleChange} />
      <input name="category" type="text" placeholder="Category" className="border p-2" onChange={handleChange} />
      <input name="stock" type="number" placeholder="Stock" className="border p-2" onChange={handleChange} />
      
      {/* URL Input for Images */}
      <div className="flex gap-2">
        <input 
          type="text" 
          placeholder="Image URL" 
          className="border p-2 flex-grow" 
          value={imageUrl} 
          onChange={(e) => setImageUrl(e.target.value)} 
        />
        <button 
          type="button" 
          className="btn bg-blue-500 text-white p-2 rounded" 
          onClick={handleAddImageUrl}
        >
          Add URL
        </button>
      </div>
      
      <textarea name="description" placeholder="Description" className="border p-2" onChange={handleChange} />
      <button type="submit" className="btn bg-green-500 text-white p-2 rounded" disabled={loading}>
        {loading ? "Adding..." : "Add Product"}
      </button>
      {error && <p className="text-red-500">{error}</p>}

    </form>
  );
}
