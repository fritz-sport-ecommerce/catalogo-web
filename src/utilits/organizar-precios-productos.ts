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
//         Math.max(
//           groupedProducts[grupo].precio_retail ?? 0,
//           validarPrecio(precio1) ?? 0
//         ) || null;
//       groupedProducts[grupo].precio_tienda =
//         Math.max(
//           groupedProducts[grupo].precio_tienda ?? 0,
//           validarPrecio(precio2) ?? 0
//         ) || null;
//       groupedProducts[grupo].precio_emprendedor =
//         Math.max(
//           groupedProducts[grupo].precio_emprendedor ?? 0,
//           validarPrecio(precio3) ?? 0
//         ) || null;
//       groupedProducts[grupo].precio_mayorista =
//         Math.max(
//           groupedProducts[grupo].precio_mayorista ?? 0,
//           validarPrecio(precio6) ?? 0
//         ) || null;

//       const existingTalla: Talla | undefined = groupedProducts[
//         grupo
//       ].tallas.find((t: Talla) => t.talla === talla);

//       if (existingTalla) {
//         existingTalla.stock += stockDisponible;
//         existingTalla.precio_retail =
//           Math.max(
//             existingTalla.precio_retail ?? 0,
//             validarPrecio(precio1) ?? 0
//           ) || null;
//         existingTalla.precio_tienda =
//           Math.max(
//             existingTalla.precio_tienda ?? 0,
//             validarPrecio(precio2) ?? 0
//           ) || null;
//         existingTalla.precio_emprendedor =
//           Math.max(
//             existingTalla.precio_emprendedor ?? 0,
//             validarPrecio(precio3) ?? 0
//           ) || null;
//         existingTalla.precio_mayorista =
//           Math.max(
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
};

type ProductoOrdenado = {
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
};
function convertirTallaPeruana(talla: string): string {
  return talla.endsWith("-") 
    ? talla.replace("-", ".5")  // Si termina en "-", reemplaza con ".5"
    : talla.replace("-", "");   // Si el "-" está en medio, solo elimínalo
}


export default function (data: Producto[]): ProductoOrdenado[] {
  const groupedProducts: Record<string, ProductoOrdenado> = {};

  data.forEach(
    ({
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
      if (!groupedProducts[grupo]) {
        groupedProducts[grupo] = {
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
        };
      }

      let tallaPeruana = convertirTallaPeruana(talla);
      
      const existingTalla = groupedProducts[grupo].tallas.find(
        (t) => t.talla === tallaPeruana
      );
      
      if (existingTalla) {
        existingTalla.stock += stockDisponible;
        existingTalla.precio_retail = Math.max(existingTalla.precio_retail, precio1);
        existingTalla.precio_tienda = Math.max(existingTalla.precio_tienda, precio2);
        existingTalla.precio_emprendedor = Math.max(existingTalla.precio_emprendedor, precio3);
        existingTalla.precio_mayorista = Math.max(existingTalla.precio_mayorista, precio6);
      } else if (stockDisponible > 0) { // Solo agregar tallas con stock mayor a 1
        groupedProducts[grupo].tallas.push({
          _id: codigoArticulo,
          talla: tallaPeruana,
          stock: stockDisponible,
          precio_retail: precio1,
          precio_tienda: precio2,
          precio_emprendedor: precio3,
          precio_mayorista: precio6,
        });
        groupedProducts[grupo].tallas_catalogo.add(tallaPeruana); // Solo agregar si stock > 1
      }
      
      groupedProducts[grupo].stockDisponible += stockDisponible;
      groupedProducts[grupo].precio_retail = Math.max(
        groupedProducts[grupo].precio_retail,
        precio1
      );
      groupedProducts[grupo].precio_tienda = Math.max(
        groupedProducts[grupo].precio_tienda,
        precio2
      );
      groupedProducts[grupo].precio_emprendedor = Math.max(
        groupedProducts[grupo].precio_emprendedor,
        precio3
      );
      groupedProducts[grupo].precio_mayorista = Math.max(
        groupedProducts[grupo].precio_mayorista,
        precio6
      );
    }
  );

  return Object.values(groupedProducts).map((product) => ({
    ...product,
    tallas_catalogo: Array.from(product.tallas_catalogo).sort(),
  }));
}
