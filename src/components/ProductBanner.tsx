"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

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
        {["banner1.jpg", "banner2.jpg", "banner3.jpg"].map((img, index) => (
          <SwiperSlide key={index}>
            <img
              src={`/images/${img}`}
              alt={`Banner ${index + 1}`}
              className="w-full h-36 md:h-44 lg:h-48 rounded-lg shadow-md object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
