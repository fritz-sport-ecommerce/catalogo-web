import { urlForImage } from "@/sanity/lib/image";
import Link from "next/link";
import React, { Dispatch, SetStateAction, useState, useRef } from "react";

interface Props {
  dataProduct: {
    images: [];
    razonsocial: string;
    slug: string;
    sku: string;
    name: string;
  };
  setLoadedImages: any;
  setLoading: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  loadedImages: [];
  currentIndex: number;
  setCurrentIndex: Dispatch<SetStateAction<number>>;
}

export default function ProductCarousel({
  dataProduct,
  setLoadedImages,
  setLoading,
  loading,
  loadedImages,
  currentIndex,
  setCurrentIndex,
}: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false); // Nuevo estado para la transición
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    if (currentIndex < dataProduct.images.length - 1) {
      setIsTransitioning(true); // Inicia la transición
      setCurrentIndex((prevIndex: number) => prevIndex + 1);
      setLoadedImages((prevImages: any) => [
        ...prevImages,
        dataProduct.images[prevImages.length],
      ]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsTransitioning(true); // Inicia la transición
      setCurrentIndex((prevIndex: number) => prevIndex - 1);
    }
  };

  const handleImageLoad = () => {
    if (loadedImages.length === dataProduct?.images?.length) {
      setLoading(false);
    }
    setIsTransitioning(false); // Termina la transición
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const distance = startX - e.clientX;
    if (distance > 100) {
      handleNext();
      setIsDragging(false);
    } else if (distance < -100) {
      handlePrev();
      setIsDragging(false);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const distance = startX - e.touches[0].clientX;
    if (distance > 100) {
      handleNext();
      setIsDragging(false);
    } else if (distance < -100) {
      handlePrev();
      setIsDragging(false);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={carouselRef}
      className="relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {isHovered && currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className="hidden xl:block absolute left-0 top-1/2 transform -translate-y-1/2 bg-transparent text-white p-2 rounded-full z-10 transition duration-200"
        >
          <svg
            viewBox="0 0 1024 1024"
            className="icon h-5 w-5"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
          >
            <path
              d="M768 903.232l-50.432 56.768L256 512l461.568-448 50.432 56.768L364.928 512z"
              fill="#000000"
            ></path>
          </svg>
        </button>
      )}

      <Link href={`/products/${dataProduct?.slug}/${dataProduct?.sku}`}>
        <div
          className="flex transition-transform duration-200 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {loadedImages?.map((image: any, index: number) => (
            <img
              key={index}
              width={2000}
              height={2000}
              className="w-full h-auto"
              src={
                image?.asset?._ref &&
                image?.asset &&
                loading === false &&
                loadedImages
                  ? urlForImage(image?.asset?._ref).url()
                  : "https://cdn.sanity.io/images/ibvmpbc1/production/82e2cc60553f917f8e776fa9c89fe2b533b1fb51-2000x2000.png"
              }
              alt={`Imagen del producto ${dataProduct?.name}`}
              onLoad={handleImageLoad}
            />
          ))}

          {/* Mostrar imagen de transición mientras se cargan las imágenes */}
          {isTransitioning && (
            <div className="absolute inset-0 flex justify-center items-center bg-white">
              <img
                src="https://cdn.sanity.io/images/ibvmpbc1/production/82e2cc60553f917f8e776fa9c89fe2b533b1fb51-2000x2000.png"
                alt="Transición de imagen"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </Link>

      {isHovered && currentIndex < dataProduct?.images?.length - 1 && (
        <button
          onClick={handleNext}
          className="hidden xl:block absolute right-0 top-1/2 transform -translate-y-1/2 bg-transparent text-white p-2 rounded-full z-10 transition duration-200"
        >
          <svg
            viewBox="0 0 1024 1024"
            className="icon h-5 w-5"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
          >
            <path
              d="M256 120.768L306.432 64 768 512l-461.568 448L256 903.232 659.072 512z"
              fill="#000000"
            ></path>
          </svg>
        </button>
      )}

      <div className="absolute bottom-0 left-0 w-full flex justify-center p-2">
        {dataProduct?.images?.map((_: any, index: number) => (
          <div
            key={index}
            className={`h-1 mx-1 rounded-full transition duration-200 ${
              currentIndex === index ? "bg-black" : "bg-gray-300"
            }`}
            style={{ width: "30px" }}
          />
        ))}
      </div>

      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-white">
          <img
            src="https://cdn.sanity.io/images/ibvmpbc1/production/82e2cc60553f917f8e776fa9c89fe2b533b1fb51-2000x2000.png"
            alt="Cargando..."
            className="w-full h-full"
          />
        </div>
      )}
    </div>
  );
}
