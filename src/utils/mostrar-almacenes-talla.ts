// /**
//  * Obtiene el nombre base del almacén sin secciones
//  */
// function obtenerNombreBase(codigoAlmacen: string): string {
//   const mapaAlmacenes: Record<string, string> = {
//     "0002": "Tienda Grau",
//     "0009": "Iquitos", 
//     "4001": "Fritz Sport Los Olivos",
//     "2001": "Aguas Verdes",
//     "0006": "Huánuco",
//   };

//   return mapaAlmacenes[codigoAlmacen] || `Almacén ${codigoAlmacen}`;
// }

// /**
//  * Agrupa almacenes por código para evitar duplicados
//  */
// export function agruparAlmacenesPorCodigo(almacenes: { 
//   almacen: string; 
//   codigoAlmacen: string; 
//   nombreAlmacen: string;
//   provincia: string;
//   stock: number;
// }[]): { 
//   almacen: string; 
//   codigoAlmacen: string; 
//   nombreAlmacen: string;
//   provincia: string;
//   stock: number;
// }[] {
//   const agrupados = new Map<string, { 
//     almacen: string; 
//     codigoAlmacen: string; 
//     nombreAlmacen: string;
//     provincia: string;
//     stock: number;
//   }>();

//   almacenes.forEach(alm => {
//     if (agrupados.has(alm.codigoAlmacen)) {
//       const existente = agrupados.get(alm.codigoAlmacen)!;
//       existente.stock += alm.stock;
//     } else {
//       agrupados.set(alm.codigoAlmacen, { 
//         ...alm,
//         nombreAlmacen: obtenerNombreBase(alm.codigoAlmacen) // Usar nombre base sin secciones
//       });
//     }
//   });

//   return Array.from(agrupados.values());
// }

// /**
//  * Formatea la información de almacenes para una talla específica
//  */
// export function formatearAlmacenesTalla(almacenes: { 
//   almacen: string; 
//   codigoAlmacen: string; 
//   nombreAlmacen: string;
//   provincia: string;
//   stock: number;
// }[]): string {
//   if (!almacenes || almacenes.length === 0) {
//     return "Sin stock disponible";
//   }

//   // Agrupar por código de almacén primero
//   const almacenesAgrupados = agruparAlmacenesPorCodigo(almacenes);
  
//   // Filtrar solo almacenes con stock > 0
//   const almacenesConStock = almacenesAgrupados.filter(alm => alm.stock > 0);
  
//   if (almacenesConStock.length === 0) {
//     return "Sin stock disponible";
//   }

//   // Crear descripción legible con separadores claros
//   return almacenesConStock
//     .map(alm => {
//       const unidades = alm.stock === 1 ? 'unidad' : 'unidades';
//       return `${alm.nombreAlmacen}: ${alm.stock} ${unidades}`;
//     })
//     .join(' | ');
// }

// /**
//  * Formatea la información de almacenes de manera compacta
//  */
// export function formatearAlmacenesCompacto(almacenes: { 
//   almacen: string; 
//   codigoAlmacen: string; 
//   nombreAlmacen: string;
//   provincia: string;
//   stock: number;
// }[]): string {
//   if (!almacenes || almacenes.length === 0) {
//     return "Sin stock";
//   }

//   // Agrupar por código de almacén primero
//   const almacenesAgrupados = agruparAlmacenesPorCodigo(almacenes);
//   const almacenesConStock = almacenesAgrupados.filter(alm => alm.stock > 0);
  
//   if (almacenesConStock.length === 0) {
//     return "Sin stock";
//   }

//   if (almacenesConStock.length === 1) {
//     const alm = almacenesConStock[0];
//     return `${alm.nombreAlmacen} (${alm.stock})`;
//   }

//   const totalStock = almacenesConStock.reduce((sum, alm) => sum + alm.stock, 0);
//   return `${almacenesConStock.length} almacenes (${totalStock} total)`;
// }

// /**
//  * Obtiene un resumen de provincias donde está disponible una talla
//  */
// export function obtenerProvinciasDisponibles(almacenes: { 
//   almacen: string; 
//   codigoAlmacen: string; 
//   nombreAlmacen: string;
//   provincia: string;
//   stock: number;
// }[], yaAgrupados: boolean = false): string[] {
//   if (!almacenes || almacenes.length === 0) {
//     return [];
//   }

//   // Solo agrupar si no están ya agrupados
//   const almacenesParaProcesar = yaAgrupados ? almacenes : agruparAlmacenesPorCodigo(almacenes);
//   const almacenesConStock = almacenesParaProcesar.filter(alm => alm.stock > 0);
//   const provincias = [...new Set(almacenesConStock.map(alm => alm.provincia))];
  
//   return provincias.filter(provincia => provincia !== "DESCONOCIDO");
// }

// /**
//  * Verifica si una talla está disponible en una provincia específica
//  */
// export function estaDisponibleEnProvincia(
//   almacenes: { 
//     almacen: string; 
//     codigoAlmacen: string; 
//     nombreAlmacen: string;
//     provincia: string;
//     stock: number;
//   }[], 
//   provincia: string
// ): boolean {
//   if (!almacenes || almacenes.length === 0) {
//     return false;
//   }

//   return almacenes.some(alm => 
//     alm.provincia.toUpperCase() === provincia.toUpperCase() && alm.stock > 0
//   );
// }

// /**
//  * Obtiene el stock total de una talla en una provincia específica
//  */
// export function obtenerStockEnProvincia(
//   almacenes: { 
//     almacen: string; 
//     codigoAlmacen: string; 
//     nombreAlmacen: string;
//     provincia: string;
//     stock: number;
//   }[], 
//   provincia: string
// ): number {
//   if (!almacenes || almacenes.length === 0) {
//     return 0;
//   }

//   return almacenes
//     .filter(alm => alm.provincia.toUpperCase() === provincia.toUpperCase())
//     .reduce((total, alm) => total + alm.stock, 0);
// }