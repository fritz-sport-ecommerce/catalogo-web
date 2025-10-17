// type Producto = {
//   codigoAlmacen: string;
//   codigoArticulo: string;
//   nombreArticulo: string;
//   stockDisponible: number;
//   marca: string;
//   grupo: string;
//   talla: string;
//   precio1: number;
//   precio2: number;
//   precio3: number;
//   precio6: number;
// };

import { obtenerProvinciaProducto } from "./obtener-provincia-producto";

// type Talla = {
//   _id: string;
//   talla: string;
//   stock: number;
//   precio_retail: number;
//   precio_tienda: number;
//   precio_emprendedor: number;
//   precio_mayorista: number;
// };

// type ProductoOrdenado = {
//   codigoAlmacen: string;
//   codigoArticulo: string;
//   nombreArticulo: string;
//   stockDisponible: number;
//   marca: string;
//   sku: string;
//   precio_retail: number | null;
//   precio_tienda: number | null;
//   precio_emprendedor: number | null;
//   precio_mayorista: number | null;
//   tallas_catalogo: any;
//   tallas: Talla[];
// };
// export default function procesarProductos(
//   data: Producto[]
// ): ProductoOrdenado[] {
//   const groupedProducts: Record<string, ProductoOrdenado> = {};

//   data.forEach(
//     ({
//       codigoAlmacen,
//       codigoArticulo,
//       nombreArticulo,
//       stockDisponible,
//       marca,
//       grupo,
//       talla,
//       precio1,
//       precio2,
//       precio3,
//       precio6,
//     }) => {
//       if (!groupedProducts[grupo]) {
//         groupedProducts[grupo] = {
//           codigoAlmacen,
//           codigoArticulo,
//           nombreArticulo,
//           stockDisponible: 0,
//           marca,
//           sku: grupo,
//           precio_retail: validarPrecio(precio1),
//           precio_tienda: validarPrecio(precio2),
//           precio_emprendedor: validarPrecio(precio3),
//           precio_mayorista: validarPrecio(precio6),
//           tallas_catalogo: new Set<string>(),
//           tallas: [],
//         };
//       }

//       let tallaPeruana: string = convertirTallaPeruana(talla);
//       groupedProducts[grupo].tallas_catalogo.add(tallaPeruana);
//       groupedProducts[grupo].stockDisponible += stockDisponible;
//       groupedProducts[grupo].precio_retail =
//         Math.min(
//           groupedProducts[grupo].precio_retail ?? 0,
//           validarPrecio(precio1) ?? 0
//         ) || null;
//       groupedProducts[grupo].precio_tienda =
//         Math.min(
//           groupedProducts[grupo].precio_tienda ?? 0,
//           validarPrecio(precio2) ?? 0
//         ) || null;
//       groupedProducts[grupo].precio_emprendedor =
//         Math.min(
//           groupedProducts[grupo].precio_emprendedor ?? 0,
//           validarPrecio(precio3) ?? 0
//         ) || null;
//       groupedProducts[grupo].precio_mayorista =
//         Math.min(
//           groupedProducts[grupo].precio_mayorista ?? 0,
//           validarPrecio(precio6) ?? 0
//         ) || null;

//       const existingTalla: Talla | undefined = groupedProducts[
//         grupo
//       ].tallas.find((t: Talla) => t.talla === talla);

//       if (existingTalla) {
//         existingTalla.stock += stockDisponible;
//         existingTalla.precio_retail =
//           Math.min(
//             existingTalla.precio_retail ?? 0,
//             validarPrecio(precio1) ?? 0
//           ) || null;
//         existingTalla.precio_tienda =
//           Math.min(
//             existingTalla.precio_tienda ?? 0,
//             validarPrecio(precio2) ?? 0
//           ) || null;
//         existingTalla.precio_emprendedor =
//           Math.min(
//             existingTalla.precio_emprendedor ?? 0,
//             validarPrecio(precio3) ?? 0
//           ) || null;
//         existingTalla.precio_mayorista =
//           Math.min(
//             existingTalla.precio_mayorista ?? 0,
//             validarPrecio(precio6) ?? 0
//           ) || null;
//       } else {
//         groupedProducts[grupo].tallas.push({
//           _id: codigoArticulo,
//           talla,
//           stock: stockDisponible,
//           precio_retail: validarPrecio(precio1) ,
//           precio_tienda: validarPrecio(precio2),
//           precio_emprendedor: validarPrecio(precio3),
//           precio_mayorista: validarPrecio(precio6),
//         });
//       }
//     }
//   );

