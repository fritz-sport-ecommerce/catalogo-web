export default function calcularDescuentoProductPdf(precioOriginal: number, precioConDescuento: number): number {
    if (precioOriginal === 0) {
      throw new Error("El precio original no puede ser cero.");
    }
  
    const descuento = precioOriginal - precioConDescuento;
    const porcentajeDescuento = (descuento / precioOriginal) * 100;
  
    // Redondeamos el resultado al número entero más cercano
    return Math.round(porcentajeDescuento); // Usa Math.floor() si prefieres redondear hacia abajo
  }
  
