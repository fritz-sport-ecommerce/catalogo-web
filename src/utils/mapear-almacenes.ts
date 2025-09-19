/**
 * Mapea códigos de almacén a nombres más legibles
 * PRIORIZA el código de almacén sobre almacenTabla
 */
export function obtenerNombreAlmacen(codigoAlmacen: string, almacenTabla?: string): string {
  // Mapeo de códigos de almacén a nombres (PRIORIDAD PRINCIPAL)
  const mapaAlmacenes: Record<string, string> = {
    "0002": "Tienda Grau",
    "0009": "Almacen Iquitos",
    "4001": "Fritz Sport Los Olivos",
    "2001": "Aguas Verdes",
    "0006": "Huánuco",
  };

  // PRIMERO: Verificar por código de almacén (PRIORIDAD)
  if (mapaAlmacenes[codigoAlmacen]) {
    return mapaAlmacenes[codigoAlmacen];
  }

  // SEGUNDO: Solo si no se encuentra por código, usar almacenTabla como fallback
  const mapaAlmacenTabla: Record<string, string> = {
    "ALM0001STO1": "Tienda Grau",
    "ALM0002STO1": "Tienda Grau", 
    "ALM0003STO1": "Tienda Grau",
    "ALM0004STO1": "Almacén Desconocido",
    "ALM0009STO1": "Almacen Iquitos",
    "ALM0009STO2": "Almacen Iquitos",
  };

  if (almacenTabla && mapaAlmacenTabla[almacenTabla]) {
    return mapaAlmacenTabla[almacenTabla];
  }

  // Si no se encuentra en ningún mapeo, devolver el código original
  return `Almacén ${codigoAlmacen}`;
}

/**
 * Obtiene la provincia basada en el código de almacén
 */
export function obtenerProvinciaAlmacen(codigoAlmacen: string, almacenTabla?: string): string {
  switch (codigoAlmacen) {
    case "0002":
      return "LIMA"; // Tienda Grau está en Lima
    case "0009":
      return "Central"; // Iquitos está en central (corregido)
    case "2001":
      return "TUMBES"; // Aguas Verdes está en Tumbes
    case "4001":
      return "LIMA"; // Fritz Sport Los Olivos está en Lima
    case "0006":
      return "HUANUCO"; // Huánuco está en Huánuco
    default:
      return "DESCONOCIDO";
  }
}