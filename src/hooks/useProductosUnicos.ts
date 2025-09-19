import { useMemo } from 'react';

interface Producto {
  sku: string;
  _id?: string;
  tallas?: Array<{ stock: number; talla: string }>;
  [key: string]: any;
}

/**
 * Hook personalizado para eliminar productos duplicados
 * Mantiene el producto con mejor stock y información más completa
 */
export function useProductosUnicos(productos: Producto[]): Producto[] {
  return useMemo(() => {
    if (!productos?.length) return [];
    
    const productosMap = new Map<string, Producto>();
    let duplicadosEliminados = 0;
    
    productos.forEach(producto => {
      if (!producto?.sku) return;
      
      const key = producto.sku;
      
      if (!productosMap.has(key)) {
        productosMap.set(key, producto);
      } else {
        duplicadosEliminados++;
        const existente = productosMap.get(key)!;
        
        // Calcular stock total para comparar
        const stockExistente = existente.tallas?.reduce((acc, t) => acc + (t.stock || 0), 0) || 0;
        const stockNuevo = producto.tallas?.reduce((acc, t) => acc + (t.stock || 0), 0) || 0;
        
        // Criterios para determinar cuál producto mantener:
        // 1. Prioridad a productos con _id (más completos)
        // 2. Mayor stock total
        // 3. Más tallas disponibles
        const deberiaReemplazar = 
          (!existente._id && producto._id) ||
          (stockNuevo > stockExistente) ||
          (stockNuevo === stockExistente && (producto.tallas?.length || 0) > (existente.tallas?.length || 0));
        
        if (deberiaReemplazar) {
          productosMap.set(key, producto);
        }
      }
    });
    
    // Log para debugging en desarrollo
    if (process.env.NODE_ENV === 'development' && duplicadosEliminados > 0) {
      console.log(`🔄 Productos Rápidos: ${duplicadosEliminados} duplicados eliminados de ${productos.length} productos`);
    }
    
    return Array.from(productosMap.values());
  }, [productos]);
}

/**
 * Hook con estadísticas adicionales para debugging
 */
export function useProductosUnicosConEstadisticas(productos: Producto[]) {
  const productosUnicos = useProductosUnicos(productos);
  
  return useMemo(() => {
    const estadisticas = {
      total: productos.length,
      unicos: productosUnicos.length,
      duplicados: productos.length - productosUnicos.length,
      porcentajeDuplicados: productos.length > 0 ? 
        Math.round(((productos.length - productosUnicos.length) / productos.length) * 100) : 0
    };
    
    return {
      productos: productosUnicos,
      estadisticas
    };
  }, [productos, productosUnicos]);
}