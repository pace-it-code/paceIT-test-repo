import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { Product } from "../../types/types";

export interface PricingOption {
  packageSize: string;
  price: number;
  discount?: number;
}

interface ExamProduct extends Product {
  discount?: number;
}

export default function ProductCard({ product }: { product: ExamProduct }) {
  const [selectedPrice, setSelectedPrice] = useState<PricingOption | null>(null);
  const [coupon, setCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const productImage = product.images?.[0]
    ? product.images[0].replace('/upload/', '/upload/f_auto,q_auto/')
    : "/images.png";

  useEffect(() => {
    if (product?.pricing && product.pricing.length > 0) {
      setSelectedPrice(product.pricing[0]);
    }
  }, [product]);

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

  const { originalPrice, discountedPrice, appliedDiscount } = useMemo(() => {
    if (!selectedPrice) return { originalPrice: "N/A", discountedPrice: "N/A", appliedDiscount: 0 };

    const discountedPrice = Number(selectedPrice.price);
    if (isNaN(discountedPrice)) {
      console.error("Invalid price value:", selectedPrice.price);
      return { originalPrice: "N/A", discountedPrice: "N/A", appliedDiscount: 0 };
    }

    const discountFromCoupon = coupon?.discount ?? 0;
    const discountFromProduct = product.discount ?? 0;
    const appliedDiscount = Math.max(discountFromCoupon, discountFromProduct);
    const originalPrice = (discountedPrice + (discountedPrice * appliedDiscount / 100)).toFixed(2);

    return { originalPrice, discountedPrice: discountedPrice.toFixed(2), appliedDiscount };
  }, [selectedPrice, coupon, product.discount]);

  return (
    <div 
      className="overflow-hidden bg-white border border-gray-100 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative">
          {appliedDiscount > 0 && (
            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10">
              {appliedDiscount}% OFF
            </div>
          )}
          <div className="mt-7 w-full h-52 relative overflow-hidden">
            <Image
              src={productImage}
              alt={product.name}
              fill
              className={`object-contain transition-transform duration-700 ${isHovered ? 'scale-105' : 'scale-100'}`}
              priority
            />
          </div>
        </div>
        
        <div className="p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{product.category}</p>
          <h2 className="text-lg font-medium text-gray-800 mb-3">{product.name}</h2>
          
          <select
            id="pricing"
            name="pricing"
            className="w-full py-2 px-3 border border-gray-200 rounded text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-400 transition-colors"
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
            <div className="mt-3 flex items-end justify-between">
              <div>
                {appliedDiscount > 0 && (
                  <span className="block text-gray-500 line-through text-xs">₹{originalPrice}</span>
                )}
                <span className="text-lg font-semibold text-gray-900">₹{discountedPrice}</span>
              </div>
              
              <button className={`text-white text-sm px-4 py-2 rounded-md transition-all duration-300 ${
                isHovered ? 'bg-emerald-600' : 'bg-emerald-500'
              }`}>
                Add to cart
              </button>
            </div>
          )}
          
          
        </div>
      </Link>
    </div>
  );
}