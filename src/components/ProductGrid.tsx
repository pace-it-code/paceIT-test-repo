"use client";
import ProductCard from "./ProductCard";


interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  stock: number;
  price: number;
  createdAt: string;
}
export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
