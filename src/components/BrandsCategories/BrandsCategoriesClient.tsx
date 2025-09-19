"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { urlForImage } from "@/sanity/lib/image";
import { Brand, Category } from "@/lib/fetchHomeData";

interface BrandsCategoriesClientProps {
  brands: Brand[];
  categories: Category[];
  title: string;
}

const BrandsCategoriesClient: React.FC<BrandsCategoriesClientProps> = ({ brands, categories, title }) => {
  return (
    <section className="w-full py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-center text-2xl md:text-3xl font-bold mb-12">
          {title}
        </h2>

        {/* Brands Section */}
        {brands && brands.filter(brand => brand && brand.name && brand.logo).length > 0 && (
          <div className="mb-12">
            <div className="relative">
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={2}
                breakpoints={{
                  640: {
                    slidesPerView: 1,
                  },
                  768: {
                    slidesPerView: 1,
                  },
                  1024: {
                    slidesPerView: 3,
                  },
                  1280: {
                    slidesPerView: 3,
                  },
                }}
                navigation={{
                  nextEl: '.brands-next',
                  prevEl: '.brands-prev',
                }}
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                }}
                className="brands-swiper"
              >
                                   {brands.map((brand, index) => (
                    <SwiperSlide key={brand._id || `brand-${index}`}>
                     <Link href={brand.link}>
                                               <div className={`${brand.background || 'bg-white'} rounded-xl p-6 h-24 flex items-center justify-center transition-shadow hover:shadow-lg cursor-pointer`}>
                         <img 
                           src={urlForImage(brand.logo).url()} 
                           alt={brand.name} 
                           className="max-h-12 max-w-full object-contain"
                         />
                       </div>
                     </Link>
                   </SwiperSlide>
                 ))}
              </Swiper>
              
              {/* Navigation Arrows */}
              <button className="brands-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="brands-next absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Categories Section */}
        {categories && categories.filter(category => category && category.name && category.image).length > 0 && (
          <div>
            <div className="relative">
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={2}
                breakpoints={{
                  640: {
                    slidesPerView: 3,
                  },
                  768: {
                    slidesPerView: 4,
                  },
                  1024: {
                    slidesPerView: 5,
                  },
                  1280: {
                    slidesPerView: 7,
                  },
                }}
                navigation={{
                  nextEl: '.categories-next',
                  prevEl: '.categories-prev',
                }}
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                }}
                className="categories-swiper"
              >
                                   {categories.map((category, index) => (
                    <SwiperSlide key={category._id || `category-${index}`}>
                     <Link href={category.link}>
                                               <div className={`${category.background || 'bg-black'} overflow-hidden transition-shadow cursor-pointer group`}>
                         <div className="aspect-square relative">
                           <img 
                             src={urlForImage(category.image).url()} 
                             alt={category.name} 
                             className="w-full h-full rounded-xl object-cover group-hover:scale-105 transition-transform duration-300"
                           />
                           <div className="absolute inset-0 group-hover:bg-black/10 transition-colors" />
                         </div>
                         <div className="p-4 text-center">
                           <h3 className="font-semibold text-sm text-white ">{category.name}</h3>
                         </div>
                       </div>
                     </Link>
                   </SwiperSlide>
                 ))}
              </Swiper>
              
              {/* Navigation Arrows */}
              <button className="categories-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="categories-next absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .brands-swiper,
        .categories-swiper {
          padding: 0 50px;
        }
        
        .swiper-pagination {
          bottom: -30px;
        }
        
        .swiper-pagination-bullet {
          background: #9ca3af;
          opacity: 0.5;
        }
        
        .swiper-pagination-bullet-active {
          background: #374151;
          opacity: 1;
        }
      `}</style>
    </section>
  );
};

export default BrandsCategoriesClient; 