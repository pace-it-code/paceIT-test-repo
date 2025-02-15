import Link from "next/link";

export default function ProductCard({ product }: { product: any }) {
  return (
    <Link href={`/product/${product.id}`} className="p-4 border rounded shadow hover:shadow-md">
      <h2 className="text-lg font-semibold">{product.name}</h2>
      <p>Price: ${product.price}</p>
    </Link>
  );
}