//   return Object.values(groupedProducts).map((product: ProductoOrdenado) => ({
//     ...product,
//     tallas_catalogo: Array.from(product.tallas_catalogo).sort(),
//   }));
// }

// function validarPrecio(precio: number): number | null {
//   return precio % 1 === 0 ? precio : null;
// }

// function convertirTallaPeruana(talla: string): string {
//   return talla.includes("-") ? (parseFloat(talla) + 0.5).toString() : talla;
// }

// funcion anterior

type Producto = {
  almacenTabla: string;
  codigoAlmacen: string;
  codigoArticulo: string;
  nombreArticulo: string;
  stockDisponible: number;
  marca: string;
  grupo: string;
  talla: string;
  precio1: number;
  precio2: number;
  precio3: number;
  precio6: number;
  // Nuevos campos de la API
  precioRetail?: number;
  precioEmprendedor?: number;
  precioMayorista?: number;
  precioMayoristaCD?: number;
  stocks?: any[];
  precios?: any[];
};

type Talla = {
  _id: string;
  talla: string;
  stock: number;
  precio_retail: number;
  precio_tienda: number;
  precio_emprendedor: number;
  precio_mayorista: number;
};
interface Almacen {
  almacen: string;
  stock: number;
}
interface ProvinciaStock {
  provincia: string;
  stock: number;
}
type AlmacenDetalle = {
  codigo: string;
  nombre: string;
  stock: number;
};
type ProductoOrdenado = {
  almacenTabla: string;
  codigoAlmacen: string;
  codigoArticulo: string;
  nombreArticulo: string;
  stockDisponible: number;
  marca: string;
  sku: string;
  precio_retail: number;
  precio_tienda: number;
  precio_emprendedor: number;
  precio_mayorista: number;
  mayorista_cd?: number; // Nuevo precio MAYORISTA_CD
  tallas_catalogo: any;
  tallas: Talla[];
  almacenes: Almacen[];
  provincias: ProvinciaStock[];
  precios_diferentes: boolean;
  almacenes_detalle: AlmacenDetalle[];
  // Información adicional de la nueva API
  tallascatalogo?: string; // Tallas como string separado por comas
  priceecommerce?: number; // Precio retail para ecommerce
  priceemprendedor?: number; // Precio emprendedor
};
function convertirTallaPeruana(talla: string): string {
  // Si es del tipo "1-" o "2-" (solo números con guion al final), convierte a .5
  if (/^\d+-$/.test(talla)) {
    return talla.slice(0, -1) + ".5";
  }
  // Si es estrictamente numérica o numérica con .0/.5, mantener tal cual
  if (/^\d+(?:\.0|\.5)?$/.test(talla)) {
    return talla;
  }
  // En otros casos (ej. "13-K", "10-K"), preservar la talla original
  return talla;
}
function obtenerPrecioMasFrecuente(precios: number[]): number {
  const conteo = new Map<number, number>();

  precios.forEach((precio) => {
    conteo.set(precio, (conteo.get(precio) || 0) + 1);
  });

  let maxFrecuencia = 0;
  let precioMasFrecuente = precios[0];

  conteo.forEach((frecuencia, precio) => {
    if (frecuencia > maxFrecuencia) {
      maxFrecuencia = frecuencia;
      precioMasFrecuente = precio;
    }
  });

  // Si el precio más frecuente es 0, devolver el mayor valor solo si 0 tiene la mayor frecuencia
  if (precioMasFrecuente === 0 && maxFrecuencia > 1) {
    return Math.max(...precios);
  }

  return precioMasFrecuente;
}

