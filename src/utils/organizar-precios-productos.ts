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
import {
  obtenerNombreAlmacen,
  obtenerProvinciaAlmacen,
} from "./mapear-almacenes";

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
};

type Talla = {
  _id: string;
  talla: string;
  stock: number;
  precio_retail: number;
  precio_tienda: number;
  precio_emprendedor: number;
  precio_mayorista: number;
  almacenes: {
    almacen: string;
    codigoAlmacen: string;
    nombreAlmacen: string;
    provincia: string;
    stock: number;
  }[];
};
interface Almacen {
  almacen: string;
  stock: number;
}
interface ProvinciaStock {
  provincia: string;
  stock: number;
}
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
  tallas_catalogo: any;
  tallas: Talla[];
  almacenes: Almacen[];
  provincias: ProvinciaStock[];
};
function convertirTallaPeruana(talla: string): string {
  return talla.endsWith("-")
    ? talla.replace("-", ".5") // Si termina en "-", reemplaza con ".5"
    : talla.replace("-", ""); // Si el "-" está en medio, solo elimínalo
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
    }) => {
      // Ignorar stock de ALM0004STO1
      if (almacenTabla === "ALM0004STO1") {
        stockDisponible = 0;
      }
      if (!groupedProducts[grupo]) {
        groupedProducts[grupo] = {
          almacenTabla,
          codigoAlmacen,
          codigoArticulo,
          nombreArticulo,
          stockDisponible: 0,
          marca,
          sku: grupo,
          precio_retail: precio1,
          precio_tienda: precio2,
          precio_emprendedor: precio3,
          precio_mayorista: precio6,
          tallas_catalogo: new Set<string>(),
          tallas: [],
          almacenes: [],
          provincias: [],
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

        // Agregar o actualizar información del almacén para esta talla
        // Agrupar por codigoAlmacen únicamente para evitar duplicados
        const existingAlmacenTalla = existingTalla.almacenes.find(
          (alm) => alm.codigoAlmacen === codigoAlmacen
        );

        if (existingAlmacenTalla) {
          existingAlmacenTalla.stock += stockDisponible;
          // Actualizar almacenTabla si es necesario (mantener el más reciente)
          existingAlmacenTalla.almacen = almacenTabla;
        } else if (stockDisponible > 0) {
          existingTalla.almacenes.push({
            almacen: almacenTabla,
            codigoAlmacen: codigoAlmacen,
            nombreAlmacen: obtenerNombreAlmacen(codigoAlmacen, almacenTabla),
            provincia: obtenerProvinciaAlmacen(codigoAlmacen, almacenTabla),
            stock: stockDisponible,
          });
        }
      } else if (stockDisponible > 0) {
        groupedProducts[grupo].tallas.push({
          _id: codigoArticulo,
          talla: tallaPeruana,
          stock: stockDisponible,
          precio_retail: precio1,
          precio_tienda: precio2,
          precio_emprendedor: precio3,
          precio_mayorista: precio6,
          almacenes: [
            {
              almacen: almacenTabla,
              codigoAlmacen: codigoAlmacen,
              nombreAlmacen: obtenerNombreAlmacen(codigoAlmacen, almacenTabla),
              provincia: obtenerProvinciaAlmacen(codigoAlmacen, almacenTabla),
              stock: stockDisponible,
            },
          ],
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
      groupedProducts[grupo].provincias = obtenerProvinciaProducto(
        codigoAlmacen,
        almacenTabla,
        stockDisponible,
        groupedProducts[grupo].provincias || []
      );
      groupedProducts[grupo].stockDisponible += stockDisponible;
      groupedProducts[grupo].precio_retail = obtenerPrecioMasFrecuente([
        groupedProducts[grupo].precio_retail,
        precio1,
      ]);
      groupedProducts[grupo].precio_tienda = obtenerPrecioMasFrecuente([
        groupedProducts[grupo].precio_tienda,
        precio2,
      ]);
      groupedProducts[grupo].precio_emprendedor = obtenerPrecioMasFrecuente([
        groupedProducts[grupo].precio_emprendedor,
        precio3,
      ]);
      groupedProducts[grupo].precio_mayorista = obtenerPrecioMasFrecuente([
        groupedProducts[grupo].precio_mayorista,
        precio6,
      ]);
    }
  );

  return Object.values(groupedProducts).map((product) => ({
    ...product,
    tallas_catalogo: Array.from(product.tallas_catalogo).sort(),
  }));
}
