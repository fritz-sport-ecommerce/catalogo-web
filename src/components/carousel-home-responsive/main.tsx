export const fetchCache = "force-no-store";
export const revalidate = 0; // seconds
export const dynamic = "force-dynamic";

import { SanitySlider } from "@/config/inventory";
import CarouselHomeResponsive from "./carousel-home-responsive";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { Suspense } from "react";

const LoadingCarousel = () => (
  <div className="mt-5">
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
  </div>
);
export default async function MainCarouselHome() {
  const slider = await client.fetch<SanitySlider[]>(
    groq`*[_type == "home-fz"] {
      slider
  }[0].slider`,
    { cache: "no-store" } // opciones de fetch
  );
  return (
    <Suspense fallback={<LoadingCarousel />}>
      <CarouselHomeResponsive slides={slider} />
    </Suspense>
  );
}
