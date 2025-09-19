"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

interface ProductCard {
  _key?: string; // Sanity generates this automatically for array items
  image: string; // URL procesada de la imagen
  alt: string;
  title: string;
  subtitle?: string;
  description?: string;
  buttonText: string;
  link: string;
}

interface ProductCardsMobileProps {
  cards: ProductCard[];
}

const ProductCardsMobile: React.FC<ProductCardsMobileProps> = ({ cards }) => {
  // Filtrar cards válidos usando useMemo para evitar re-renders innecesarios
  // const validCards = useMemo(() => {
  //   return cards.filter(card => {
  //     if (!card || typeof card !== 'object') {
  //       console.warn("ProductCardsMobile: Invalid card object", card);
  //       return false;
  //     }
      
  //     if (!card.title || !card.image || !card.link) {
  //       console.warn("ProductCardsMobile: Card missing required fields", card);
  //       return false;
  //     }
      
  //     // Validar que image sea un objeto válido de Sanity
  //     if (!card.image || typeof card.image !== 'object' || !card.image.asset) {
  //       console.warn("ProductCardsMobile: Invalid image object", card.image);
  //       return false;
  //     }
      
  //     return true;
  //   });
  // }, [cards]);
  
  // if (validCards.length === 0) {
  //   console.log("ProductCardsMobile: No valid cards to display");
  //   return null;
  // }
  
  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      spaceBetween={0}
      slidesPerView={1}
      loop={cards.length > 1}
      autoplay={
        cards.length > 1 
          ? {
              delay: 5000,
              disableOnInteraction: false,
            }
          : false
      }
      pagination={
        cards.length > 1
          ? {
              clickable: true,
              dynamicBullets: true,
            }
          : false
      }
      className="h-full"
    >
             {cards.map((card, index) => {
         // Validar que la imagen existe antes de procesarla
         if (!card.image) {
           console.warn("ProductCardsMobile: card.image is null/undefined", card);
           return null;
         }

         return (
           <SwiperSlide key={card._key || `card-${index}`}>
             <div className="relative w-full h-full">
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
               <img 
                 src={card.image} 
                 alt={card.alt || card.title} 
                 className="w-full h-full object-cover" 
                 loading="lazy"
                 onError={(e) => {
                   console.error("ProductCardsMobile: Image failed to load", card.image, card);
                   e.currentTarget.style.display = 'none';
                 }}
               />
               <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                 {card.subtitle && (
                   <p className="text-white/80 text-sm mb-2 font-medium">{card.subtitle}</p>
                 )}
                 <h3 className="text-white text-xl font-bold mb-2">{card.title}</h3>
                 {card.description && (
                   <p className="text-white/90 text-sm mb-4">{card.description}</p>
                 )}
                 <a 
                   href={card.link}
                   className="inline-block px-6 py-2 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-colors duration-200"
                 >
                   {card.buttonText}
                 </a>
               </div>
             </div>
           </SwiperSlide>
         );
       })}
    </Swiper>
  );
};

export default ProductCardsMobile; 