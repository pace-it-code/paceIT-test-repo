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
        <p>Stock: {product.stock}</p>
        <p>Category: {product.category}</p>

        {/* Display product images */}
        {product.images && product.images.length > 0 && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold">Images:</h2>
            <div className="grid grid-cols-3 gap-2">
              {product.images.map((image: string, index: number) => (
                <img key={index} src={image} alt={`Product Image ${index + 1}`} className="w-full h-auto rounded-lg shadow" />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    return <p className="text-red-500">❌ Failed to load product</p>;
  }
}
