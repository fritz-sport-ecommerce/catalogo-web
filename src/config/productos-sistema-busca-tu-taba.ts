import determinarRazonSocial from "@/utils/calcular-razon-social";
import convertUSSizeToEuropean from "@/utils/convertir-talla-usa-eu";
import determinarSubgeneroPorTalla from "@/utils/determinar-subgenero-ninos";

// Función para adaptar productos de la API al formato esperado
function adaptarProductoDeAPI(productoAPI: any): any {
  return {
    ...productoAPI,
    // ✅ PRECIOS DE LA API - Estos vienen de fetchProductosPrecios
    priceecommerce:
      productoAPI.precio_retail || productoAPI.priceecommerce || 0,
    priceemprendedor:
      productoAPI.precio_emprendedor || productoAPI.priceemprendedor || 0,
    pricemayorista:
      productoAPI.precio_mayorista || productoAPI.pricemayorista || 0,

    mayorista_cd: productoAPI.mayorista_cd || productoAPI.mayorista_cd || 0,

    // ✅ STOCK DE LA API
    stock: productoAPI.stockDisponible || productoAPI.stock || 0,

    // ✅ TALLAS DE LA API - Estas vienen como string separado por comas
    tallascatalogo:
      productoAPI.tallascatalogo ||
      (Array.isArray(productoAPI.tallas_catalogo)
        ? productoAPI.tallas_catalogo.join(",")
        : ""),

    // Campos por defecto si no existen (estos pueden venir de Sanity)
    activo: productoAPI.activo !== undefined ? productoAPI.activo : true,
    genero: productoAPI.genero || "unisex",
    marca: productoAPI.marca || "", // ⚠️ Este campo debe venir de Sanity
    tipo: productoAPI.tipo || "",
    ninos_talla_grande: productoAPI.ninos_talla_grande || false,
    fecha_cuando_aparece: productoAPI.fecha_cuando_aparece || null,
    _createdAt: productoAPI._createdAt || new Date().toISOString(),
  };
}
function filtrarTallas(
  tallasStr: string,
  tallaMaxima: number = 38.5
): string | null {
  /**
   * Filtra tallas mayores a un valor máximo en un string separado por '/'.
   *
   * @param tallasStr - String con tallas separadas por '/' (ej: "35.5/ 36/ 39").
   * @param tallaMaxima - Valor máximo a incluir (por defecto 38.5).
   * @returns String con tallas filtradas unidas por '/ ' o `null` si el input es inválido.
   */
  if (typeof tallasStr !== "string") {
    return null;
  }

  try {
    const tallasFiltradas = tallasStr
      .split("/")
      .map((talla) => talla.trim())
      .filter((talla) => {
        const tallaNum = parseFloat(talla);
        return !isNaN(tallaNum) && tallaNum <= tallaMaxima;
      });

    return tallasFiltradas.join("/ ");
  } catch (error) {
    return null; // En caso de error inesperado
  }
}
// Función para obtener el stock total en Lima (mantenida para compatibilidad)
function obtenerStockEnLima(
  provincias: any[] = [],
  provincia: string = "LIMA"
): number {
  return provincias
    .filter(
      (p) => p?.provincia?.toLocaleUpperCase() === provincia.toLocaleUpperCase()
    )
    .reduce((total, p) => total + (p.stock ?? 0), 0);
}
function esFechaValida(fecha: string | null): boolean {
  if (!fecha) return true; // null -> true

  const fechaIngresada = new Date(fecha);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0); // Normaliza la hora a medianoche

  return fechaIngresada <= hoy;
}

