"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

interface ProductFormData {
  name: string;
  price: string;
  description: string;
  category: string;
  stock: string;
  images: File[];
  manufacturer: string;
  composition: string;
  commonlyUsedFor: string[];
  avoidForCrops: string[];
  benefits: string[];
  method: string;
  doses: Dose[];
}

interface Dose {
  quantity: string;
  seedWeight: string;
  price: number;
}

export default function ProductForm() {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
    images: [],
    manufacturer: "",
    composition: "",
    commonlyUsedFor: [],
    avoidForCrops: [],
    benefits: [],
    method: "",
    doses: []
  });

  const [dose, setDose] = useState<Dose>({
    quantity: "",
    seedWeight: "",
    price: 0,
  });

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value.split(",").map((item) => item.trim()),
    });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, images: Array.from(e.target.files) });
    }
  };

  const handleDoseChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDose({ ...dose, [e.target.name]: e.target.value });
  };

  const addDose = () => {
    setFormData({ ...formData, doses: [...formData.doses, dose] });
    setDose({ quantity: "", seedWeight: "", price: 0 });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Check for missing required fields
    const requiredFields = [
      "name",
      "description",
      "category",
      "stock",
      "manufacturer",
      "composition",
      "method"
    ];

    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof ProductFormData]
    );

    if (missingFields.length > 0) {
      setError(`Missing required fields: ${missingFields.join(", ")}`);
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "images" && Array.isArray(value)) {
          value.forEach((image: File) => data.append("images", image));
        } else if (key === "doses") {
          data.append("doses", JSON.stringify(value));
        } else if (Array.isArray(value)) {
          data.append(key, JSON.stringify(value));
        } else {
          data.append(key, value as string);
        }
      });

      await axios.post("/api/product", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      router.push("/product");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error("Axios Error:", error.response?.data || error.message);
        setError(error.response?.data?.message || "Failed to add product");
      } else {
        console.error("Unknown Error:", error);
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };



  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {Object.keys(formData).map((field) =>
        field !== "images" && field !== "doses" &&
        field !== "commonlyUsedFor" && field !== "avoidForCrops" && field !== "benefits" ? (
          <input
            key={field}
            name={field}
            type="text"
            placeholder={field}
            className="border p-2"
            onChange={handleChange}
          />
        ) : field === "images" ? (
          <input
            key={field}
            type="file"
            multiple
            accept="image/*"
            className="border p-2"
            onChange={handleImageChange}
          />
        ) : (
          <input
            key={field}
            name={field}
            type="text"
            placeholder={`${field} (comma separated)`}
            className="border p-2"
            onChange={handleArrayChange}
          />
        )
      )}

      <div className="flex gap-2">
        <input
          name="quantity"
          type="text"
          placeholder="Quantity"
          className="border p-2"
          onChange={handleDoseChange}
          value={dose.quantity}
        />
        <input
          name="seedWeight"
          type="text"
          placeholder="Seed Weight"
          className="border p-2"
          onChange={handleDoseChange}
          value={dose.seedWeight}
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          className="border p-2"
          onChange={handleDoseChange}
          value={dose.price}
        />
        <button
          type="button"
          className="btn bg-blue-500 text-white p-2 rounded"
          onClick={addDose}
        >
          Add Dose
        </button>
      </div>

      <button
        type="submit"
        className="btn bg-green-500 text-white p-2 rounded"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Product"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
