export default function determinarSubgeneroPorTalla(
  sizes: string[],
  brand: string = "ADIDAS",
  tipo:string 
): string {
  const categorias: Record<
    string,
    {
      bebes: string[];
      ninos: string[];
      jovenes: string[];
    }
  > = {
    ADIDAS: {
      bebes: ["1K", "2K", "3K", "4K", "5K", "5.5K", "6K", "6.5K", "7K", "7.5K", "8K", "8.5K", "9K", "9.5K", "10K"],
      ninos: ["10.5K", "11K", "11.5K", "12K", "12.5K", "13K", "13.5K", "1", "1.5", "2", "2.5", "3"],
      jovenes: ["3.5", "4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5"],
    },
    NIKE: {
      bebes: ["5C", "6C", "7C", "8C", "9C"],
      ninos: ["9C", "10.5C", "11C", "11.5C", "12C", "12.5C", "13C", "13.5C", "1Y", "1.5Y", "2Y", "2.5Y", "3Y"],
      jovenes: ["3.5Y", "4Y", "4.5Y", "5Y", "5.5Y", "6Y", "6.5Y", "7Y"],
    },
    PUMA: {
      bebes: ["17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27"],
      ninos: ["28", "29", "30", "31", "32", "33", "34", "35"],
      jovenes: ["36", "37", "38", "39", "40"],
    },
  };

  const categoriasRopa: Record<string, { bebes: string[]; ninos: string[]; jovenes: string[] }> = {
    ADIDAS: {
      bebes: ["2XS", "5T", "2T", "3T", "4T"],
      ninos: ["XS", "S", "M"],
      jovenes: ["L", "XL"],
    },
    NIKE: {
      bebes: ["2XS", "5T", "2T", "3T", "4T"],
      ninos: ["XS", "S", "M"],
      jovenes: ["L", "XL"],
    },
    PUMA: {
      bebes: ["2XS", "5T", "2T", "3T", "4T"],
      ninos: ["XS", "S", "M"],
      jovenes: ["L", "XL"],
    },
  };

  if (!categorias[brand?.toUpperCase()] && !categoriasRopa[brand?.toUpperCase()]) {
    return "Marca no soportada";
  }
  
  // retornamos niño o niña si es un accesorio
  if (sizes?.length > 0) {
    for (const size of sizes) {
      const brandUpper = brand.toUpperCase();
      if (categorias[brandUpper]?.bebes.includes(size) || categoriasRopa[brandUpper]?.bebes.includes(size)) {
        return "bebe";
      }
      if (categorias[brandUpper]?.ninos.includes(size) || categoriasRopa[brandUpper]?.ninos.includes(size)) {
        return "ninonina";
      }
      if (categorias[brandUpper]?.jovenes.includes(size) || categoriasRopa[brandUpper]?.jovenes.includes(size)) {
        return "joven";
      }
    }
  }
  if (tipo === "accesorios") {
    return "ninonina"
  }
  return "Categoría no determinada";
}
