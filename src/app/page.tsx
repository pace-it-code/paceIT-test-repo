import ProductGrid from "../components/ProductGrid";
import ProductBanner from "../components/ProductBanner";
import FeaturesSection from "../components/FeatureSection";
import Testimonials from "../components/Testimonials";
import { Product } from "../../types/types";
import Categories from "@/components/Categories";

export const dynamic = "force-dynamic"; // ✅ Forces server-side rendering

export default async function ProductList() {
  let products: Product[] = [];
  let error: string | null = null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/product`, {
      cache: "no-store", // ✅ Ensures fresh data but avoids static generation issues
    });

    if (!res.ok) throw new Error("Failed to fetch products");

    const data = await res.json();

    products = data.data.map((product: Product) => ({
      id: product.id,
      name: product.name,
      description: product.description || "No description available",
      category: product.category || "Uncategorized",
      pricing: Array.isArray(product.pricing)
        ? product.pricing.map((p) => ({
            packageSize: p.packageSize || "Default",
            price: typeof p.price === "string" ? p.price : 0,
          }))
        : [],
      images: product.images?.length ? product.images : ["/images/sample-product.jpg"],
    }));
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    error = "Failed to load products";
  }

  return (
    <div className="container mx-auto px-4 py-2 flex flex-col items-center mt-28 md:mt-12 bg-cream">
      <ProductBanner />
      <Categories />

      {error ? (
        <p className="text-center text-red-500 text-lg mt-4">❌ {error}</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500 col-span-full">No products found.</p>
      ) : (
        <ProductGrid products={products} />
      )}

      <FeaturesSection />
      <Testimonials />
    </div>
  );
}
