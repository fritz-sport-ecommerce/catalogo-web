export default function determinarSubgeneroPorTalla(
  sizes: string[] | string, // puede ser array o string
  brand: string = "ADIDAS",
  tipo: string
): string {
  // 🔹 Normalizar sizes a un array
  let sizeArray: string[] = [];

  if (Array.isArray(sizes)) {
    sizeArray = sizes;
  } else if (typeof sizes === "string" && sizes.trim().length > 0) {
    sizeArray = sizes.split(",").map((s) => s.trim());
  }

  if (sizeArray.length === 0) {
    return "Categoría no determinada";
  }

  // 📌 Diccionario de calzado
  const categoriasCalzado: Record<
    string,
    { bebes: string[]; ninos: string[]; jovenes: string[] }
  > = {
    ADIDAS: {
      bebes: [
        "1K",
        "2K",
        "3K",
        "4K",
        "5K",
        "5.5K",
        "6K",
        "6.5K",
        "7K",
        "7.5K",
        "8K",
        "8.5K",
        "9K",
        "9.5K",
        "10K",
      ],
      ninos: [
        "10.5K",
        "11K",
        "11.5K",
        "12K",
        "12.5K",
        "13K",
        "13.5K",
        "1",
        "1.5",
        "2",
        "2.5",
        "3",
      ],
      jovenes: ["3.5", "4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5"],
    },
    NIKE: {
      bebes: ["1C", "2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "10C"],
      ninos: [
        "10.5C",
        "10.5",
        "11C",
        "11",
        "11.5C",
        "11.5",
        "12C",
        "12",
        "12.5C",
        "12.5",
        "13C",
        "13",
        "13.5C",
        "13.5",
        "1Y",
        "1",
        "1.5Y",
        "1.5",
        "2Y",
        "2",
        "2.5Y",
        "2.5",
        "3Y",
        "3  ",
      ],
      jovenes: [
        "1",
        "2",
        "3",

        "3.5Y",
        "3.5",
        "4Y",
        "4",
        "4.5Y",
        "4.5",
        "5Y",
        "5",
        "5.5Y",
        "5.5",
        "6Y",
        "6",
        "6.5Y",
        "6.5",
        "7Y",
        "7",
      ],
    },
    PUMA: {
      bebes: ["17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27"],
      ninos: ["28", "29", "30", "31", "32", "33", "34", "35"],
      jovenes: ["36", "37", "38", "39", "40"],
    },
    REEBOK: {
      bebes: [
        "0C",
        "1C",
        "2C",
        "3C",
        "4C",
        "5C",
        "6C",
        "7C",
        "8C",
        "9C",
        "10C",
      ],
      ninos: [
        "10.5C",
        "11C",
        "11.5C",
        "12C",
        "12.5C",
        "13C",
        "13.5C",
        "1Y",
        "1.5Y",
        "2Y",
        "2.5Y",
        "3Y",
      ],
      jovenes: ["3.5Y", "4Y", "4.5Y", "5Y", "5.5Y", "6Y", "6.5Y", "7Y"],
    },
  };

  // 📌 Diccionario de ropa
  const categoriasRopa: Record<
    string,
    { bebes: string[]; ninos: string[]; jovenes: string[] }
  > = {
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
    REEBOK: {
      bebes: ["2XS", "5T", "2T", "3T", "4T"],
      ninos: ["XS", "S", "M"],
      jovenes: ["L", "XL"],
    },
  };

  // 🔹 Normalizador REEBOK
  function normalizarTallaReebok(size: string): string {
    const num = parseFloat(size);
    if (!isNaN(num)) {
      if (size.endsWith("C") || size.endsWith("Y")) return size;
      if (num >= 0 && num <= 10) return size + "C"; // bebés
      if (num >= 1 && num <= 7.5) return size + "Y"; // niños/jóvenes
    }
    return size;
  }

  // 🔹 Normalizador NIKE
  function normalizarTallaNike(size: string): string {
    const num = parseFloat(size);

    if (!isNaN(num)) {
      if (size.endsWith("C") || size.endsWith("Y")) return size;

      // Bebés: 1–10 → sufijo C
      if (Number.isInteger(num) && num >= 1 && num <= 10) return size + "C";

      // Niños pequeños: 10.5–13 → sufijo C
      if (num >= 10.5 && num <= 13) return size + "C";

      // Jóvenes: 1–7 → sufijo Y
      if (num >= 1 && num <= 7) return size + "Y";
    }

    if (size.endsWith("K")) return size.replace("K", "C"); // tallas mal formateadas

    return size;
  }

  // 🔹 Normalizador ADIDAS
  function normalizarTallaAdidas(size: string): string {
    const num = parseFloat(size);

    if (!isNaN(num)) {
      if (size.endsWith("K")) return size;

      // Bebés → 1 a 10 (números enteros)
      if (Number.isInteger(num) && num >= 1 && num <= 10) return size + "K";

      // Niños → 11 a 13.5 → "K"
      if (num >= 11 && num <= 13.5) return size + "K";

      // Jóvenes → 3.5 a 7.5 → sin sufijo
      if (num >= 3.5 && num <= 7.5) return size;
    }

    return size;
  }

  // 🔹 Validar marca
  const brandUpper = brand?.toUpperCase();
  const source =
    tipo === "ropa"
      ? categoriasRopa[brandUpper]
      : categoriasCalzado[brandUpper];
  if (!source) return "Marca no soportada";

  // 🔹 Iterar tallas
  for (const rawSize of sizeArray) {
    let size = rawSize;

    if (brandUpper === "REEBOK" && tipo !== "ropa")
      size = normalizarTallaReebok(rawSize);
    if (brandUpper === "NIKE" && tipo !== "ropa")
      size = normalizarTallaNike(rawSize);
    if (brandUpper === "ADIDAS" && tipo !== "ropa")
      size = normalizarTallaAdidas(rawSize);

    if (source.jovenes.includes(size)) return "joven";
    else if (source.ninos.includes(size)) return "ninonina";
    else if (source.bebes.includes(size)) return "bebe";
  }

  if (tipo === "accesorios") return "ninonina";

  return "Categoría no determinada";
}
