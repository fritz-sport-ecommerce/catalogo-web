"use client";
import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
// import "@/styles/carousel-productos-rapidos.css";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1200 },
    items: 4,
    slidesToSlide: 2,
  },
  laptop: {
    breakpoint: { max: 1199, min: 1024 },
    items: 3,
    slidesToSlide: 2,
  },
  tablet: {
    breakpoint: { max: 1023, min: 768 },
    items: 3,
    slidesToSlide: 2,
  },
  mobile: {
    breakpoint: { max: 767, min: 480 },
    items: 2,
    slidesToSlide: 1,
  },
  mobileSmall: {
    breakpoint: { max: 479, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

export default function AccesoriosCarousel({ children, onEndReached, loadingMore }: { children: React.ReactNode, onEndReached?: () => void, loadingMore?: boolean }) {
  // Detectar si el usuario llegó al final del carousel
  const handleAfterChange = (currentSlide: number) => {
    const total = React.Children.count(children);
    // Si el último slide es visible, dispara onEndReached
    if (onEndReached && currentSlide + responsive.desktop.items >= total) {
      onEndReached();
    }
  };
  return (
    <div className="parent w-full">
      <Carousel
        responsive={responsive}
        arrows
        showDots
        infinite={false}
        customTransition="all 0.8s ease-in-out"
        containerClass="carousel-container px-2"
        itemClass="px-1 sm:px-2"
        dotListClass="custom-dot-list-style mt-4"
        renderButtonGroupOutside={false}
        renderDotsOutside={false}
        afterChange={handleAfterChange}
        autoPlay={false}
        swipeable
        draggable
        partialVisible={false}
      >
        {children}
        {loadingMore && (
          <div className="flex flex-col items-center justify-center min-h-[280px] sm:min-h-[320px] p-3 sm:p-4">
            <div className="w-16 sm:w-24 h-16 sm:h-24 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
            <div className="h-3 sm:h-4 w-12 sm:w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        )}
      </Carousel>
    </div>
  );
} 