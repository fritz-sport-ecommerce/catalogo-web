export function calcularPrecioConDescuento(
  precioRetail: number,
  precioMayorista: number
): number | null {
  // Validar si el descuento es mayor al 70% (inválido)
  if (precioMayorista < precioRetail * 0.3) {
    return null;
  }

  // Si los precios son diferentes, calcular y aplicar el descuento
  if (precioRetail !== precioMayorista) {
    const porcentajeDescuento =
      ((precioRetail - precioMayorista) / precioRetail) * 100;
    const precioFinal = precioRetail * (1 - porcentajeDescuento / 100);
    
    // Validar que el precio final no sea menor a S/20
    if (precioFinal < 20) {
      return null;
    }
    
    return precioFinal; // Precio con descuento aplicado
  }

  // Si son iguales, retornar el precio retail (sin cambios)
  return precioRetail;
}
