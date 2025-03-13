"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  bgColor: string;
}

export default function HeroSlider() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch slides from Next.js API
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await axios.get("/api/sliders");
        setSlides(response.data);
      } catch (error) {
        console.error("Error fetching slides:", error);
      }
    };
    fetchSlides();
  }, []);

  // Start autoplay
  const startAutoPlay = useCallback(() => {
    stopAutoPlay();
    autoplayRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 6000);
  }, [slides]);

  // Stop autoplay
  const stopAutoPlay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  };

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [startAutoPlay]);

  // Navigation functions
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    startAutoPlay();
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    startAutoPlay();
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    startAutoPlay();
  };

  return (
    <div className="mt-[40px] mb-12 mx-12">
      {slides.length > 0 && (
        <section className="relative w-full h-[80vh] overflow-hidden rounded-2xl shadow-2xl">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
                currentIndex === index ? "opacity-100 z-10" : "opacity-0 z-0"
              } ${slide.bgColor}`}
            >
              <Link href={slide.link} className="absolute inset-0 w-full h-full">
                <div className="relative w-full h-full">
                  {/* ✅ Using next/image for better optimization */}
                  <Image
                    src={slide.imageUrl}
                    alt={slide.title}
                    layout="fill"
                    objectFit="cover"
                    priority
                    className="absolute inset-0"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="text-white text-center space-y-6 px-6">
                      <h2 className="text-4xl md:text-6xl font-bold tracking-tight">{slide.title}</h2>
                      <p className="text-lg md:text-xl text-gray-100 max-w-md leading-relaxed">{slide.description}</p>
                      {/* ✅ Removed the extra <a> tag to prevent hydration error */}
                      <button className="mt-4 px-8 py-3 bg-white text-gray-900 font-medium rounded-full hover:bg-opacity-90 transition-all inline-flex items-center gap-2 hover:shadow-lg transform hover:-translate-y-1">
                        Explore More
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 text-white p-3 rounded-full shadow-lg transform transition-transform hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 text-white p-3 rounded-full shadow-lg transform transition-transform hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Navigation */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentIndex === index ? "bg-white w-8" : "bg-white bg-opacity-50 hover:bg-opacity-75"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
