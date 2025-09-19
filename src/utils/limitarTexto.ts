import style from "styled-jsx/style";

import { title } from "process";

// Función original mantenida para compatibilidad
export function LimitarTexto(texto: string, maxCaracteres?: number): string {
  if (!texto) return "";

  // Si no se proporciona maxCaracteres, usar valores responsive por defecto
  if (maxCaracteres === undefined) {
    // Detectar si es mobile usando window.innerWidth
    if (typeof window !== "undefined") {
      const isMobile = window.innerWidth < 768; // md breakpoint en Tailwind
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024; // lg breakpoint

      if (isMobile) {
        maxCaracteres = 20; // Más corto en mobile
      } else if (isTablet) {
        maxCaracteres = 30; // Intermedio en tablet
      } else {
        maxCaracteres = 45; // Más largo en desktop
      }
    } else {
      // Fallback para SSR
      maxCaracteres = 30;
    }
  }

  if (texto.length <= maxCaracteres) {
    return texto;
  }

  return texto.substring(0, maxCaracteres) + "...";
}

// Función mejorada con más control responsive
export function LimitarTextoResponsive(
  texto: string,
  mobileChars: number = 18,
  tabletChars: number = 28,
  desktopChars: number = 40
): string {
  if (!texto) return "";

  let maxCaracteres = desktopChars;

  if (typeof window !== "undefined") {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

    if (isMobile) {
      maxCaracteres = mobileChars;
    } else if (isTablet) {
      maxCaracteres = tabletChars;
    }
  }

  if (texto.length <= maxCaracteres) {
    return texto;
  }

  return texto.substring(0, maxCaracteres) + "...";
}
