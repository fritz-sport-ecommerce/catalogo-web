// Función auxiliar para convertir array de objetos de tallas
function convertTallasArray(
  sizes: any[],
  gender: string,
  brand: string = "ADIDAS",
  ageGroup?: string,
  tipo?: string
): any[] {
  if (tipo !== "calzado") {
    return sizes; // Si no es calzado, devolver sin cambios
  }

  const converterMap: Record<
    string,
    (size: string, gender: string, ageGroup?: string) => string | null
  > = {
    ADIDAS: convertAdidasUSSizeToEuropean,
    NIKE: convertNikeUSSizeToEuropean,
    PUMA: convertPumaUSSizeToEuropean,
    REEBOK: convertReebokUSSizeToEuro,
    FRITZSPORT: convertFritzSportUSSizeToEuropean,
  };

  const converter =
    converterMap[brand?.toUpperCase()] || convertAdidasUSSizeToEuropean;

  return sizes.map((sizeObj) => {
    const sizeStr = typeof sizeObj.talla === 'string' ? sizeObj.talla : String(sizeObj.talla ?? "");
    const cleanSize = sizeStr.replace(/"/g, "").trim();
    
    const normalizedSize = /^\d+-$/.test(cleanSize)
      ? `${parseInt(cleanSize.slice(0, -1), 10)}.5`
      : cleanSize;
    
    const convertedTalla = converter(normalizedSize, gender, ageGroup);
    
    return {
      ...sizeObj,
      talla: convertedTalla || sizeObj.talla, // Si no se puede convertir, mantener original
    };
  });
}

export default function convertUSSizeToEuropean(
  sizes: string[] | any[],
  gender: string,
  brand: string = "ADIDAS",
  ageGroup?: string,
  tipo?: string
): string | any[] {
  // Si sizes es un array de objetos (con _id, talla, stock), devolver array de objetos
  if (sizes?.length > 0 && typeof sizes[0] === 'object' && sizes[0]?.talla !== undefined) {
    return convertTallasArray(sizes, gender, brand, ageGroup, tipo);
  }
  
  // Si es un array de strings, devolver string
  if (tipo === "calzado" && sizes?.length > 0) {
    const converterMap: Record<
      string,
      (size: string, gender: string, ageGroup?: string) => string | null
    > = {
      ADIDAS: convertAdidasUSSizeToEuropean,
      NIKE: convertNikeUSSizeToEuropean,
      PUMA: convertPumaUSSizeToEuropean,
      REEBOK: convertReebokUSSizeToEuro,
      FRITZSPORT: convertFritzSportUSSizeToEuropean,
    };

    const converter =
      converterMap[brand?.toUpperCase()] || convertAdidasUSSizeToEuropean;

    const convertedSizes = sizes?.map((size) => {
      // Convertir a string si no lo es
      const sizeStr = typeof size === 'string' ? size : String(size ?? "");
      const cleanSize = sizeStr.replace(/"/g, "").trim();
      
      // Normaliza solo tokens numéricos que terminan en '-' (p.ej., '7-' -> '7.5')
      // No altera tokens alfanuméricos como '11K', '1Y', etc.
      const normalizedSize = /^\d+-$/.test(cleanSize)
        ? `${parseInt(cleanSize.slice(0, -1), 10)}.5`
        : cleanSize;
      return converter(normalizedSize, gender, ageGroup);
    });

    return convertedSizes.filter((size) => !!size).join("/ ");
  } else {
    // Si no es calzado, igual limpiamos comillas y retornamos las tallas originales
    return sizes
      ?.map((size) => {
        const sizeStr = typeof size === 'string' ? size : String(size ?? "");
        return sizeStr.replace(/"/g, "");
      })
      .filter((size) => !!size)
      .join("/ ");
  }
}

// Conversión para Adidas (por defecto)
function convertAdidasUSSizeToEuropean(
  size: string,
  gender: string,
  ageGroup?: string
): string | null {
  const group = ageGroup?.toUpperCase() || "ADULT"; // Si no se proporciona, se asume adulto

  switch (group) {
    case "ADULT":
      return convertAdidasAdultUSSizeToEuropean(size, gender);
    // case "KIDS":
    case "NIÑOS":
    case "NINONINA":
      return convertAdidasKidsUSSizeToEuropean(size, gender);

    case "BEBE":
      return convertAdidasInfantUSSizeToEuropean(size, gender);
    // case "JOVEN":
    case "JOVEN":
      return convertAdidasJuniorUSSizeToEuropean(size, gender);
    default:
      return null; // Grupo de edad no soportado
  }
}

// Conversión para Adidas (adultos)
function convertAdidasAdultUSSizeToEuropean(
  size: string,
  gender: string
): string | null {
  switch (gender?.toUpperCase()) {
    case "HOMBRE":
      switch (size) {
        case "4":
          return "36";
        case "4.5":
          return "36.5";
        case "5":
          return "37.5";
        case "5.5":
          return "38";
        case "5.5":
          return "38";
        case "6":
          return "38.5";
        case "6.5":
          return "39.5";
        case "6.5":
          return "39.5";
        case "7":
          return "40";
        case "7.5":
          return "40.5";
        case "8":
          return "41";
        case "8.5":
          return "42";
        case "9":
          return "42.5";
        case "9.5":
          return "43.5";
        case "10":
          return "44";
        case "10.5":
          return "44.5";
  
        case "11":
          return "45.5";
        case "11.5":
          return "46";
        case "12":
          return "46.5";

        default:
          return null;
      }
    case "MUJER":
      switch (size) {
        case "3.5":
          return "35.5";
        case "4":
          return "36";
        case "4.5":
          return "35.5";
        case "5":
          return "36";

        case "5.5":
          return "36.5";
        case "6":
          return "37.5";

        case "6.5":
          return "38";
        case "7":
          return "38.5";

        case "7.5":
          return "39.5";
        case "8":
          return "40";

        case "8.5":
          return "40.5";
        case "9":
          return "41";
        case "9.5":
          return "42";
        case "10":
          return "43";
        case "10.5":
          return "43.5";
        default:
          return null;
      }
    case "UNISEX":
      switch (size) {
        case "4":
          return "36";
        case "4.5":
          return "36.5";

        case "5":
          return "37";
        case "5.5":
          return "38";

        case "6":
          return "38.5";
        case "6.5":
          return "39";
        case "6.5":
          return "39.5";
        case "7":
          return "40";

        case "7.5":
          return "40.5";
        case "8":
          return "41.5";

        case "8.5":
          return "42";
        case "9":
          return "42.5";

        case "9.5":
          return "43.5";
        case "10":
          return "44";

        case "10.5":
          return "44.5";
        case "11":
          return "45.5";
        case "11.5":
          return "46";
        case "12":
          return "46.5";
        case "OSFM":
          return "STD";
        case "OSFW":
          return "STD";
        case "OSFL":
          return "STD";
        case "TU":
          return "STD";
        case "NA":
          return "STD";
        case "STD":
          return "STD";
        case "1":
          return "1";
        case "NS":
          return "NS";
        case "S":
          return "S";
        case "M":
          return "M";
        case "L":
          return "L";
        case "XL":
          return "XL";
        default:
          return null;
      }
    default:
      return null; // Género no soportado
  }
}

// Conversión para Adidas (niños)
function convertAdidasKidsUSSizeToEuropean(
  size: string,
  gender: string
): string | null {
  switch (size) {
    case "10.5K":
      return "28";
    case "11K":
      return "28.5";
    case "11.5K":
      return "29";
    case "12K":
      return "30";
    case "12.5K":
      return "30.5";
    case "13K":
      return "31";
    case "13.5K":
      return "31.5";
    case "1":
      return "32";
    case "1.5":
      return "33";
    case "2":
      return "33.5";
    case "2.5":
      return "34";
    case "3":
      return "35";
    case "3.5":
      return "35.5";
    case "4":
      return "36";

    case "4.5":
      return "36.5";
    case "5":
      return "37";
    case "5.5":
      return "38";
    case "6":
      return "38.5";
    case "6.5":
      return "39";
    case "7":
      return "40";
    case "7.5":
      return "40.5";
    default:
      return null;
  }
}

// Conversión para Adidas (bebés)
function convertAdidasInfantUSSizeToEuropean(
  size: string,
  gender: string
): string | null {
  switch (size) {
    case "1K":
      return "16";
    case "2K":
      return "17";
    case "3K":
      return "18";
    case "4K":
      return "19";
    case "5K":
      return "20";
    case "5.5K":
      return "21";
    case "6K":
      return "22";
    case "6.5K":
      return "23";
    case "7K":
      return "23.5";
    case "7.5K":
      return "24";
    case "8K":
      return "25";
    case "8.5K":
      return "25.5";
    case "9K":
      return "26";
    case "9.5K":
      return "26.5";
    case "10K":
      return "27";

    default:
      return null;
  }
}

// Conversión para Adidas (jóvenes)
function convertAdidasJuniorUSSizeToEuropean(
  size: string,
  gender: string
): string | null {
  switch (size) {
    case "3.5":
      return "35.5";
    case "4":
      return "36";

    case "4.5":
      return "36.5";
    case "5":
      return "37";
    case "5.5":
      return "38";
    case "6":
      return "38.5";
    case "6.5":
      return "39";
    case "7":
      return "40";
    case "7.5":
      return "40.5";

    default:
      return null;
  }
}

// Conversión para Nike
function convertNikeUSSizeToEuropean(
  size: string,
  gender: string,
  ageGroup?: string
): string | null {
  const group = ageGroup?.toUpperCase() || "ADULT";

  switch (group) {
    case "ADULT":
      return convertNikeAdultUSSizeToEuropean(size, gender);

    case "NIÑOS":
    case "NINONINA":
      return convertNikeKidsUSSizeToEuropean(size, gender);
    case "BEBE":
      return convertNikeInfantUSSizeToEuropean(size, gender);

    case "JOVEN":
      return convertNikeJuniorUSSizeToEuropean(size, gender);
    default:
      return null;
  }
}

function convertNikeAdultUSSizeToEuropean(
  size: string,
  gender: string
): string | null {
  // Tabla de conversión de Nike (adultos)
  switch (gender?.toUpperCase()) {
    case "HOMBRE":
      switch (size) {
        case "7":
          return "40";
        case "7.5":
          return "40.5";
        case "8":
          return "41";
        case "8.5":
          return "42";
        case "9":
          return "42.5";
        case "9.5":
          return "43";
        case "10":
          return "44";
        case "10.5":
          return "44.5";
        case "11":
          return "45";
        case "12":
          return "46";

        default:
          return null;
      }
    case "MUJER":
      switch (size) {
        case "5.5":
          return "36";
        case "6":
          return "36.5";
        case "6.5":
          return "37.5";
        case "7":
          return "38";
        case "7.5":
          return "38.5";
        case "8":
          return "39";
        case "8.5":
          return "40";

        default:
          return null;
      }
    case "UNISEX":
      switch (size) {
        case "5.5":
          return "36";
        case "6":
          return "36.5";
        case "6.5":
          return "37.5";
        case "7":
          return "40";
        case "7.5":
          return "40.5";
        case "8":
          return "41";
        case "8.5":
          return "9";
        case "9.5":
          return "43";
        case "10":
          return "44";
        case "10.5":
          return "44.5";
        case "11":
          return "45";
        case "12":
          return "46";

        default:
          return null;
      }
    default:
      return null; // Género no soportado
  }
  // if (gender) {
  //   switch (gender?.toUpperCase()) {
  //     case "5":
  //       return "38";
  //     case "5.5":
  //       return "38.5";
  //     case "6":
  //       return "39";
  //     case "6.5":
  //       return "40";
  //     case "7":
  //       return "40.5";
  //     case "7.5":
  //       return "41";
  //     case "8":
  //       return "42";
  //     case "8.5":
  //       return "42.5";
  //     case "9":
  //       return "43";
  //     case "9.5":
  //       return "44";
  //     case "10":
  //       return "44.5";
  //     case "10.5":
  //       return "45";
  //     case "11":
  //       return "45.5";
  //     case "11.5":
  //       return "46";
  //     case "12":
  //       return "46.5";
  //     default:
  //       return null;
  //   }
  // } else {
  //   return null;
  // }
}

// Conversión para Nike (niños)
function convertNikeKidsUSSizeToEuropean(
  size: string,
  gender: string
): string | null {
  if (gender === "niños") {
    switch (size) {
      case "9C":
        return "25";
      case "10C":
        return "26";
      case "10.5C":
        return "27.5";
      case "11C":
        return "28";
      case "11.5C":
        return "28.5";
      case "12C":
        return "29.5";
      case "13C":
        return "31";
      case "1Y":
        return "32";
      case "2Y":
        return "33.5";
      case "3Y":
        return "35";
      case "4Y":
        return "36";
      case "4.5Y":
        return "36.5";
      case "5Y":
        return "37.5";
      case "5.5Y":
        return "38";
      case "6Y":
        return "38.5";
      case "6.5Y":
        return "39";
      case "7Y":
        return "40";

      default:
        return null;
    }
  } else {
    return null;
  }
}

// Conversión para Nike (bebés)
function convertNikeInfantUSSizeToEuropean(
  size: string,
  gender: string
): string | null {
  if (gender === "niños") {
    switch (size) {
      case "5C":
        return "21";
      case "5":
        return "21";
      case "6C":
        return "22";
      case "6":
        return "22";
      case "7C":
        return "23.5";
      case "7":
        return "23.5";
      case "8C":
        return "25";
      case "8":
        return "25";

      case "9C":
        return "26";
      case "9":
        return "26";
      case "10C":
        return "27";
      case "10":
        return "27";

      default:
        return null;
    }
  } else {
    return null;
  }
}

// Conversión para Nike (jóvenes)
function convertNikeJuniorUSSizeToEuropean(
  size: string,
  gender: string
): string | null {
  switch (size) {
    case "10C":
      return "27";
    case "10":
      return "27";
    case "10.5C":
      return "27.5";
    case "10.5":
      return "27.5";
    case "11C":
      return "28";
    case "11":
      return "28";
    case "11.5C":
      return "28.5";
    case "11.5":
      return "28.5";
    case "12C":
      return "29.5";
    case "12":
      return "29.5";
    case "13C":
      return "31";
    case "1Y":
      return "32";
    case "1":
      return "32";
    case "2Y":
      return "33.5";
    case "2":
      return "33.5";
    case "3Y":
      return "35";
    case "3":
      return "35";
    case "3.5Y":
      return "35.5";
    case "3.5":
      return "35.5";
    case "4Y":
      return "36";
    case "4.5Y":
      return "36.5";
    case "5Y":
      return "37.5";
    case "5":
      return "37.5";
    case "5.5Y":
      return "38";
    case "5.5":
      return "38";
    case "6Y":
      return "38.5";
    case "6":
      return "38.5";
    case "6.5Y":
      return "39";
    case "6.5":
      return "39";
    case "7Y":
      return "40";
    case "7":
      return "40";
    default:
      return null;
  }
}

// Conversión para Puma
function convertPumaUSSizeToEuropean(
  size: string,
  gender: string,
  ageGroup?: string
): string | null {
  const group = ageGroup?.toUpperCase() || "ADULT";

  switch (group) {
    case "ADULT":
      return convertPumaAdultUSSizeToEuropean(size, gender);

    case "NIÑOS":
    case "NINONINA":
      return convertPumaKidsUSSizeToEuropean(size, gender);

    case "BEBE":
      return convertPumaInfantUSSizeToEuropean(size, gender);
    case "JUNIOR":
    case "JOVEN":
      return convertPumaJuniorUSSizeToEuropean(size, gender);
    default:
      return null;
  }
}
function convertFritzSportUSSizeToEuropean(
  size: string,
  gender: string,
  ageGroup?: string
): string | null {
  const group = ageGroup?.toUpperCase() || "ADULT";

  return convertFritzSportSizeUSSizeToEuropean(size, gender);
}
function convertFritzSportSizeUSSizeToEuropean(
  size: string,
  gender: string
): string | null {
  // Tabla de conversión de Puma (adultos)
  switch (size) {
    case "7":
      return "40";
    case "8":
      return "41";
    case "8.5":
      return "42";
    case "9":
      return "42";
    case "9.5":
      return "43";
    case "10":
      return "44";

    default:
      return null;
  }
}
// traer cambioos
function convertPumaAdultUSSizeToEuropean(
  size: string,
  gender: string
): string | null {
  // Tabla de conversión de Puma (adultos)
  switch (size) {
    case "5":
      return "38";
    case "5.5":
      return "38.5";
    case "6":
      return "39";
    case "6.5":
      return "40";
    case "7":
      return "40.5";
    case "7.5":
      return "41";
    case "8":
      return "42";
    case "8.5":
      return "42.5";
    case "9":
      return "43";
    case "9.5":
      return "44";
    case "10":
      return "44.5";
    case "10.5":
      return "45";
    case "11":
      return "45.5";
    case "11.5":
      return "46";
    case "12":
      return "46.5";
    default:
      return null;
  }
}

// Conversión para Puma (niños)
function convertPumaKidsUSSizeToEuropean(
  size: string,
  gender: string
): string | null {
  switch (size) {
    case "4.5Y":
      return "36.5";
    case "6K":
      return "38.5";
    case "12C":
      return "29.5";
    case "4T":
      return "36";
    case "SM":
      return "STD"; // Talla estándar para niños
    default:
      return null;
  }
}

// Conversión para Puma (bebés)
function convertPumaInfantUSSizeToEuropean(
  size: string,
  gender: string
): string | null {
  switch (size) {
    case "4C":
      return "19.5";
    case "5C":
      return "21";
    case "6C":
      return "22";
    case "7C":
      return "23.5";
    case "8C":
      return "25";
    case "9C":
      return "26";
    case "10C":
      return "27";
    default:
      return null;
  }
}

// Conversión para Puma (jóvenes)
function convertPumaJuniorUSSizeToEuropean(
  size: string,
  gender: string
): string | null {
  switch (size) {
    case "1":
      return "32";
    case "2":
      return "33.5";
    case "3":
      return "35";
    case "4":
      return "36";
    case "5":
      return "37.5";
    default:
      return null;
  }
}

// Conversión para Reebok
function convertReebokUSSizeToEuro(
  size: string,
  gender: string,
  ageGroup?: string
): string | null {
  const group = ageGroup?.toUpperCase() || "ADULT";

  switch (group) {
    case "ADULT":
      return convertReebokAdultUSSizeToEuropean(size, gender);

    case "NIÑOS":
    case "NINONINA":
      return convertReebokKidsUSSizeToEuropean(size, gender);

    case "BEBE":
      return convertReebokInfantUSSizeToEuropean(size, gender);

    case "JOVEN":
      return convertReebokJuniorUSSizeToEuropean(size, gender);

    default:
      return null;
  }
}

// Conversión Reebok adultos
function convertReebokAdultUSSizeToEuropean(
  size: string,
  gender: string
): string | null {
  const s = size?.toString().trim();
  const g = (gender || "").toUpperCase();

  if (!s) return null;

  if (g === "HOMBRE" || g === "UNISEX") {
    switch (s) {
      case "2":
        return "32";
      case "2.5":
        return "32.5";
      case "3":
        return "33";
      case "3.5":
        return "34";
      case "4":
        return "34.5";
      case "4.5":
        return "35";
      case "5":
        return "36";
      case "5.5":
        return "36.5";
      case "6":
        return "37.5";
      case "6.5":
        return "38.5";
      case "7":
        return "39";
      case "7.5":
        return "40";
      case "8":
        return "40.5";
      case "8.5":
        return "41";
      case "9":
        return "42";
      case "9.5":
        return "42.5";
      case "10":
        return "43"; // ← corrección aplicada
      case "10.5":
        return "44";
      case "11":
        return "44.5";
      case "11.5":
        return "45";
      case "12":
        return "45.5";
      case "12.5":
        return "46";
      case "13":
        return "47";
      case "13.5":
        return "48";
      case "14":
        return "48.5";
      case "14.5":
        return "49";
      case "15":
        return "50";
      case "15.5":
        return "51";
      case "16":
        return "52";
      case "16.5":
        return "53";
      case "17":
        return "53.5";
      case "17.5":
        return "54";
      case "18":
        return "55";
      case "18.5":
        return "56";
      default:
        return null;
    }
  }

  if (g === "MUJER") {
    switch (s) {
      case "3.5":
        return "33";
      case "4":
        return "34";
      case "4.5":
        return "34.5";
      case "5":
        return "35";
      case "5.5":
        return "35.5";
      case "6":
        return "36";
      case "6.5":
        return "37";
      case "7":
        return "37.5";
      case "7.5":
        return "38";
      case "8":
        return "38.5";
      case "8.5":
        return "39";
      case "9":
        return "40";
      case "9.5":
        return "40.5";
      case "10":
        return "41";
      case "10.5":
        return "42";
      case "11":
        return "42.5";
      case "11.5":
        return "43";
      case "12":
        return "44";
      case "12.5":
        return "44.5";
      case "13":
        return "45";
      case "13.5":
        return "46";
      case "14":
        return "47";
      case "14.5":
        return "48";
      case "15":
        return "48.5";
      default:
        return null;
    }
  }

  return null;
}

// Conversión Reebok bebés
function convertReebokInfantUSSizeToEuropean(
  size: string,
  gender: string
): string | null {
  switch (size) {
    case "1K":
    case "1":
      return "16";
    case "2K":
    case "2":
      return "17";
    case "3K":
    case "3":
      return "18";
    case "4K":
      return "19.5";
    case "5K":
      return "20";
    case "5.5K":
      return "21.5";
    case "6K":
      return "22";
    case "6.5K":
      return "22.5";
    case "7K":
      return "23.5";
    case "7.5K":
      return "24";
    case "8K":
      return "25";
    case "8.5K":
      return "25";
    case "9K":
      return "25.5";
    case "9.5K":
      return "26";
    case "10K":
      return "26.5";
    default:
      return null;
  }
}

// Conversión Reebok niños
function convertReebokKidsUSSizeToEuropean(
  size: string,
  gender: string
): string | null {
  switch (size) {
    case "10.5K":
    case "10.5":
      return "27";
    case "11K":
    case "11":
      return "27.5";
    case "11.5K":
    case "11.5":
      return "28";
    case "12K":
    case "12":
      return "29";
    case "12.5K":
    case "12.5":
      return "30";
    case "13K":
    case "13":
      return "30.5";
    case "13.5K":
    case "13.5":
      return "31";
    case "1":
    case "1Y":
      return "31.5";
    case "1.5":
    case "1.5Y":
      return "32";
    case "2":
    case "2Y":
      return "32.5";
    case "2.5":
    case "2.5Y":
      return "33";
    case "3":
    case "3Y":
      return "34";
    default:
      return null;
  }
}

// Conversión Reebok jóvenes
function convertReebokJuniorUSSizeToEuropean(
  size: string,
  gender: string
): string | null {
  switch (size) {
    case "3.5":
    case "3.5Y":
      return "34.5";
    case "4":
    case "4Y":
      return "35";
    case "4.5":
    case "4.5Y":
      return "36";
    case "5":
    case "5Y":
      return "36.5";
    case "5.5":
    case "5.5Y":
      return "37";
    case "6":
    case "6Y":
      return "38";
    case "6.5":
    case "6.5Y":
      return "38.5";
    case "7":
    case "7Y":
      return "39";
    default:
      return null;
  }
}

// // Ejemplo de uso:
// const usSizes = [
//     '4.5Y', '6K',
//     '12C', '4T',
//     'SM'
// ];
// const gender = 'MALE';
// const brand = 'ADIDAS'; // Cambia la marca aquí
// const ageGroup = 'KIDS'; // Opcional: 'KIDS', 'BEBE', 'JUNIOR', etc.

// const europeanSizes = convertUSSizeToEuropean(usSizes, gender, brand, ageGroup);
// console.log(`Tallas Europeas: ${europeanSizes.join(', ')}`);