export default function productosTraidosSistemaFritzSport(
  productos: any[] = [],
  tipoproducto: string | undefined,
  provincia: string | undefined,
  razonsocial: string | undefined,
  ninos_talla_grande: string | undefined
) {
  if (!Array.isArray(productos) || productos.length === 0) {
    return [];
  }

  // Adaptar productos de la API al formato esperado
  const productosAdaptados = productos.map(adaptarProductoDeAPI);

  // Generar nuevo array procesado
  const productosConPrecio = productosAdaptados
    .map((producto) => {
      // Si es de niños y ninos_talla_grande, devolver dos versiones: mujer y niños
      if (producto.genero === "niños" && producto.ninos_talla_grande === true) {
        // Versión mujer
        const comoMujer = {
          ...producto,
          razonsocial: determinarRazonSocial(
            producto?.priceecommerce,
            producto?.mayorista_cd,
            producto?.marca
          ),
          genero: "mujer",
          subgenero_ninos: undefined,
          tipoproducto: producto?.stock > 6 ? "catalogo" : "web",
          stock: producto?.stock ?? 0,
          talla_sistema: (() => {
            if (
              !producto?.tallascatalogo ||
              typeof producto.tallascatalogo !== "string"
            ) {
              return "";
            }

            try {
              // Eliminar duplicados
              const tallasUnicas = Array.from(
                new Set(
                  producto.tallascatalogo
                    .split(",")
                    .map((t: string) => {
                      const s = t.trim();
                      return /^\d+-$/.test(s)
                        ? `${parseInt(s.slice(0, -1), 10)}.5`
                        : s;
                    })
                    .filter(Boolean)
                )
              ) as string[];

              return tallasUnicas.join(", ");
            } catch (error) {
              console.error(
                `Error processing talla_sistema for ninos_talla_grande product ${producto?.sku}:`,
                error
              );
              return "";
            }
          })(),
          tallascatalogo: (() => {
            if (
              !producto?.tallascatalogo ||
              typeof producto.tallascatalogo !== "string"
            ) {
              return "";
            }

            try {
              const tallasArray = producto.tallascatalogo
                .split(",")
                .map((t: string) => t.trim())
                .filter(Boolean);

              if (tallasArray.length === 0) {
                return "";
              }

              // Eliminar duplicados usando Set
              const tallasUnicas = Array.from(new Set(tallasArray)) as string[];

              const converted = convertUSSizeToEuropean(
                tallasUnicas,
                producto?.genero,
                producto?.marca,
                determinarSubgeneroPorTalla(
                  producto?.tallascatalogo,
                  producto?.marca,
                  producto?.tipo
                ),
                producto?.tipo
              );
              
              return (
                filtrarTallas(
                  typeof converted === 'string' ? converted : tallasUnicas.join("/ ")
                ) || ""
              );
            } catch (error) {
              console.error(
                `Error processing tallascatalogo for ninos_talla_grande product ${producto?.sku}:`,
                error
              );
              return "";
            }
          })(),
        };
        // Versión niños (original)
        // const comoNino = {
        //   ...producto,
        //   razonsocial: determinarRazonSocial(
        //     precio?.precio_retail,
        //     precio?.precio_mayorista,
        //     producto?.marca
        //   ),
        //   genero: "niños",
        //   tipoproducto: producto?.stock > 6 ? "catalogo" : "web",
        //   stock: producto?.stock ?? 0,
        //   talla_sistema: producto?.tallascatalogo?.filter(Boolean).join(", ") || "",
        //   tallascatalogo: producto?.tallascatalogo
        //     ? filtrarTallas(
        //         convertUSSizeToEuropean(
        //           producto?.tallascatalogo,
        //           producto?.genero,
        //           producto?.marca,
        //           determinarSubgeneroPorTalla(
        //             producto?.tallascatalogo,
        //             producto?.marca,
        //             producto?.tipo
        //           ),
        //           producto?.tipo
        //         )
        //       )
        //     : "",
        //   tallas: precio?.tallas || [],
        //   priceecommerce: precio?.precio_retail ?? null,
        //   priceemprendedor: precio?.precio_emprendedor ?? null,
        //   mayorista_cd: precio?.precio_mayorista ?? null,
        //   provincias: precio?.provincias || [],
        // };
        return [comoMujer];
      }

      // Caso normal
      return {
        ...producto,
        razonsocial: determinarRazonSocial(
          producto?.priceecommerce,
          producto?.mayorista_cd,
          producto?.marca
        ),
        genero: ninos_talla_grande ? "mujer" : producto.genero,
        subgenero_ninos:
          producto.genero === "niños" && !ninos_talla_grande
            ? determinarSubgeneroPorTalla(
                producto?.tallascatalogo,
                producto?.marca,
                producto?.tipo
              )
            : undefined,
        tipoproducto: producto?.stock > 6 ? "catalogo" : "web",
        stock: producto?.stock ?? 0,
        ninos_talla_grande: producto.ninos_talla_grande,
        fecha_cuando_aparece: esFechaValida(producto?.fecha_cuando_aparece),
        talla_sistema: (() => {
          if (
            !producto?.tallascatalogo ||
            typeof producto.tallascatalogo !== "string"
          ) {
            return "";
          }

          try {
            // Eliminar duplicados y ordenar
            const tallasUnicas = Array.from(
              new Set(
                producto.tallascatalogo
                  .split(",")
                  .map((t: string) => {
                    const s = t.trim();
                    return /^\d+-$/.test(s)
                      ? `${parseInt(s.slice(0, -1), 10)}.5`
                      : s;
                  })
                  .filter(Boolean)
              )
            ) as string[];

            return tallasUnicas
              .sort((a: string, b: string) => {
                const numA = parseFloat(a);
                const numB = parseFloat(b);
                return numA - numB;
              })
              .join(", ");
          } catch (error) {
            console.error(
              `Error processing talla_sistema for product ${producto?.sku}:`,
              error
            );
            return "";
          }
        })(),

        tallascatalogo: (() => {
          // Safely process tallascatalogo to avoid RangeError
          if (
            !producto?.tallascatalogo ||
            typeof producto.tallascatalogo !== "string"
          ) {
            return "";
          }

          try {
            const tallasArray = producto.tallascatalogo
              .split(",")
              .map((t: string) => t.trim())
              .filter(Boolean);

            if (tallasArray.length === 0) {
              return "";
            }
            // Eliminar duplicados y ordenar
            const tallasUnicas = (
              Array.from(new Set(tallasArray)) as string[]
            ).sort((a: string, b: string) => parseFloat(a) - parseFloat(b));

            if (ninos_talla_grande) {
              const converted = convertUSSizeToEuropean(
                tallasUnicas,
                producto?.genero,
                producto?.marca,
                producto.genero === "niños"
                  ? determinarSubgeneroPorTalla(
                      producto?.tallascatalogo,
                      producto?.marca,
                      producto?.tipo
                    )
                  : undefined,
                producto?.tipo
              );
              
              return (
                filtrarTallas(
                  typeof converted === 'string' ? converted : tallasUnicas.join("/ ")
                ) || ""
              );
            } else {
              const converted = convertUSSizeToEuropean(
                tallasUnicas,
                producto?.genero,
                producto?.marca,
                producto.genero === "niños"
                  ? determinarSubgeneroPorTalla(
                      producto?.tallascatalogo,
                      producto?.marca,
                      producto?.tipo
                    )
                  : undefined,
                producto?.tipo
              );
              
              return typeof converted === 'string' ? converted : tallasUnicas.join("/ ");
            }
          } catch (error) {
            console.error(
              `Error processing tallascatalogo for product ${producto?.sku}:`,
              error
            );
            return "";
          }
        })(),
      };
    })
    // Aplanar el array en caso de que haya productos duplicados (mujer y niños)
    .flat();
  // console.log(productosConPrecio);

  // traer cambioss
  const productosOrdenadosConPrecio = productosConPrecio
    .sort(
      (a, b) =>
        new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime()
    )
    .filter(
      (el) =>
        el.subgenero_ninos !== "Categoría no determinada" &&
        // obtenerStockEnLima(el.provincias, provincia) > 10 &&
        el.talla_sistema !== "" &&
        // el.stock > 0 &&
        el.tallascatalogo !== "" &&
        el.activo === true
    )

    .filter(
      (el) =>
        el.subgenero_ninos !== "Categoría no determinada" &&
        // obtenerStockEnLima(el.provincias, provincia) > 10 &&
        el.activo === true
    )
    .filter(
      (el) =>
        el.mayorista_cd !== undefined &&
        el.priceemprendedor !== undefined &&
        el.priceecommerce !== undefined &&
        el.mayorista_cd !== null &&
        el.priceemprendedor !== null
    )
    .filter(
      (el) =>
        el.mayorista_cd > 0 && el.priceemprendedor > 0 && el.priceecommerce > 0
    );
  // console.log(productosOrdenadosConPrecio);
  // traer cambios2
  return razonsocial
    ? productosOrdenadosConPrecio.filter(
        (el) =>
          el.razonsocial === razonsocial && el.tipoproducto === tipoproducto
      )
    : tipoproducto
    ? productosOrdenadosConPrecio.filter(
        (el) => el.tipoproducto === tipoproducto
      )
    : productosOrdenadosConPrecio;
}
