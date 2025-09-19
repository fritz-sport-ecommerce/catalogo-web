export function obtenerProvinciaProducto(
  codigoAlmacen: string,
  almacenTabla: string,
  stockDisponible: number,
  almacenes: { provincia: string; stock: number }[]
): { provincia: string; stock: number }[] {
  const provincia = (() => {
    switch (codigoAlmacen) {
      case "0002":
        return "LIMA"; // Tienda Grau
      case "0009":
        return "LORETO"; // Iquitos
      case "2001":
        return "TUMBES"; // Aguas Verdes
      case "4001":
        return "LIMA"; // Fritz Sport Los Olivos
      case "0006":
        return "HUANUCO"; // Huánuco
      default:
        return "DESCONOCIDO";
    }
  })();

  const existingProvincia = almacenes.find(
    (alm) => alm.provincia === provincia
  );

  if (existingProvincia) {
    existingProvincia.stock += stockDisponible;
  } else {
    almacenes.push({ provincia, stock: stockDisponible });
  }

  return almacenes;
}
