import ProductGrid from "../components/ProductGrid";
import ProductBanner from "../components/ProductBanner";
import FeaturesSection from "../components/FeatureSection";
import Testimonials from "../components/Testimonials";

interface Product {
  id: number;
  name: string;
  price: number | string | null;
  images: string[];
}

export default async function ProductList() {
  let products: Product[] = [];
  let error: string | null = null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/product`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch products");

    const data = await res.json();
    products = data.data.map((product: any) => ({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price) || 0,
      images: product.images || ["/images/sample-product.jpg"],
    }));
  } catch (err) {
    console.error("Error fetching products:", err);
    error = "Failed to load products";
  }

  return (
    <div className="container mx-auto px-4 py-2 flex flex-col items-center mt-28 md:mt-36 bg-cream">
    <h1 className="text-6xl font-bold text-greens text-center">Welcome to Our Store</h1>
    <p className="text-lg text-darkgray mt-2">Find the best deals on high-quality products.</p>
  
  
     

      <ProductBanner />
      <h1 className="text-2xl font-bold text-center mb-3">Product List</h1>
      
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
