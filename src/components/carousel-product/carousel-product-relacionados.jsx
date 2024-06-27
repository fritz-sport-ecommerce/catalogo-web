"use client";

import React from "react";
import Carousel from "react-multi-carousel";

import "react-multi-carousel/lib/styles.css";
import ProductRelacionados from "../product/product-relacionados";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 4, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 3,
    slidesToSlide: 3, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 767, min: 300 },
    items: 2,
    slidesToSlide: 2, // optional, default to 1.
  },
};

const CarouselProductRelacionados = ({
  products,
  nuevo = false,
  generoSku = true,
  descuentos
}) => {

  return (
    <div className="parent ">
      {/* los mas vendidos */}
      {/* los mas vendidos */}

      <Carousel
        responsive={responsive}
        time={1000}
        width="100vw"
        height="45vh"
        radius="10px"
        customTransition="all 1.5s"
        // transitionDuration={10000}
        slideNumber={true}
        captionPosition="bottom"
        automatic={true}
        dots={true}
        pauseIconColor="white"
        pauseIconSize="40px"
        slideBackgroundColor="darkgrey"
        slideImageFit="cover"
        dotListClass="custom-dot-list-style"
      >
        {products.map((el, index) => (
          <ProductRelacionados
            key={index}
            generoSku={generoSku}
            nuevo={nuevo}
            products={el}
            descuentos={descuentos}
          />
        ))}
      </Carousel>
    </div>
  );
};
export default CarouselProductRelacionados;
