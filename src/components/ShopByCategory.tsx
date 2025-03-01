"use client";

import React from "react";
import Image from "next/image";

/**
 * This component can safely use onClick handlers
 * because it is a Client Component (thanks to "use client").
 */
export default function ShopByCategory() {
  return (
    <section className="py-10 bg-[#f9f9f9]">
      <div className="container mx-auto text-center">
        <h2 className="mb-8 text-2xl font-semibold">Shop By Category</h2>
        <div className="flex flex-wrap justify-center gap-5">
          {/* Category 1 */}
          <div className="w-[150px] text-center">
            <button
              className="rounded-full w-24 h-24 mx-auto mb-2.5 object-cover"
              onClick={() => alert("Category 1 clicked")}
            >
              <Image src="/cat.png" alt="Category 1" width={96} height={96} className="rounded-full object-cover" />
            </button>
            <p className="font-medium">Agriculture</p>
          </div>

          {/* Category 2 */}
          <div className="w-[150px] text-center">
            <button
              className="rounded-full w-24 h-24 mx-auto mb-2.5 object-cover"
              onClick={() => alert("Category 2 clicked")}
            >
              <Image src="/cat.png" alt="Category 2" width={96} height={96} className="rounded-full object-cover" />
            </button>
            <p className="font-medium">Organic</p>
          </div>

          {/* Category 3 */}
          <div className="w-[150px] text-center">
            <button
              className="rounded-full w-24 h-24 mx-auto mb-2.5 object-cover"
              onClick={() => alert("Category 3 clicked")}
            >
              <Image src="/cat.png" alt="Category 3" width={96} height={96} className="rounded-full object-cover" />
            </button>
            <p className="font-medium">Vegetables</p>
          </div>

          {/* Category 4 */}
          <div className="w-[150px] text-center">
            <button
              className="rounded-full w-24 h-24 mx-auto mb-2.5 object-cover"
              onClick={() => alert("Category 4 clicked")}
            >
              <Image src="/cat.png" alt="Category 4" width={96} height={96} className="rounded-full object-cover" />
            </button>
            <p className="font-medium">Fruits</p>
          </div>
        </div>
      </div>
    </section>
  );
}
