import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface PricingOption {
  packageSize: string;
  price: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  pricing?: PricingOption[]; // Made optional with ? to avoid undefined errors
  images?: string[];
}

export default function ProductCard({ product }: { product: Product }) {
  const [selectedPrice, setSelectedPrice] = useState<PricingOption | null>(null);

  // Ensure at least one image exists, otherwise use a placeholder
  const productImage = product.images?.[0]
    ? product.images[0].replace('/upload/', '/upload/f_auto,q_auto/')
    : "/images.png";

  return (
    <div className="p-4 border rounded shadow hover:shadow-md block bg-white">
      <Link href={`/product/${product.id}`} className="block">
        <div className="w-full h-36 md:h-48 relative rounded-md mb-2 overflow-hidden">
          <Image
            src={productImage}
            alt={product.name}
            fill
            className="rounded-md"
            priority
          />
        </div>

        <h2 className="text-lg font-light text-greens text-center">{product.name}</h2>
        <p className="text-darkgray line-clamp-2">{product.description}</p>
        <p className="text-warmbrown">Category: {product.category}</p>
      </Link>

      {/* Pricing Options outside of Link to avoid redirection on click */}
      <div className="mt-2">
        <label htmlFor="pricing" className="block text-sm font-medium text-gray-700">
          Select Package Size
        </label>
        <select
          id="pricing"
          name="pricing"
          className="border p-2 w-full rounded-md"
          onChange={(e) => {
            const selected = product.pricing?.find(
              (p) => p.packageSize === e.target.value
            );
            setSelectedPrice(selected || null);
          }}
        >
          <option value="">Choose a size</option>
          {(product.pricing ?? []).map((option, index) => (
            <option key={index} value={option.packageSize}>
              {option.packageSize}
            </option>
          ))}
        </select>
        {selectedPrice && (
          <p className="font-semibold text-cream mt-2">
            Price: ${selectedPrice.price}
          </p>
        )}
      </div>
    </div>
  );
}
