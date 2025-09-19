/**
 * Utilidad para eliminar productos duplicados basándose en el SKU
 * Mantiene el producto con mejor información (más stock, más tallas, etc.)
 */

interface ProductoBase {
  sku: string;
  _id?: string;
  stock?: number;
  tallas?: any[];
  [key: string]: any;
}

/**
 * Elimina productos duplicados por SKU, manteniendo el mejor producto
 * @param productos Array de productos que pueden tener duplicados
 * @returns Array de productos únicos sin duplicados
 */
export function eliminarProductosDuplicados<T extends ProductoBase>(productos: T[]): T[] {
  if (!Array.isArray(productos) || productos.length === 0) {
    return [];
  }

  // Usar Map para mejor rendimiento con grandes cantidades de datos
  const productosUnicos = new Map<string, T>();

  productos.forEach((producto) => {
    if (!producto.sku) {
      console.warn('Producto sin SKU encontrado:', producto);
      return;
    }

    const existente = productosUnicos.get(producto.sku);

    if (!existente) {
      // Si no existe, agregarlo
      productosUnicos.set(producto.sku, producto);
    } else {
      // Si existe, decidir cuál mantener basándose en criterios de calidad
      const nuevoEsMejor = esMejorProducto(producto, existente);
      if (nuevoEsMejor) {
        productosUnicos.set(producto.sku, producto);
      }
    }
  });

  const resultado = Array.from(productosUnicos.values());
  
  if (productos.length !== resultado.length) {
    console.log(`🔄 Duplicados eliminados: ${productos.length} → ${resultado.length} productos únicos`);
  }

  return resultado;
}

/**
 * Determina si un producto es mejor que otro basándose en varios criterios
 * @param nuevo Producto nuevo a evaluar
 * @param existente Producto existente para comparar
 * @returns true si el nuevo producto es mejor
 */
function esMejorProducto<T extends ProductoBase>(nuevo: T, existente: T): boolean {
  // Criterio 1: Preferir el que tenga más stock
  const stockNuevo = nuevo.stock || 0;
  const stockExistente = existente.stock || 0;
  
  if (stockNuevo > stockExistente) return true;
  if (stockNuevo < stockExistente) return false;

  // Criterio 2: Preferir el que tenga más tallas disponibles
  const tallasNuevo = nuevo.tallas?.length || 0;
  const tallasExistente = existente.tallas?.length || 0;
  
  if (tallasNuevo > tallasExistente) return true;
  if (tallasNuevo < tallasExistente) return false;

  // Criterio 3: Preferir el que tenga _id (más completo)
  if (nuevo._id && !existente._id) return true;
  if (!nuevo._id && existente._id) return false;

  // Criterio 4: Preferir el más reciente (si tienen _createdAt)
  if (nuevo._createdAt && existente._createdAt) {
    return new Date(nuevo._createdAt) > new Date(existente._createdAt);
  }

  // Si son equivalentes, mantener el existente
  return false;
}

/**
 * Elimina duplicados de una lista simple basándose en una propiedad específica
 * @param items Array de elementos
 * @param keyExtractor Función que extrae la clave única de cada elemento
 * @returns Array sin duplicados
 */
export function eliminarDuplicadosPorClave<T>(
  items: T[], 
  keyExtractor: (item: T) => string | number
): T[] {
  const vistos = new Set();
  return items.filter(item => {
    const clave = keyExtractor(item);
    if (vistos.has(clave)) {
      return false;
    }
    vistos.add(clave);
    return true;
  });
}

/**
 * Valida que un producto tenga los campos mínimos requeridos
 * @param producto Producto a validar
 * @returns true si el producto es válido
 */
export function esProductoValido(producto: any): boolean {
  return !!(
    producto &&
    typeof producto === 'object' &&
    producto.sku &&
    producto.name &&
    (producto.priceecommerce > 0 || producto.preciomanual > 0)
  );
}

/**
 * Filtra y elimina duplicados de productos en una sola operación
 * @param productos Array de productos
 * @returns Array de productos válidos y únicos
 */
export function limpiarProductos<T extends ProductoBase>(productos: T[]): T[] {
  // Primero filtrar productos válidos
  const productosValidos = productos.filter(esProductoValido);
  
  // Luego eliminar duplicados
  return eliminarProductosDuplicados(productosValidos);
}