"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Leaf, Droplet, Shield, Sprout } from "lucide-react";

const slides = [
  {
    title: "Organic Plant Nutrition",
    description: "Enhance your garden with our eco-friendly nutrient-rich fertilizers",
    icon: <Leaf className="w-16 h-16 text-lime-400" />,
    bgColor: "bg-gradient-to-b from-green-700 to-teal-400 "
  },
  {
    title: "Soil Revitalization",
    description: "Restore depleted soil with our balanced mineral formulations",
    icon: <Droplet className="w-16 h-16 text-teal-300" />,
    bgColor: "bg-gradient-to-b from-teal-400 to-green-700"
  },
  {
    title: "Pest Protection",
    description: "Strengthen your plants' natural defenses against harmful pests",
    icon: <Shield className="w-16 h-16 text-amber-300" />,
    bgColor: "bg-gradient-to-b from-green-700 to-teal-400"
  },
  {
    title: "Growth Accelerator",
    description: "See faster, healthier growth with our specialized formulas",
    icon: <Sprout className="w-16 h-16 text-emerald-300" />,
    bgColor: "bg-gradient-to-b from-teal-400 to-green-700"
  }
];

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoPlay = useCallback(() => {
    stopAutoPlay();
    autoplayRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 6000);
  }, []);

  const stopAutoPlay = () => {
    if (autoplayRef.current !== null) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  };

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [startAutoPlay]);

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
      <section ref={sliderRef} className="relative w-full h-[80vh] overflow-hidden rounded-2xl shadow-2xl">
        <div className="absolute inset-0 w-full h-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
                currentIndex === index ? "opacity-100 z-10" : "opacity-0 z-0"
              } ${slide.bgColor}`}
            >
              <div className="relative z-10 h-full w-full flex items-center justify-center">
                <div className="w-full max-w-6xl mx-auto px-8 grid md:grid-cols-2 gap-12 items-center">
                  <div className="text-white space-y-6">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight">{slide.title}</h2>
                    <p className="text-lg md:text-xl text-gray-100 max-w-md leading-relaxed">{slide.description}</p>
                    <a 
                      href="#products" 
                      className="mt-4 px-8 py-3 bg-white text-gray-900 font-medium rounded-full hover:bg-opacity-90 transition-all inline-flex items-center gap-2 hover:shadow-lg transform hover:-translate-y-1"
                    >
                      Explore Products
                    </a>
                  </div>
                  <div className="hidden md:flex justify-center items-center">
                    <div className="relative">
                      <div className="absolute -inset-16 bg-white rounded-full opacity-10 animate-pulse"></div>
                      <div className="relative bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-12 shadow-inner">
                        {slide.icon}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
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
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentIndex === index 
                  ? "bg-white w-8" 
                  : "bg-white bg-opacity-50 hover:bg-opacity-75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
