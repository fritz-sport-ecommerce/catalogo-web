import { Suspense } from "react";
import CarouselProductRelacionados from "./carousel-product-relacionados";
import { fetchBestSellingProducts } from "@/config/productos-por-limite";
const LoadingCarousel = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    <div className="  ">
      <div className="h-64 bg-gray-200 rounded-lg"></div>
      <div className="mt-2 h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
    <div className="  ">
      <div className="h-64 bg-gray-200 rounded-lg"></div>
      <div className="mt-2 h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
    <div className="   hidden md:block">
      <div className="h-64 bg-gray-200 rounded-lg"></div>
      <div className="mt-2 h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
    <div className="   hidden lg:block">
      <div className="h-64 bg-gray-200 rounded-lg"></div>
      <div className="mt-2 h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
);
const LoadingSection = () => (
  <div className="space-y-4">
    <div className="h-8 w-1/3    rounded bg-gray-200 mx-auto" />
    <LoadingCarousel />
  </div>
);
export default async function MasVendidos() {
  const productosAll = await fetchBestSellingProducts({
    limit: 24,
    gender: "unisex",
  });
  return (
    <Suspense fallback={<LoadingSection />}>
      <CarouselProductRelacionados products={productosAll} />
    </Suspense>
  );
}
