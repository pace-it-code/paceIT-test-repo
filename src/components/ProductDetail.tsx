import api from ".././app/utils/api";

export default async function ProductDetail({ id }: { id: string }) {
  try {
    const res = await api.get(`/${id}`);
    const product = res.data.product;

    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p>Price: ${product.price}</p>
        <p>{product.description}</p>
      </div>
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    return <p className="text-red-500">❌ Failed to load product</p>;
  }
}
