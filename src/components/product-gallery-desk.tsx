"use client";

import { useState } from "react";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";
import { PhotoProvider, PhotoView } from "react-photo-view";

import { SanityProduct } from "@/config/inventory";
import { shimmer, toBase64 } from "@/lib/image";

import "react-photo-view/dist/react-photo-view.css";
import ToTop from "@/utils/scroll-top";

interface Props {
  product: SanityProduct;
}

export function ProductGalleryDesk({ product }: Props) {
  const articlesShown = 2;
  const [loadMore, setLoadMore] = useState(articlesShown);
  const showMoreArticles = () => {
    setLoadMore(loadMore + articlesShown);
  };

  const showRestArticles = (cantidad: number) => {
    setLoadMore(loadMore - cantidad);
    ToTop();
  };
  const [activeViewImg, setActiveViewImg] = useState(false);
  return (
    <div className="flex flex-col ">
      {/* Image Grid */}
      <div className=" h-full w-full ">
        <ul className={`grid   justify-start gap-[2px] sm:grid-cols-2 lg:col-span-3 ${product?.images?.length > 2 ? "2xl:grid-cols-2" : "2xl:grid-cols-1"}`}>
          {product?.images?.length ? (
            <>
              {product?.images?.slice(0, loadMore).map((image, index) => (
                <div
                  key={index}
                  className={`${
                    activeViewImg ? "cursor-crosshair" : "cursor-default"
                  }`}
                >
                  {image?.asset && (
                    <PhotoProvider>
                      <PhotoView src={urlForImage(image).url()}>
                        <img
                          onMouseEnter={() => setActiveViewImg(true)}
                          onMouseLeave={() => setActiveViewImg(false)}
                          className="h-full w-full "
                          src={urlForImage(image).url()}
                          alt={`${product?.name} ${index + 1}`}
                        />
                      </PhotoView>
                    </PhotoProvider>
                  )}
                </div>
              ))}
            </>
          ) : (
            <>
    
              {product?.imgcatalogomain ? (
                <li className="col-span-2 h-full w-full sm:col-span-1 lg:col-span-2 2xl:col-span-1 bg-white ">
                  <PhotoProvider>
                    <PhotoView src={urlForImage(product.imgcatalogomain).url()}>
                      <Image
                        onMouseEnter={() => setActiveViewImg(true)}
                        onMouseLeave={() => setActiveViewImg(false)}
                        className="h-full w-full object-cover"
                        src={urlForImage(product.imgcatalogomain).url()}
                        alt=""
                        width={2000}
                        height={2000}
                        placeholder="blur"
                        blurDataURL={`data:image/svg+xml;base64,${toBase64(
                          shimmer(2000, 2000)
                        )}`}
                        loader={() =>
                          urlForImage(product.imgcatalogomain).url() ??
                          "https://cdn.sanity.io/images/ibvmpbc1/production/82e2cc60553f917f8e776fa9c89fe2b533b1fb51-2000x2000.png"
                        }
                      />
                    </PhotoView>
                  </PhotoProvider>
                </li>
              ) : (
                <img
                  onMouseEnter={() => setActiveViewImg(true)}
                  onMouseLeave={() => setActiveViewImg(false)}
                  className="h-full w-full object-cover"
                  src={
                    "https://cdn.sanity.io/images/ibvmpbc1/production/82e2cc60553f917f8e776fa9c89fe2b533b1fb51-2000x2000.png"
                  }
                  alt=""
                  width={2000}
                  height={2000}
                  placeholder="blur"
                />
              )}
            </>
          )}
        </ul>
        <div className="flex justify-center">
          {loadMore < product?.images?.length ? (
            <button
              type="button"
              className="group relative overflow-hidden border-2 border-black bg-white px-2 py-3 text-sm md:text-base"
              onClick={showMoreArticles}
            >
              {/* <div className="duration-[350ms] absolute inset-0  w-5  transition-all ease-out group-hover:w-full"></div> */}
              <span className="relative flex  text-black">
                <div className="mr-2 font-medium uppercase"> ver MAS FOTOS</div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </span>
            </button>
          ) : (
            <div className="flex flex-col items-center">
              {product?.images?.length > 2 && (
                <button
                  type="button"
                  className="group relative overflow-hidden border-2 border-black bg-white px-2 py-3 text-sm md:text-base"
                  onClick={() =>
                    showRestArticles(product.images?.length - articlesShown)
                  }
                >
                  {/* <div className="duration-[350ms] absolute inset-0  w-5  transition-all ease-out group-hover:w-full"></div> */}
                  <span className="relative flex  text-black">
                    <div className="mr-2 font-medium uppercase"> ver Menos</div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.5 15.75 7.5-7.5 7.5 7.5"
                      />
                    </svg>
                  </span>
                </button>
              )}
              <button
                type="button"
                className="cursor-not-allowed rounded-lg px-2 py-3 text-sm  opacity-50 md:text-base"
                onClick={showMoreArticles}
                disabled
              >
                Todas las fotos cargadas
              </button>
            </div>
          )}
        </div>
        <div className="mt-1 flex justify-center">
          {product?.images?.length ? (
            <>
              {loadMore > product?.images?.length
                ? product?.images?.length
                : loadMore}{" "}
              de {product?.images?.length} fotos
            </>
          ) : (
            <div>1 de 1 foto </div>
          )}
        </div>
      </div>

      {/* Main Image */}
    </div>
  );
}
