export default function convertUSSizeToEuropean(
  sizes: string[],
  gender: string,
  brand: string = "ADIDAS",
  ageGroup?: string,
  tipo?: string
): string {
  if (tipo === "calzado" && sizes?.length > 0) {
    const convertedSizes = sizes.map((size) => {
      switch (brand?.toUpperCase()) {
        case "ADIDAS":
          return convertAdidasUSSizeToEuropean(size, gender, ageGroup);
        case "NIKE":
          return convertNikeUSSizeToEuropean(size, gender, ageGroup);
        case "PUMA":
          return convertPumaUSSizeToEuropean(size, gender, ageGroup);
        default:
          return convertAdidasUSSizeToEuropean(size, gender, ageGroup);
      }
    });

    return convertedSizes.filter((size) => size !== null).join("/ ");
  } else {
    return sizes?.filter((size) => size !== null).join("/ ");
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
          return "45";
        case "11.5":
          return "45.5";
        case "12":
          return "46";
        case "12.5":
          return "46.5";

        case "13":
          return "47";
        case "13.5":
          return "47.5";

        case "14":
          return "48";
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
          return "45";
        case "11.5":
          return "45.5";
        case "12":
          return "46";
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
  if (gender === "niños") {
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
  } else {
    return null;
  }
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
      case "6C":
        return "22";
      case "7C":
        return "23.5";
      case "8C":
        return "25";
      case "9C":
        return "26";

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
