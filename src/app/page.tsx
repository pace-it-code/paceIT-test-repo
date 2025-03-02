import ProductGrid from "../components/ProductGrid";
//import ProductBanner from "../components/ProductBanner";
// import FeaturesSection from "../components/FeatureSection";
import Testimonials from "../components/Testimonials";
import { Product } from "../../types/types";
// import Categories from "@/components/Categories"; // ❌ Removed since we don't need the second navbar


import ShopByCategory from "../components/ShopByCategory"; // <-- Import your new Client Component
import Whatweoffer from "../components/Whatweoffer"
import AnimatedProcess from "../components/AnimatedProcess";
import Review from "../components/Review";
import Features from "@/components/Highlight";
import Slider from "@/components/Slider";

export const dynamic = "force-dynamic"; // Forces server-side rendering

export default async function ProductList() {
  let products: Product[] = [];
  let error: string | null = null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/product`,
      { cache: "no-store" }
    );
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
      images: product.images?.length
        ? product.images
        : ["/images/sample-product.jpg"],
    }));
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    error = "Failed to load products";
  }

  return (
    <>
      {/* HERO / SLIDER */}
      <Slider />
      

      {/* SHOP BY CATEGORY (Client Component) */}
      <ShopByCategory />

      {/* HIGHLIGHT ROW */}
      <Features />
      {/* LATEST PRODUCTS (Dynamic) */}
      <section className="py-10 bg-[#f9f9f9]">
        <div className="container mx-auto text-center">
          <h2 className="mb-8 text-2xl font-semibold">Latest Products</h2>
          {error ? (
            <p className="text-red-500 text-lg">❌ {error}</p>
          ) : products.length === 0 ? (
            <p className="text-gray-500">No products found.</p>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </section>
      <AnimatedProcess />
       
      <Whatweoffer/>

     {/* PROCESS (REPLACES SECOND NAVBAR) */}
     

      {/* FEATURES SECTION
      <section>
        <FeaturesSection />
      </section> */}
      <Review />

      

      {/* TESTIMONIALS */}
      <section className="py-10 bg-[#f9f9f9]">
        <Testimonials />
      </section>

      {/* FOOTER */}
      <footer className="bg-[#4f8e42] text-white py-5 text-center">
        {/* ... same as before ... */}
      </footer>

      {/* SLIDER SCRIPT */}
      
    </>
  );
}
