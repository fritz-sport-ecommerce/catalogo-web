"use client";

import React from "react";
import Link from "next/link";

import ProductCardsMobile from "./ProductCardsMobile";
import { Button } from "../ui/button";
// import ProductCardsMobile from "./ProductCardsMobile";

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

interface ProductCardsClientProps {
  cards: ProductCard[];
}

const ProductCardsClient: React.FC<ProductCardsClientProps> = ({ cards }) => {
  console.log(cards);
  
  // Filtrar cards válidos usando useMemo para evitar re-renders innecesarios
  // const validCards = useMemo(() => {
  //   return cards.filter(card => {
  //     if (!card || typeof card !== 'object') {
  //       console.warn("ProductCardsClient: Invalid card object", card);
  //       return false;
  //     }
      
  //     if (!card.title || !card.image || !card.link) {
  //       console.warn("ProductCardsClient: Card missing required fields", card);
  //       return false;
  //     }
      
  //     // Validar que image sea un objeto válido de Sanity
  //     if (!card.image || typeof card.image !== 'object' || !card.image.asset) {
  //       console.warn("ProductCardsClient: Invalid image object", card.image);
  //       return false;
  //     }
      
  //     return true;
  //   });
  // }, [cards]);

  // if (validCards.length === 0) {
  //   console.log("ProductCardsClient: No valid cards to display");
  //   return null;
  // }
  


  return (
    <section className="w-full">
      {/* Desktop Grid */}
      <div className="hidden lg:grid grid-cols-3 gap-6 w-full h-[80vh] p-6">
                 {cards?.map((card, index) => {
             // Validar que la imagen existe antes de procesarla
             if (!card.image) {
               console.warn("ProductCardsClient: card.image is null/undefined", card);
               return null;
             }

             return (
               <div key={card._key || `card-${index}`} className="relative rounded-2xl overflow-hidden shadow-2xl bg-white group">
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                 <img 
                   src={card.image} 
                   alt={card.alt || card.title} 
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                   loading="lazy"
                   onError={(e) => {
                     console.error("ProductCardsClient: Image failed to load", card.image, card);
                     e.currentTarget.style.display = 'none';
                   }}
                 />
                 <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                   {card.subtitle && (
                     <p className="text-white/80 text-sm mb-2 font-medium">{card.subtitle}</p>
                   )}
                   <h3 className="text-white text-2xl font-bold mb-2">{card.title}</h3>
                   {card.description && (
                     <p className="text-white/90 text-sm mb-6">{card.description}</p>
                   )}
                   <Link href={card.link}>
                     <Button className="text-base rounded-none py-2 bg-white text-black">
                       {card.buttonText}
                     </Button>
                   </Link>
                 </div>
               </div>
             );
           })}
        </div>

        {/* Mobile Carousel */}
        <div className="lg:hidden w-full h-[80vh]">
          <ProductCardsMobile cards={cards} />
        </div>
      </section>
    );
};

export default ProductCardsClient; 