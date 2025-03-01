import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { Product } from "../../types/types";

interface PricingOption {
  packageSize: string;
  price: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const [selectedPrice, setSelectedPrice] = useState<PricingOption | null>(null);
  const [coupon, setCoupon] = useState<{ code: string; discount: number } | null>(null);

  // Ensure at least one image exists, otherwise use a placeholder
  const productImage = product.images?.[0]
    ? product.images[0].replace('/upload/', '/upload/f_auto,q_auto/')
    : "/images.png";

  // Set the first package as default
  useEffect(() => {
    if (product.pricing && product.pricing.length > 0) {
      setSelectedPrice(product.pricing[0]);
    }
  }, [product.pricing]);

  // Fetch active coupon from the API
  useEffect(() => {
    async function fetchCoupon() {
      try {
        const res = await fetch(`/api/coupon`);
        const data = await res.json();

        if (data.discount > 0) {
          setCoupon({ code: data.code, discount: data.discount });
        } else {
          setCoupon(null);
        }
      } catch (error) {
        console.error("Error fetching coupon:", error);
      }
    }

    fetchCoupon();
  }, []);

  // Compute original price before discount so that the discounted price is equal to the selected price
  const originalPrice = useMemo(() => {
    if (!selectedPrice || !coupon) return selectedPrice?.price || 0;

    const discountFactor = 1 - (coupon.discount / 100);
    return (selectedPrice.price / discountFactor).toFixed(2);
  }, [selectedPrice, coupon]);

  return (
    <div className="p-4 border rounded shadow hover:shadow-md block bg-white">
      <Link href={`/product/${product.id}`} className="block">
        <div className="w-full h-36 md:h-48 relative rounded-md mb-2 overflow-hidden">
          <Image
            src={productImage}
            alt={product.name}
            fill
            className="rounded-md object-contain"
            priority
          />
        </div>

        <h2 className="text-lg font-light text-greens text-center">{product.name}</h2>
        <p className="text-warmbrown">{product.category}</p>
      </Link>

      {/* Pricing Options */}
      <div className="mt-2">
        <select
          id="pricing"
          name="pricing"
          className="border p-2 w-full rounded-md"
          value={selectedPrice?.packageSize || ""}
          onChange={(e) => {
            const selected = product.pricing?.find(
              (p) => p.packageSize === e.target.value
            );
            setSelectedPrice(selected || null);
          }}
        >
          {(product.pricing ?? []).map((option, index) => (
            <option key={index} value={option.packageSize}>
              {option.packageSize}
            </option>
          ))}
        </select>

        {selectedPrice && (
          <div className="mt-2">
            <p className="text-gray-500 line-through">
              Before Discount: ₹{originalPrice}
            </p>
            <p className="font-semibold text-red-600">
              Discounted Price: ₹{selectedPrice.price}
            </p>
            {coupon && (
              <p className="text-blue-500">
                Coupon Applied: {coupon.code} ({coupon.discount}% Off)
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
