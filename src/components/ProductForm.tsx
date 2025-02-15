"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from ".././app/utils/api";

export default function ProductForm() {
  const [formData, setFormData] = useState({ name: "", price: "", description: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/", formData);
      router.push("/product"); // Redirect after success
    } catch (err: any) {
      console.error("Error adding product:", err.response ? err.response.data : err.message);
      setError("Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input name="name" type="text" placeholder="Product Name" className="border p-2" onChange={handleChange} />
      <input name="price" type="number" placeholder="Price" className="border p-2" onChange={handleChange} />
      <textarea name="description" placeholder="Description" className="border p-2" onChange={handleChange} />
      <button type="submit" className="btn bg-green-500 text-white p-2 rounded" disabled={loading}>
        {loading ? "Adding..." : "Add Product"}
      </button>
    </form>
  );
}
