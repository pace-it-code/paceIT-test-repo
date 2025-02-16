"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import api from "../../utils/api";

interface Product {
  id: string;
  name: string;
  price: number | string;
  images?: string[];
  stock: number;
  description: string;
}

export default function ProductDetail() {
  const params = useParams();
  const productId = params?.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [adding, setAdding] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);

  const router = useRouter();
  const placeholderImage = "/images/default.jpg"; // Fallback image
  const baseURL = "/images/"; // Base path for dummy images

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const res = await api.get(`/product/${productId}`);
        setProduct(res.data.data);
        fetchSuggestions();
      } catch (err) {
        console.error("❌ Error fetching product:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Fetch suggested products
  const fetchSuggestions = async () => {
    try {
      const res = await api.get(`/product`);
      const filteredProducts = res.data.data.filter((p: Product) => p.id !== productId);
      setSuggestedProducts(filteredProducts.slice(0, 4)); // Show only 4
    } catch (err) {
      console.error("❌ Error fetching suggestions:", err);
    }
  };

  const validateImageUrl = (url?: string) => {
    if (!url) return placeholderImage;
    return url.startsWith("/") || url.startsWith("http") ? url : `${baseURL}${url}`;
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const addToCart = async () => {
    if (!product || quantity < 1) return;
    setAdding(true);

    try {
      await api.put("/cart", {
        userId: "8KKj9YgkkVZ66UOx00u1dT7Xk4F2",
        productId: product.id,
        quantity,
      });
      alert(`✅ ${quantity} item(s) added to cart!`);
    } catch (err) {
      console.error("❌ Error adding to cart:", err);
      alert("⚠️ Failed to add product to cart.");
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <p className="text-center text-lg">⏳ Loading product...</p>;
  if (error) return <p className="text-center text-red-500">❌ {error}</p>;
  if (!product) return <p className="text-center text-gray-500">⚠️ Product not found.</p>;

  return (
    <div className="container mx-auto px-6 py-20">
      {/* Back Button */}
      <button onClick={() => router.back()} className="bg-gray-200 px-4 py-2 rounded mb-6">
        ⬅ Back
      </button>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Left Side - Image Slider */}
        <div className="w-full md:w-1/2 flex gap-4 relative">
          {/* Thumbnails on the Left */}
          <div className="h-auto flex flex-col gap-3 w-20">
            {product.images?.length ? (
              product.images.map((img, index) => (
                <div key={index} className="w-20 h-20 border rounded-lg overflow-hidden">
                  <img
                    src={validateImageUrl(img)}
                    alt={`Thumbnail ${index + 1}`}
                    className="object-cover w-full h-full cursor-pointer hover:border-blue-500"
                  />
                </div>
              ))
            ) : (
              <div className="w-20 h-20 border rounded-lg overflow-hidden">
                <img src={placeholderImage} alt="No Image Available" className="object-cover w-full h-full" />
              </div>
            )}
          </div>

          {/* Main Image with Swiper */}
          <div className="w-full border rounded-lg shadow-md overflow-hidden relative">
            <Swiper navigation className="w-full">
              {product.images?.length ? (
                product.images.map((img, index) => (
                  <SwiperSlide key={index}>
                    <img src={validateImageUrl(img)} alt="Main Product Image" className="w-full object-cover" />
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide>
                  <img src={placeholderImage} alt="No Image Available" className="w-full object-cover" />
                </SwiperSlide>
              )}
            </Swiper>
          </div>
        </div>

        {/* Right Side - Product Details */}
        <div className="w-full md:w-1/2 flex flex-col">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-lg text-gray-700 mt-2">{product.description}</p>
          <p className="text-xl font-semibold mt-4">Price: ₹{product.price}</p>
          <p className="text-md text-gray-600">Stock: {product.stock}</p>

          {/* Quantity Selection */}
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={decreaseQuantity}
              className="px-4 py-2 bg-gray-300 rounded-md"
              disabled={quantity === 1}
            >
              ➖
            </button>
            <p className="text-lg font-bold">{quantity}</p>
            <button onClick={increaseQuantity} className="px-4 py-2 bg-gray-300 rounded-md">
              ➕
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Products Section */}
      {suggestedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-4">🔥 Suggested Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {suggestedProducts.map((item) => (
              <div key={item.id} onClick={() => router.push(`/product/${item.id}`)} className="cursor-pointer border p-4 rounded-lg shadow hover:shadow-lg transition-all">
                <img
                  src={validateImageUrl(item.images?.[0])}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded-lg mb-2"
                />
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-md font-semibold mt-2">💰 ₹{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
