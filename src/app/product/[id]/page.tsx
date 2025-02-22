"use client";

import { useRouter, useParams } from "next/navigation";
import { useProduct } from "../../hooks/useProduct";
import ProductImageGallery from "../../../components/ProductGallery";
import ProductDetails from "../../../components/ProductDetail";

export default function ProductDetail() {
  const params = useParams();
  const productId = params?.id as string;
  const { product, loading, error } = useProduct(productId);
  const router = useRouter();

  if (loading) return <p className="text-center text-lg">⏳ Loading product...</p>;
  if (error) return <p className="text-center text-red-500">❌ {error}</p>;
  if (!product) return <p className="text-center text-gray-500">⚠️ Product not found.</p>;

  const placeholderImage = "/placeholder.jpg";
  const productImages = product.images?.length ? product.images : [placeholderImage];

  return (
    <div className="container mx-auto px-6 py-20">
      <button onClick={() => router.back()} className="bg-gray-200 px-4 py-2 rounded mb-6">
        ⬅ Back
      </button>

      <div className="flex flex-col md:flex-row gap-10">
        <ProductImageGallery images={productImages} />
        <ProductDetails product={product} />
      </div>
    </div>
  );
}
