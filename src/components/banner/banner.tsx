"use client"
import React, { useEffect, useRef, useState } from 'react';

const images: string[] = [
  'https://images.falabella.com/v3/assets/bltf4ed0b9a176c126e/bltfd7a2eb3b0d90e1c/66e88ff484fac34ddf2ca47a/full-ancho-170924-tv.png?auto=webp&quality=70&width=90p',
  'https://images.falabella.com/v3/assets/bltf4ed0b9a176c126e/bltfd7a2eb3b0d90e1c/66e88ff484fac34ddf2ca47a/full-ancho-170924-tv.png?auto=webp&quality=70&width=90p',
  'https://images.falabella.com/v3/assets/bltf4ed0b9a176c126e/bltfd7a2eb3b0d90e1c/66e88ff484fac34ddf2ca47a/full-ancho-170924-tv.png?auto=webp&quality=70&width=90p',
  'https://images.falabella.com/v3/assets/bltf4ed0b9a176c126e/bltfd7a2eb3b0d90e1c/66e88ff484fac34ddf2ca47a/full-ancho-170924-tv.png?auto=webp&quality=70&width=90p'
];

const InfiniteCarousel: React.FC = () => {
  return (
    <div className="relative overflow-hidden w-full max-w-lg mx-auto">
      <div className="carousel-wrapper">
        <div className="carousel-inner">
          {images.concat(images).map((image, i) => (
            <div key={i} className="carousel-item">
              <img src={image} alt={`Slide ${i}`} className="w-full h-auto object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfiniteCarousel;
