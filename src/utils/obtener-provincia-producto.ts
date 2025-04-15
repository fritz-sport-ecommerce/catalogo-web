export function obtenerProvinciaProducto(
  codigoAlmacen: string,
  almacenTabla: string,
  stockDisponible: number,
  almacenes: { provincia: string; stock: number }[]
): { provincia: string; stock: number }[] {
  const provincia = (() => {
    if (codigoAlmacen === "0002") {
      return ["ALM0001STO1", "ALM0002STO1", "ALM0003STO1"].includes(
        almacenTabla
      )
        ? "LIMA"
        : "HUANUCO";
    }

    switch (codigoAlmacen) {
      case "2001":
        return "TUMBES";
      case "0009":
        return "LIMA";
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
