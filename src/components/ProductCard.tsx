import Link from "next/link";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  
  price: number;
  images?: string[]; // ✅ Optional image array
}

export default function ProductCard({ product }: { product: Product }) {
  // ✅ Ensure at least one image exists, otherwise use a plavceholder
  const productImage = product.images?.[0]
  ? product.images[0].replace('/upload/', '/upload/f_auto,q_auto/')
  : "/images.png";

  return (
    <Link href={`/product/${product.id}`} className="p-4 border rounded shadow hover:shadow-md block bg-white">
      {/* ✅ Image Container */}
      <div className="w-full h-36 md:h-48 relative rounded-md mb-2 overflow-hidden">
        <Image
          src={productImage}
          alt={product.name}
          fill
          className="rounded-md"
          priority // ✅ Preload for faster loading
        />
      </div>

      {/* ✅ Product Details */}
      <h2 className="text-lg font-light text-greens text-center">{product.name}</h2>
      <p className="text-darkgray line-clamp-2">{product.description}</p>
      <p className="text-warmbrown">Category: {product.category}</p>
     
      <p className="font-semibold text-cream">Price: ${product.price}</p>
    </Link>
  );
}
