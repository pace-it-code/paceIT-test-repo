import { useEffect, useState } from "react";
import api from "../../app/utils/api";  
import { Pricing } from "../../../types/types";
  export interface Product {
      id: string;                 // Firestore-generated Product ID
      name: string;               // Product Name (e.g., 'Bayer Evergol Xtend')
      description: string;        // Detailed Product Description          
      category: string;           // Category (e.g., 'Seed Treatment')
      pricing:Pricing[];
      images: string[];           // Array of image URLs
      createdAt: string;          // Timestamp of product creation
      manufacturer: string;       // Manufacturer Name (e.g., 'Bayer Crop Science')
      composition: string;        // Composition / Technical details
      commonlyUsedFor: string[];  // List of crops commonly used for (e.g., ['corn', 'soybean', 'cereals', 'pulses', 'rice'])
      avoidForCrops: string[];    // Crops to avoid usage (e.g., ['wheat', 'hybrid seed'])
      dosage: {
        method: string;           // Dosage method (e.g., 'Mix with water and rub on seeds')
        dosage:{dose:string,acre:string}
      };
      benefits: string[];         // List of product benefits
    }
 
export const useProduct = (productId: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const res = await api.get(`/product/${productId}`);
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

  return { product, loading, error };
};