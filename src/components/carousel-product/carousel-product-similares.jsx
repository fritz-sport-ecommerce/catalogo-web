"use client";

import React, { useState } from "react";
import Carousel from "react-multi-carousel";

import "react-multi-carousel/lib/styles.css";
import Product from "../product/product";
import { Button } from "../ui/button";
import PromoImageGrid from "../promo-image-grid/promo-image-grid";

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

const CarouselProductSimilares = ({ children }) => {
  const [marcaCategoriaDestacada, setMarcaCategoriaDestacada] =
    useState("adidas");
  const dataCategorias = {
    adidas: [
      {
        img: "https://cdn.sanity.io/images/ibvmpbc1/production/9e5542811530ac3747416cf81319ace5662b51b7-420x640.png",
        url: "/tienda?search=samba",
      },
      {
        img: "https://cdn.sanity.io/images/ibvmpbc1/production/6b27ada316e008eedeb4f5aa4cf48a5782edd446-420x640.png",
        url: "/tienda?search=superstar",
      },
      {
        img: "https://cdn.sanity.io/images/ibvmpbc1/production/c566f60c87eaccd27240d3bbce5266f24c8eed7b-420x640.png",
        url: "/tienda?search=forum",
      },
      {
        img: "https://cdn.sanity.io/images/ibvmpbc1/production/76217c8bec8a10cf4afe730e47a2ef68319f0c0e-420x640.png",

        url: "/tienda?search=stan-smith",
      },
      {
        img: "https://cdn.sanity.io/images/ibvmpbc1/production/e88af2517f2daf0b02898baf82e3051fed1594bb-420x640.png",
        url: "/tienda?search=gazelle",
      },
      {
        img: "https://cdn.sanity.io/images/ibvmpbc1/production/260e712d92d913c1bfe16e4d333689cc1bcf3690-420x640.png",
        url: "/tienda?search=campus",
      },
    ],
    nike: [
      {
        img: "https://cdn.sanity.io/images/ibvmpbc1/production/9110cf611b16d8c338a6a2325868f45816621a5c-420x640.jpg",
        url: "/tienda?search=air-force",
      },

      {
        img: "https://cdn.sanity.io/images/ibvmpbc1/production/d53be04fd4c6994dc06b0b03858686ffa5564b27-420x640.jpg",
        url: "/tienda?search=jordan",
      },
      {
        img: "https://cdn.sanity.io/images/ibvmpbc1/production/35861c9edaec560367bc8c1d62d6b02747db28ee-420x640.jpg",
        url: "/tienda?search=dunk",
      },
      {
        img: "https://cdn.sanity.io/images/ibvmpbc1/production/37f0f6ee505f4ecbde2bc9bc875d4245abbc375c-420x640.jpg",
        url: "/tienda?search=airmax",
      },
      {
        img: "https://cdn.sanity.io/images/ibvmpbc1/production/a3e5a4b2b98b4b0f951790f74feec52914b001b9-420x640.jpg",
        url: "/tienda?coleccion=blazer",
      },
    ],
  };

  const [dataCategoria, setDataCategoria] = useState(dataCategorias.adidas);
  const handlerCategoria = (marca) => {
    switch (marca) {
      case "adidas":
        setMarcaCategoriaDestacada(marca);
        setDataCategoria(dataCategorias.adidas);
        break;

      case "nike":
        setMarcaCategoriaDestacada(marca);

        setDataCategoria(dataCategorias.nike);

        break;

      default:
        break;
    }
  };
  return (
    <>
      <div className="flex justify-center px-2">
        <div className="grid w-full grid-flow-col container mt-5 gap-x-8 ">
          <Button
            onClick={() => handlerCategoria("adidas")}
            className={`uppercase p-0  hover:text-white rounded-none dark:hover:text-black rounded-lg ${
              marcaCategoriaDestacada === "adidas"
                ? "bg-black dark:bg-white "
                : " bg-transparent border-[1px] border-black dark:border-white text-black dark:text-white"
            }`}
          >
            Adidas
          </Button>
          <Button
            onClick={() => handlerCategoria("nike")}
            className={`uppercase p-0  hover:text-white rounded-none dark:hover:text-black rounded-lg  ${
              marcaCategoriaDestacada === "nike"
                ? "bg-black dark:bg-white "
                : " bg-transparent border-[1px] border-black dark:border-white text-black dark:text-white"
            }`}
          >
            Nike
          </Button>
        </div>
      </div>

      <div className="parent ">
        <Carousel
          responsive={responsive}
          time={2000}
          width="100vw"
          // height="45vh"
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
          {dataCategoria.map((el, i) => (
            <PromoImageGrid
              key={i}
              urlImg={el.img}
              titulo={""}
              subtitulo={""}
              url={el.url}
            />
          ))}
        </Carousel>
      </div>
    </>
  );
};
export default CarouselProductSimilares;
