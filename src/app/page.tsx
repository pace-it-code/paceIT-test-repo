"use client";
import { useState, useEffect } from "react";
import api from "./utils/api"; // Axios instance
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react"; 
import "swiper/css"; 
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules"; 

// Define Product Interface
interface Product {
  id: number;
  name: string;
  price: number | string | null; 
  image?: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/");
        setProducts(
          res.data.data.map((product: any) => ({
            id: product.id,
            name: product.name,
            price: parseFloat(product.price) || 0, 
            image: product.image || "/images/sample-product.jpg",
          }))
        );
      } catch (err) {
        console.error("Error fetching products:", (err as Error).message);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-2 flex flex-col items-center">
      
      {/* ✅ Swiper Image Banner (Smaller & Positioned Below Navbar) */}
      <div className="w-full max-w-4xl mt-4 mb-4"> 
        <Swiper
          modules={[Pagination, Autoplay]}
          slidesPerView={1}
          autoplay={{ delay: 3000 }}
          loop={true}
          pagination={{ clickable: true }}
          className="w-full"
        >
          <SwiperSlide>
            <img 
              src="/images/banner1.jpg" 
              alt="Banner 1" 
              className="w-full h-36 md:h-44 lg:h-48 rounded-lg shadow-md object-cover"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img 
              src="/images/banner2.jpg" 
              alt="Banner 2" 
              className="w-full h-36 md:h-44 lg:h-48 rounded-lg shadow-md object-cover"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img 
              src="/images/banner3.jpg" 
              alt="Banner 3" 
              className="w-full h-36 md:h-44 lg:h-48 rounded-lg shadow-md object-cover"
            />
          </SwiperSlide>
        </Swiper>
      </div>

      {/* ✅ Product List Heading */}
      <h1 className="text-2xl font-bold text-center mb-3">Product List</h1>

      {/* ✅ Product Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
        {loading ? (
          <p className="text-center text-lg mt-4">⏳ Loading products...</p>
        ) : error ? (
          <p className="text-center text-red-500 text-lg mt-4">❌ {error}</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">No products found.</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="p-4 border rounded-lg shadow-md hover:shadow-lg transition bg-white">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-36 object-cover rounded-md mb-2"
              />
              <h2 className="text-lg font-semibold text-gray-900">{product.name}</h2>
              <p className="text-gray-700 font-medium mt-1">
                Price: ${typeof product.price === "number" ? product.price.toFixed(2) : "N/A"}
              </p>
            </div>
          ))
        )}
      </div>

      {/* ✅ Add Product Button */}
      <div className="mt-4">
        <Link href="/add" className="bg-blue-500 text-white px-5 py-2 rounded-md shadow hover:bg-blue-600 transition">
          ➕ Add Product
        </Link>
      </div>
    </div>
  );
}