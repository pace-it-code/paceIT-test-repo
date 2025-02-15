"use client";
import { useState, useEffect } from "react";
import api from "./utils/api"; // Axios instance
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react"; 
import "swiper/css"; 
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules"; 
import { RefreshCw, RotateCcw, Headphones, ArrowLeft, ArrowRight } from "lucide-react"; // Import icons
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// Define Product Interface
interface Product {
  id: number;
  name: string;
  price: number | string | null; 
  image?: string;
}

// Define Testimonial Interface
type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
};

// Testimonials Component
const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index: number) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Testimonial Image */}
        <div className="relative h-72 w-full">
          <AnimatePresence>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.src}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: isActive(index) ? 1 : 0.7, scale: isActive(index) ? 1 : 0.95 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={testimonial.src}
                  alt={testimonial.name}
                  width={500}
                  height={500}
                  draggable={false}
                  className="h-full w-full rounded-2xl object-cover"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Testimonial Text */}
        <div className="flex flex-col justify-between">
          <motion.div key={active} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.2 }}>
            <h3 className="text-2xl font-bold text-gray-900">{testimonials[active].name}</h3>
            <p className="text-sm text-gray-500">{testimonials[active].designation}</p>
            <motion.p className="text-lg text-gray-500 mt-6">
              {testimonials[active].quote.split(" ").map((word, index) => (
                <motion.span key={index} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.02 * index }} className="inline-block">
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.p>
          </motion.div>
          
          {/* Navigation Buttons */}
          <div className="flex gap-4 pt-6">
            <button onClick={handlePrev} className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button onClick={handleNext} className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
              <ArrowRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

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
      
      {/* ✅ Swiper Image Banner */}
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
            <img src="/images/banner1.jpg" alt="Banner 1" className="w-full h-36 md:h-44 lg:h-48 rounded-lg object-cover" />
          </SwiperSlide>
          <SwiperSlide>
            <img src="/images/banner2.jpg" alt="Banner 2" className="w-full h-36 md:h-44 lg:h-48 rounded-lg object-cover" />
          </SwiperSlide>
        </Swiper>
      </div>

      {/* ✅ Product List */}
      <h1 className="text-2xl font-bold text-center mb-3">Product List</h1>
      <div className="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <a key={product.id} href={`/product/${product.id}`} target="_blank" className="p-4 border rounded-lg shadow-md hover:shadow-lg transition bg-white block">
            <img src={product.image} alt={product.name} className="w-full h-36 object-cover rounded-md mb-2" />
            <h2 className="text-lg font-semibold text-gray-900">{product.name}</h2>
            <p className="text-gray-700 font-medium mt-1">Price: ${product.price.toFixed(2)}</p>
          </a>
        ))}
      </div>

      {/* ✅ Feature Section */}
      <div className="w-full bg-gray-100 py-8 mt-10">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center text-center gap-6 px-4">
          <div className="flex flex-col items-center w-1/3 min-w-[150px]"><RefreshCw className="h-14 w-14 text-gray-700" /><h2 className="text-lg font-semibold mt-3">Easy Exchange</h2></div>
          <div className="flex flex-col items-center w-1/3 min-w-[150px]"><RotateCcw className="h-14 w-14 text-gray-700" /><h2 className="text-lg font-semibold mt-3">7 Days Return</h2></div>
          <div className="flex flex-col items-center w-1/3 min-w-[150px]"><Headphones className="h-14 w-14 text-gray-700" /><h2 className="text-lg font-semibold mt-3">24/7 Support</h2></div>
        </div>
      </div>

      {/* ✅ Testimonials Section */}
      <AnimatedTestimonials testimonials={[
        { quote: "Best service ever!", name: "John Doe", designation: "Customer", src: "/images/testimonial1.jpg" },
        { quote: "Amazing experience!", name: "Jane Smith", designation: "Shopper", src: "/images/testimonial2.jpg" },
      ]} autoplay={true} />
    </div>
  );
}
