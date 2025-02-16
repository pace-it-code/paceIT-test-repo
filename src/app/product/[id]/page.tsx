"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { Navigation, Thumbs } from "swiper/modules";

// Dummy Product Data
const dummyProduct = {
  id: "1",
  name: "Luxury Milk Chocolate Bar",
  price: 499,
  images: [
    "/images/product1.jpg",
    "/images/product2.jpg",
    "/images/product3.jpg",
    "/images/product4.jpg",
  ],
  category: "Chocolates & Sweets",
  stock: 12,
  description:
    "Indulge in the richness of our handcrafted luxury milk chocolate bar. Made with the finest cocoa and natural ingredients, it’s a perfect treat for chocolate lovers.",
  weightOptions: ["100g", "250g", "500g"],
};

const suggestedProducts = [
  { id: 2, name: "Hazelnut Choco Delight", price: 350, image: "/images/product2.jpg" },
  { id: 3, name: "Dark Chocolate Almond", price: 420, image: "/images/product3.jpg" },
  { id: 4, name: "White Chocolate Strawberry", price: 399, image: "/images/product4.jpg" },
  { id: 5, name: "Classic Cocoa Bar", price: 289, image: "/images/product1.jpg" },
];

export default function ProductDetail() {
  const [selectedProduct] = useState(dummyProduct);
  const [selectedWeight, setSelectedWeight] = useState<string>(dummyProduct.weightOptions[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const router = useRouter();

  return (
    <div className="container mx-auto px-6 py-20">
      {/* Back Button */}
      <button onClick={() => router.back()} className="bg-gray-200 px-4 py-2 rounded mb-6">⬅ Back</button>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Left Side - Thumbnails & Main Image */}
        <div className="w-full md:w-1/2 flex gap-4 relative">
          {/* Thumbnails on the Left (Fixed & Properly Aligned) */}
          <div className="h-auto flex flex-col gap-3 w-20">
            {selectedProduct.images.map((img, index) => (
              <div key={index} className="w-20 h-20 border rounded-lg overflow-hidden">
                <Image
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full cursor-pointer hover:border-blue-500"
                />
              </div>
            ))}
          </div>

          {/* Main Image with Swiper */}
          <div className="w-full border rounded-lg shadow-md overflow-hidden relative">
            <Swiper
              modules={[Navigation]}
              navigation
              className="w-full"
            >
              {selectedProduct.images.map((img, index) => (
                <SwiperSlide key={index}>
                  <Image
                    src={img}
                    alt="Main Product Image"
                    width={500}
                    height={500}
                    className="w-full object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* Right Side - Product Details */}
        <div className="w-full md:w-1/2 flex flex-col">
          <h1 className="text-3xl font-bold">{selectedProduct.name}</h1>
          <p className="text-lg text-gray-700 mt-2">{selectedProduct.description}</p>

          {/* Weight Selection */}
          <div className="mt-4">
            <p className="font-semibold">Select Weight:</p>
            <div className="flex gap-3 mt-2">
              {selectedProduct.weightOptions.map((weight) => (
                <button
                  key={weight}
                  className={`px-4 py-2 border rounded-md ${
                    selectedWeight === weight ? "bg-blue-500 text-white" : "bg-gray-100"
                  }`}
                  onClick={() => setSelectedWeight(weight)}
                >
                  {weight}
                </button>
              ))}
            </div>
          </div>

          {/* Floating Purchase Box */}
          <div className="bg-white shadow-lg border p-6 rounded-lg mt-6 w-full md:w-3/4">
            <p className="text-2xl font-bold">₹{selectedProduct.price}</p>
            <p className="text-gray-600">Inclusive of all taxes</p>

            {/* Quantity Selection */}
            <div className="mt-4">
              <p className="font-semibold">Quantity:</p>
              <div className="flex gap-3 mt-2">
                <button onClick={() => setQuantity((q) => Math.max(q - 1, 1))} className="px-4 py-2 bg-gray-200 rounded-md">-</button>
                <p className="text-lg font-bold">{quantity}</p>
                <button onClick={() => setQuantity((q) => q + 1)} className="px-4 py-2 bg-gray-200 rounded-md">+</button>
              </div>
            </div>

            {/* Add to Cart & Buy Now */}
            <div className="mt-4 flex flex-col gap-3">
              <button className="w-full bg-yellow-500 text-white py-2 rounded-md font-semibold">🛒 Add to Cart</button>
              <button className="w-full bg-orange-500 text-white py-2 rounded-md font-semibold">⚡ Buy Now</button>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-4">Products Related to This Item</h2>
        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          navigation
          className="w-full"
        >
          {suggestedProducts.map((product) => (
            <SwiperSlide key={product.id} className="border rounded-lg shadow-md p-4">
              <Image
                src={product.image}
                alt={product.name}
                width={200}
                height={200}
                className="w-full object-cover"
              />
              <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
              <p className="text-gray-600">₹{product.price}</p>
              <button className="w-full bg-blue-500 text-white py-2 rounded-md font-semibold mt-2">View</button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
