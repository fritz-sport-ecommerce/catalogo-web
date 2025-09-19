"use client";

import { useState, useEffect } from 'react';

export function useResponsiveText() {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    // Set initial size
    updateScreenSize();

    // Add event listener
    window.addEventListener('resize', updateScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  const limitText = (
    texto: string,
    mobileChars: number = 20,
    tabletChars: number = 30,
    desktopChars: number = 45
  ): string => {
    if (!texto) return '';

    let maxCaracteres: number;
    
    switch (screenSize) {
      case 'mobile':
        maxCaracteres = mobileChars;
        break;
      case 'tablet':
        maxCaracteres = tabletChars;
        break;
      default:
        maxCaracteres = desktopChars;
    }

    if (texto.length <= maxCaracteres) {
      return texto;
    }

    return texto.substring(0, maxCaracteres) + '...';
  };

  return { limitText, screenSize };
}