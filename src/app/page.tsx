import ProductGrid from "../components/ProductGrid";
//import ProductBanner from "../components/ProductBanner";
import FeaturesSection from "../components/FeatureSection";
import Testimonials from "../components/Testimonials";
import { Product } from "../../types/types";
// import Categories from "@/components/Categories"; // ❌ Removed since we don't need the second navbar


import ShopByCategory from "../components/ShopByCategory"; // <-- Import your new Client Component

export const dynamic = "force-dynamic"; // Forces server-side rendering

export default async function ProductList() {
  let products: Product[] = [];
  let error: string | null = null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/product`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Failed to fetch products");
    const data = await res.json();

    products = data.data.map((product: Product) => ({
      id: product.id,
      name: product.name,
      description: product.description || "No description available",
      category: product.category || "Uncategorized",
      pricing: Array.isArray(product.pricing)
        ? product.pricing.map((p) => ({
            packageSize: p.packageSize || "Default",
            price: typeof p.price === "string" ? p.price : 0,
          }))
        : [],
      images: product.images?.length
        ? product.images
        : ["/images/sample-product.jpg"],
    }));
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    error = "Failed to load products";
  }

  return (
    <>
      {/* HERO / SLIDER */}
      <section className="relative overflow-hidden w-full">
        <div
          id="sliderWrapper"
          className="flex transition-transform duration-500 ease-in-out"
        >
          {/* Slide 1 */}
          <div
            className="min-w-full h-[400px] relative flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: "url('placeholder1.jpg')" }}
          >
            <div className="text-center">
              <h2 className="text-[40px] text-white mb-2.5 drop-shadow-lg">
                Fresh &amp; Organic
              </h2>
              <p className="text-lg text-white drop-shadow-lg">
                Experience the best quality produce from local farms.
              </p>
            </div>
          </div>
          {/* Slide 2 */}
          <div
            className="min-w-full h-[400px] relative flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: "url('placeholder2.jpg')" }}
          >
            <div className="text-center">
              <h2 className="text-[40px] text-white mb-2.5 drop-shadow-lg">
                Healthy Farming
              </h2>
              <p className="text-lg text-white drop-shadow-lg">
                Supporting sustainable farming practices for a greener future.
              </p>
            </div>
          </div>
          {/* Slide 3 */}
          <div
            className="min-w-full h-[400px] relative flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: "url('placeholder3.jpg')" }}
          >
            <div className="text-center">
              <h2 className="text-[40px] text-white mb-2.5 drop-shadow-lg">
                Quality Guaranteed
              </h2>
              <p className="text-lg text-white drop-shadow-lg">
                We ensure top quality from planting to harvest.
              </p>
            </div>
          </div>
        </div>
        <div
          id="sliderControls"
          className="absolute bottom-2 left-0 right-0 flex justify-center gap-2"
        >
          <div className="slider-dot active w-2.5 h-2.5 bg-white rounded-full cursor-pointer opacity-100"></div>
          <div className="slider-dot w-2.5 h-2.5 bg-white rounded-full cursor-pointer opacity-50"></div>
          <div className="slider-dot w-2.5 h-2.5 bg-white rounded-full cursor-pointer opacity-50"></div>
        </div>
      </section>

      {/* SHOP BY CATEGORY (Client Component) */}
      <ShopByCategory />

      {/* HIGHLIGHT ROW */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-5 py-5 bg-white">
        <div className="text-center flex-1 min-w-[180px]">
          <h3 className="text-lg mb-1 font-semibold">100% Branded Products</h3>
          <p className="text-gray-600">Quality you can trust</p>
        </div>
        <div className="text-center flex-1 min-w-[180px]">
          <h3 className="text-lg mb-1 font-semibold">100% Original Products</h3>
          <p className="text-gray-600">Grown without compromise</p>
        </div>
        <div className="text-center flex-1 min-w-[180px]">
          <h3 className="text-lg mb-1 font-semibold">Free Delivery</h3>
          <p className="text-gray-600">On orders over ₹500</p>
        </div>
      </div>

      {/* LATEST PRODUCTS (Dynamic) */}
      <section className="py-10 bg-[#f9f9f9]">
        <div className="container mx-auto text-center">
          <h2 className="mb-8 text-2xl font-semibold">Latest Products</h2>
          {error ? (
            <p className="text-red-500 text-lg">❌ {error}</p>
          ) : products.length === 0 ? (
            <p className="text-gray-500">No products found.</p>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </section>

      {/* OUR SERVICES (IMPROVED STYLE) */}
      <section className="py-16 bg-[url('/images/wheat-pattern.png')] bg-cover bg-center bg-no-repeat text-center">
        <div className="container mx-auto px-4 sm:px-8">
          {/* Section Title */}
          <p className="text-[#ccb26b] font-medium uppercase mb-2">Our Services</p>
          <h2 className="text-3xl font-bold mb-10">What We Offer</h2>

          <div className="flex flex-wrap justify-center gap-8">
            {/* Card 1 */}
            <div className="max-w-sm w-full bg-white shadow-lg rounded overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Quality Standards</h3>
                <p className="text-gray-600">
                  Ensuring the highest standards in farming and harvesting.
                </p>
              </div>
            </div>
            {/* Card 2 */}
            <div className="max-w-sm w-full bg-white shadow-lg rounded overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Organic Farming</h3>
                <p className="text-gray-600">
                  Zero chemicals, purely organic produce from certified farms.
                </p>
              </div>
            </div>
            {/* Card 3 */}
            <div className="max-w-sm w-full bg-white shadow-lg rounded overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Agriculture Products</h3>
                <p className="text-gray-600">
                  Wide range of fresh, local, and healthy produce.
                </p>
              </div>
            </div>
            {/* Card 4 */}
            <div className="max-w-sm w-full bg-white shadow-lg rounded overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Farm-to-Table</h3>
                <p className="text-gray-600">
                  Delivering fresh harvest straight to your doorstep.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


     {/* PROCESS (REPLACES SECOND NAVBAR) */}
     <section className="container mx-auto px-4 py-10 text-center">
        <h2 className="mb-4 text-lg italic text-[#ccb26b]">Process</h2>
        <div className="flex flex-wrap justify-center gap-16 md:gap-28 text-gray-800">
          <div>
            <h3 className="font-semibold mb-1">STEP 1</h3>
            <p>Diagnose Disease</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">STEP 2</h3>
            <p>Product Selection</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">STEP 3</h3>
            <p>Order Product</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">STEP 4</h3>
            <p>Get Delivery</p>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION
      <section>
        <FeaturesSection />
      </section> */}
      <section className="py-10 bg-[#f9f9f9]">
  <div className="container mx-auto text-center">
    <h2 className="text-2xl font-semibold mb-6">What They Say</h2>
    <div className="flex flex-wrap justify-center gap-8">
      {/* Testimonial 1 */}
      <div className="relative bg-white w-full max-w-sm p-6 rounded shadow">
        {/* Circle on the top-left */}
        <div className="absolute top-4 left-4 w-10 h-10 bg-green-500 rounded-full border-dashed border-2 border-[#ccb26b]"></div>
        {/* Star rating */}
        <div className="mt-8 flex justify-center">
          <span className="text-[#ccb26b] text-xl">★★★★★</span>
        </div>
        <p className="mt-4 text-gray-600">
          “Lorem ipsum dolor sit amet, consectetur adipiscing elit.”
        </p>
      </div>

      {/* Testimonial 2 */}
      <div className="relative bg-white w-full max-w-sm p-6 rounded shadow">
        <div className="absolute top-4 left-4 w-10 h-10 bg-green-500 rounded-full border-dashed border-2 border-[#ccb26b]"></div>
        <div className="mt-8 flex justify-center">
          <span className="text-[#ccb26b] text-xl">★★★★★</span>
        </div>
        <p className="mt-4 text-gray-600">
          “Pellentesque habitant morbi tristique senectus et netus.”
        </p>
      </div>

      {/* Testimonial 3 */}
      <div className="relative bg-white w-full max-w-sm p-6 rounded shadow">
        <div className="absolute top-4 left-4 w-10 h-10 bg-green-500 rounded-full border-dashed border-2 border-[#ccb26b]"></div>
        <div className="mt-8 flex justify-center">
          <span className="text-[#ccb26b] text-xl">★★★★★</span>
        </div>
        <p className="mt-4 text-gray-600">
          “Quisque facilisis tellus in ipsum bibendum, sed consequat nisl congue.”
        </p>
      </div>
    </div>
  </div>
</section>

      

      {/* TESTIMONIALS */}
      <section className="py-10 bg-[#f9f9f9]">
        <Testimonials />
      </section>

      {/* FOOTER */}
      <footer className="bg-[#4f8e42] text-white py-5 text-center">
        {/* ... same as before ... */}
      </footer>

      {/* SLIDER SCRIPT */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const sliderWrapper = document.getElementById('sliderWrapper');
              const sliderDots = document.querySelectorAll('.slider-dot');
              let currentSlide = 0;
              const totalSlides = sliderDots.length;

              function goToSlide(index) {
                sliderWrapper.style.transform = 'translateX(' + (-100 * index) + '%)';
                sliderDots.forEach(dot => dot.classList.remove('active'));
                sliderDots[index].classList.add('active');
                currentSlide = index;
              }

              sliderDots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                  goToSlide(index);
                });
              });

              setInterval(() => {
                let nextSlide = currentSlide + 1;
                if (nextSlide >= totalSlides) nextSlide = 0;
                goToSlide(nextSlide);
              }, 5000);
            })();
          `,
        }}
      />
    </>
  );
}
