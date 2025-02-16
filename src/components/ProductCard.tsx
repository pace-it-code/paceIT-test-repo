import Link from "next/link";
import Image from "next/image";

export  default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`} className="p-4 border rounded shadow hover:shadow-md block bg-white">
      <div className="w-full h-36 md:h-48 bg-gray-200 flex items-center justify-center rounded-md mb-2 text-cream">
        <p className="text-greens text-sm md:text-base">Image Placeholder (300x200)</p>
      </div>
      <h2 className="text-lg font-semibold text-greens">{product.name}</h2>
      <p className="text-darkgray">{product.description}</p>
      <p className="text-warmbrown">Category: {product.category}</p>
      <p className="text-warmbrown">Stock: {product.stock}</p>
      <p className="font-semibold text-cream">Price: ${product.price}</p>
    </Link>
  );
}

