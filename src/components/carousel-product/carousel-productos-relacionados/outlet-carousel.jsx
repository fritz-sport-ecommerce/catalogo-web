"use client";

import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./outlet-carousel.css";
import OutletProductCard from "./outlet-product-card";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 1, // Cambiar de a 1 producto para transición más suave
    partialVisibilityGutter: 40,
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 3,
    slidesToSlide: 1, // Cambiar de a 1 producto para transición más suave
    partialVisibilityGutter: 30,
  },
  mobile: {
    breakpoint: { max: 767, min: 300 },
    items: 2,
    slidesToSlide: 1, // Cambiar de a 1 producto para transición más suave
    partialVisibilityGutter: 20,
  },
};

const OutletCarousel = ({ products }) => {
  console.log('OutletCarousel recibió productos:', products?.length);
  
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-100 rounded-lg">
        <p className="text-gray-500 text-lg">No hay productos en outlet disponibles en este momento</p>
        <p className="text-gray-400 text-sm mt-2">Productos recibidos: {products?.length || 0}</p>
      </div>
    );
  }

  return (
    <div className="parent">
      <Carousel
        responsive={responsive}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={5000}
        keyBoardControl={true}
        customTransition="transform 800ms ease-in-out"
        transitionDuration={800}
        containerClass="carousel-container"
        removeArrowOnDeviceType={["tablet", "mobile"]}
        deviceType="desktop"
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-40-px"
        pauseOnHover={true}
        swipeable={true}
        draggable={true}
        showDots={true}
        ssr={true}
        slidesToSlide={1}
        centerMode={false}
        focusOnSelect={false}
      >
        {products.map((producto, index) => (
          <OutletProductCard 
            key={`${producto._id}-${index}`} 
            product={producto} 
          />
        ))}
      </Carousel>
    </div>
  );
};

export default OutletCarousel;