export default function (data: Producto[]): ProductoOrdenado[] {
  const groupedProducts: Record<string, ProductoOrdenado> = {};

  data.forEach(
    ({
      almacenTabla,
      codigoAlmacen,
      codigoArticulo,
      nombreArticulo,
      stockDisponible,
      marca,
      grupo,
      talla,
      precio1,
      precio2,
      precio3,
      precio6,
      precioRetail,
      precioEmprendedor,
      precioMayorista,
      precioMayoristaCD,
      stocks,
      precios,
    }) => {
      if (!groupedProducts[grupo]) {
        // Usar los precios de la nueva API si están disponibles
        const retail = precioRetail || precio1;
        const emprendedor = precioEmprendedor || precio3;
        const mayorista = precioMayorista || precio6;
        const mayoristaCD = precioMayoristaCD || precio6;

        groupedProducts[grupo] = {
          almacenTabla,
          codigoAlmacen,
          codigoArticulo,
          nombreArticulo,
          stockDisponible: 0,
          marca,
          sku: grupo,
          precio_retail: retail,
          precio_tienda: precio2,
          precio_emprendedor: emprendedor,
          precio_mayorista: mayorista,
          mayorista_cd: mayoristaCD,
          priceecommerce: retail,
          priceemprendedor: emprendedor,
          tallas_catalogo: new Set<string>(),
          tallas: [],
          almacenes: [],
          provincias: [],
          precios_diferentes: false,
          almacenes_detalle: [],
        };
      }

      let tallaPeruana = convertirTallaPeruana(talla);

      const existingTalla = groupedProducts[grupo].tallas.find(
        (t) => t.talla === tallaPeruana
      );

      if (existingTalla) {
        existingTalla.stock += stockDisponible;
        existingTalla.precio_retail = obtenerPrecioMasFrecuente([
          existingTalla.precio_retail,
          precio1,
        ]);
        existingTalla.precio_tienda = obtenerPrecioMasFrecuente([
          existingTalla.precio_tienda,
          precio2,
        ]);
        existingTalla.precio_emprendedor = obtenerPrecioMasFrecuente([
          existingTalla.precio_emprendedor,
          precio3,
        ]);
        existingTalla.precio_mayorista = obtenerPrecioMasFrecuente([
          existingTalla.precio_mayorista,
          precio6,
        ]);
      } else if (stockDisponible > 0) {
        // Solo agregar tallas que tienen stock > 0
        groupedProducts[grupo].tallas.push({
          _id: codigoArticulo,
          talla: tallaPeruana,
          stock: stockDisponible,
          precio_retail: precio1,
          precio_tienda: precio2,
          precio_emprendedor: precio3,
          precio_mayorista: precio6,
        });
        groupedProducts[grupo].tallas_catalogo.add(tallaPeruana);
      }

      const existingAlmacen = groupedProducts[grupo].almacenes.find(
        (almacen) => almacen.almacen === almacenTabla
      );

      if (existingAlmacen) {
        existingAlmacen.stock += stockDisponible;
      } else {
        groupedProducts[grupo].almacenes.push({
          almacen: almacenTabla,
          stock: stockDisponible,
        });
      }
      // Normaliza el código de almacén para evitar duplicados por espacios o mayúsculas/minúsculas
      const almacenesNombres: Record<string, string> = {
        '0001': 'TIENDA GRAU',
        '0009': 'ALMACEN IQUITOS',
        '4002': 'TIENDA LOS OLIVOS',
        '2001': 'TUMBES',
        '0002': 'HUANUCO',
      };
      const codigoAlmacenNormalizado = codigoAlmacen.trim().toUpperCase();
      const nombreAlmacen = almacenesNombres[codigoAlmacenNormalizado] || codigoAlmacenNormalizado;
      // Sumar SOLO a la provincia especial (ej: ALMACEN IQUITOS, TIENDA GRAU, etc.)
      if (nombreAlmacen) {
        const existingProv = groupedProducts[grupo].provincias.find(
          (p) => p.provincia === nombreAlmacen
        );
        if (existingProv) {
          existingProv.stock += stockDisponible;
        } else {
          groupedProducts[grupo].provincias.push({
            provincia: nombreAlmacen,
            stock: stockDisponible,
          });
        }
      }
      // Sumar a LIMA solo si el código corresponde a LIMA
      const codigosLima = ['0001', '0009', '4002'];
      if (codigosLima.includes(codigoAlmacenNormalizado)) {
        const existingLima = groupedProducts[grupo].provincias.find(
          (p) => p.provincia === 'LIMA'
        );
        if (existingLima) {
          existingLima.stock += stockDisponible;
        } else {
          groupedProducts[grupo].provincias.push({
            provincia: 'LIMA',
            stock: stockDisponible,
          });
        }
      }
      // Ya NO sumar a TUMBES ni HUANUCO como provincia general
      // Sumar a almacenes_detalle
      const existing = groupedProducts[grupo].almacenes_detalle.find(a => a.codigo === codigoAlmacenNormalizado);
      if (existing) {
        existing.stock += stockDisponible;
      } else {
        groupedProducts[grupo].almacenes_detalle.push({
          codigo: codigoAlmacenNormalizado,
          nombre: nombreAlmacen,
          stock: stockDisponible,
        });
      }
      groupedProducts[grupo].stockDisponible += stockDisponible;
      
      // Usar precios de la nueva API si están disponibles
      const retail = precioRetail || precio1;
      const emprendedor = precioEmprendedor || precio3;
      const mayorista = precioMayorista || precio6;
      const mayoristaCD = precioMayoristaCD || precio6;

      groupedProducts[grupo].precio_retail = obtenerPrecioMasFrecuente([
        groupedProducts[grupo].precio_retail,
        retail,
      ]);
      groupedProducts[grupo].precio_tienda = obtenerPrecioMasFrecuente([
        groupedProducts[grupo].precio_tienda,
        precio2,
      ]);
      groupedProducts[grupo].precio_emprendedor = obtenerPrecioMasFrecuente([
        groupedProducts[grupo].precio_emprendedor,
        emprendedor,
      ]);
      groupedProducts[grupo].precio_mayorista = obtenerPrecioMasFrecuente([
        groupedProducts[grupo].precio_mayorista,
        mayorista,
      ]);
      groupedProducts[grupo].mayorista_cd = obtenerPrecioMasFrecuente([
        groupedProducts[grupo].mayorista_cd || 0,
        mayoristaCD,
      ]);
      groupedProducts[grupo].priceecommerce = groupedProducts[grupo].precio_retail;
      groupedProducts[grupo].priceemprendedor = groupedProducts[grupo].precio_emprendedor;

      // Al final de cada iteración, actualiza almacenes_detalle
      // Refleja el stock de cada código de almacén exactamente como viene de la API
      // const existing = groupedProducts[grupo].almacenes_detalle.find(a => a.codigo === codigoAlmacenNormalizado);
      // if (existing) {
      //   existing.stock += stockDisponible;
      // } else {
      //   groupedProducts[grupo].almacenes_detalle.push({
      //     codigo: codigoAlmacenNormalizado,
      //     nombre: almacenesNombres[codigoAlmacenNormalizado] || codigoAlmacenNormalizado,
      //     stock: stockDisponible,
      //   });
      // }
    }
  );

  // Calcular precios_diferentes para cada grupo
  Object.values(groupedProducts).forEach((product) => {
    const precios1 = product.tallas.map((t) => t.precio_retail);
    const precios2 = product.tallas.map((t) => t.precio_tienda);
    const precios3 = product.tallas.map((t) => t.precio_emprendedor);
    const precios6 = product.tallas.map((t) => t.precio_mayorista);
    const allSame = (arr: number[]) => arr.every((v) => v === arr[0]);
    product.precios_diferentes =
      !allSame(precios1) || !allSame(precios2) || !allSame(precios3) || !allSame(precios6);
  });

  return Object.values(groupedProducts).map((product) => {
    // Filtrar solo tallas con stock > 0
    const tallasConStock = product.tallas.filter(t => t.stock > 0);
    const tallasConStockArray = tallasConStock.map(t => t.talla).sort((a: string, b: string) => {
      const numA = parseFloat(a);
      const numB = parseFloat(b);
      return numA - numB;
    });
    
    // DEBUG: Solo para algunos productos
    if (Math.random() < 0.001) { // 0.1% de probabilidad
      console.log(`🔍 DEBUG tallas con stock - SKU: ${product.sku}`, {
        tallasOriginales: product.tallas.length,
        tallasConStock: tallasConStock.length,
        tallascatalogo: tallasConStockArray.join(",")
      });
    }
    
    return {
      ...product,
      tallas: tallasConStock, // Solo tallas con stock
      tallas_catalogo: tallasConStockArray,
      tallascatalogo: tallasConStockArray.join(","), // String para compatibilidad con productos-traidos-sistema
    };
  });
}
