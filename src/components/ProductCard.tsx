import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { Product } from "../../types/types";

export interface PricingOption {
  packageSize: string;
  price: number;
  discount?: number; // Optional discount field
}

// Extend Product to include discount field
interface ExamProduct extends Product {
  discount?: number; // Make discount optional
}

export default function ProductCard({ product }: { product: ExamProduct }) {
  const [selectedPrice, setSelectedPrice] = useState<PricingOption | null>(null);
  const [coupon, setCoupon] = useState<{ code: string; discount: number } | null>(null);

  // Ensure at least one image exists, otherwise use a placeholder
  const productImage = product.images?.[0]
    ? product.images[0].replace('/upload/', '/upload/f_auto,q_auto/')
    : "/images.png";

  // ✅ Set first package as default
  useEffect(() => {
    if (product?.pricing && product.pricing.length > 0) {
      setSelectedPrice(product.pricing[0]);
    }
  }, [product]);

  // ✅ Fetch active coupon from Firebase API
  useEffect(() => {
    async function fetchCoupon() {
      try {
        const res = await fetch(`/api/coupon`);
        if (!res.ok) throw new Error(`API responded with status: ${res.status}`);

        const data = await res.json();
        if (data && typeof data.discount === "number" && data.discount > 0) {
          setCoupon({ code: data.code, discount: data.discount });
        } else {
          setCoupon(null);
        }
      } catch (error) {
        console.error("Error fetching coupon:", error);
        setCoupon(null);
      }
    }

    fetchCoupon();
  }, []);

  // ✅ Compute original price & discounted price
  const { originalPrice, discountedPrice, appliedDiscount } = useMemo(() => {
    if (!selectedPrice) return { originalPrice: "N/A", discountedPrice: "N/A", appliedDiscount: 0 };

    const discountedPrice = Number(selectedPrice.price); // Price stored in Firestore
    if (isNaN(discountedPrice)) {
      console.error("Invalid price value:", selectedPrice.price);
      return { originalPrice: "N/A", discountedPrice: "N/A", appliedDiscount: 0 };
    }

    const discountFromCoupon = coupon?.discount ?? 0;
    const discountFromProduct = product.discount ?? 0;

    // Use the highest discount (Coupon OR Product discount)
    const appliedDiscount = Math.max(discountFromCoupon, discountFromProduct);

    // ✅ Calculate Original Price (discounted price + discount amount)
    const originalPrice = (discountedPrice + (discountedPrice * appliedDiscount / 100)).toFixed(2);

    return { originalPrice, discountedPrice: discountedPrice.toFixed(2), appliedDiscount };
  }, [selectedPrice, coupon, product.discount]);

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
            if (selected) {
              setSelectedPrice(selected);
            }
          }}
        >
          {product.pricing?.map((option, index) => (
            <option key={index} value={option.packageSize}>
              {option.packageSize}
            </option>
          ))}
        </select>

        {selectedPrice && (
          <div className="mt-2">
            <p className="text-gray-500 line-through">Original Price: ₹{originalPrice}</p>
            <p className="font-semibold text-red-600">Discounted Price: ₹{discountedPrice}</p>
            {appliedDiscount > 0 ? (
              <p className="text-blue-500">
                Discount Applied: {appliedDiscount}% Off ({coupon?.code ? `Coupon: ${coupon.code}` : "Product Discount"})
              </p>
            ) : (
              <p className="text-gray-400">No discounts available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
