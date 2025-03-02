"use client";

import React, { useEffect, useState, useRef ,useCallback} from "react";
import { ChevronLeft, ChevronRight, Leaf, Droplet, Shield, Sprout } from "lucide-react";

const slides = [
  {
    title: "Organic Plant Nutrition",
    description: "Enhance your garden with our eco-friendly nutrient-rich fertilizers",
    icon: <Leaf className="w-16 h-16 text-green-400" />,
    bgColor: "bg-gradient-to-r from-green-800 to-green-600"
  },
  {
    title: "Soil Revitalization",
    description: "Restore depleted soil with our balanced mineral formulations",
    icon: <Droplet className="w-16 h-16 text-blue-400" />,
    bgColor: "bg-gradient-to-r from-blue-800 to-blue-600"
  },
  {
    title: "Pest Protection",
    description: "Strengthen your plants' natural defenses against harmful pests",
    icon: <Shield className="w-16 h-16 text-amber-400" />,
    bgColor: "bg-gradient-to-r from-amber-800 to-amber-600"
  },
  {
    title: "Growth Accelerator",
    description: "See faster, healthier growth with our specialized formulas",
    icon: <Sprout className="w-16 h-16 text-emerald-400" />,
    bgColor: "bg-gradient-to-r from-emerald-800 to-emerald-600"
  }
];

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  
  
  const stopAutoPlay = useCallback(() => {
    if (autoplayRef.current !== null) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  const startAutoPlay = useCallback(() => {
    stopAutoPlay();
    autoplayRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 6000);
  }, [stopAutoPlay]);

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [startAutoPlay, stopAutoPlay]);
  
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
    <section ref={sliderRef} className="relative w-full h-[60vh] overflow-hidden bg-gray-900">
      <div className="absolute inset-0 w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out flex items-center justify-center ${
              currentIndex === index ? "opacity-100 z-10" : "opacity-0 z-0"
            } ${slide.bgColor}`}
          >
            <div className="relative z-10 max-w-6xl mx-auto px-8 grid md:grid-cols-2 gap-8 items-center">
              <div className="text-white space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold">{slide.title}</h2>
                <p className="text-base md:text-lg text-gray-100 max-w-md">{slide.description}</p>
                <a href="#products" className="mt-2 px-5 py-2 bg-white text-gray-900 font-medium rounded-full hover:bg-opacity-90 transition-all inline-block">
                  Explore Products
                </a>
              </div>
              <div className="hidden md:flex justify-center items-center">
                <div className="relative">
                  <div className="absolute -inset-12 bg-white rounded-full opacity-10 animate-pulse"></div>
                  <div className="relative bg-white bg-opacity-20 rounded-full p-8">
                    {slide.icon}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={prevSlide} className="hidden md:block absolute top-1/2 left-6 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full text-white">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button onClick={nextSlide} className="hidden md:block absolute top-1/2 right-6 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full text-white">
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
              currentIndex === index ? "bg-white w-6 md:w-8" : "bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
