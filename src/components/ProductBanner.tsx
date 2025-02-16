"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";

export default function ProductBanner() {
  return (
    <div className="w-full max-w-4xl mt-4 mb-4">
      <Swiper
        modules={[Pagination, Autoplay]}
        slidesPerView={1}
        autoplay={{ delay: 3000 }}
        loop={true}
        pagination={{ clickable: true }}
        className="w-full"
      >
        {["/banner1.png", "/banner2.png", "/banner3.png"].map((img, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-36 md:h-44 lg:h-48">
              <Image 
                src={img} 
                fill 
                className="object-cover rounded-lg shadow-md" 
                alt={`Banner ${index + 1}`} 
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
