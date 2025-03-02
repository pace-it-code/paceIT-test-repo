"use client";

import Lottie from "lottie-react";
import animationData from "../../public/loading.json" // Import the .lottie file

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <Lottie animationData={animationData} loop={true} className="w-48 h-48" />
    </div>
  );
}
