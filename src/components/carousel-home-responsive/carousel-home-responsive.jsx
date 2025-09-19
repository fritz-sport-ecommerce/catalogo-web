"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./carousel.css";
import { useEffect, useState } from "react";
import Head from "next/head";

import { urlForImage } from "@/sanity/lib/image";
import Link from "next/link";

// Definimos el tipo para las propiedades de cada slide según tu estructura

const CarouselHomeResponsive = ({ slides, autoPlayDelay = 5000 }) => {
  // Ordenamos los slides por la propiedad 'order' por si acaso
  const sortedSlides = [...slides].sort((a, b) => a.order - b.order);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      <Head>
        {sortedSlides[0] && (
          <link
            rel="preload"
            as="image"
            href={urlForImage(sortedSlides[0]?.imgdeskt?.asset?._ref).url()}
            imagesrcset={urlForImage(sortedSlides[0]?.imgdeskt?.asset?._ref).url()}
            imageSizes="100vw"
            fetchpriority="high"
          />
        )}
      </Head>
      <div className={`carousel-container ${isLoaded ? "fade-in" : "fade-out"}`}>
        {!isLoaded && <div className="carousel-skeleton" />}
        {isLoaded && (
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={0}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: autoPlayDelay,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
          >
            {sortedSlides?.map((slide, i) => (
              <SwiperSlide key={i}>
                <Link
                  href={slide?.urlslider}
                 
                  rel="noopener noreferrer"
                >
                  <picture>
                    <source
                      media="(max-width: 480px)"
                      srcSet={urlForImage(slide?.imgmob?.asset._ref).url()}
                      {...(i === 0 ? { fetchpriority: "high" } : {})}
                    />
                    <source
                      media="(max-width: 1024px)"
                      srcSet={urlForImage(slide?.imgtab?.asset._ref).url()}
                      {...(i === 0 ? { fetchpriority: "high" } : {})}
                    />
                    <source
                      media="(min-width: 1025px)"
                      srcSet={urlForImage(slide?.imgdeskt?.asset._ref).url()}
                      {...(i === 0 ? { fetchpriority: "high" } : {})}
                    />
                    <img
                      src={urlForImage(slide?.imgdeskt?.asset?._ref).url()}
                      alt={`Slide ${slide.nombre_empresa}`}
                      className="carousel-image carousel-image-full"
                      {...(i === 0 ? { loading: "eager", fetchpriority: "high" } : { loading: "lazy" })}
                    />
                  </picture>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </>
  );
};

export default CarouselHomeResponsive;
