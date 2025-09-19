import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

export async function POST(request: NextRequest) {
  try {
    const { productSkus, quantities } = await request.json();

    if (!productSkus || !Array.isArray(productSkus) || productSkus.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere un array de SKUs de productos' },
        { status: 400 }
      );
    }

    console.log('🔥 Actualizando popularidad y cantidad vendida para SKUs:', productSkus);

    // Actualizar popularidad y cantidad vendida para cada producto
    const updatePromises = productSkus.map(async (sku: string, index: number) => {
      try {
        // Buscar el producto por SKU
        const producto = await client.fetch(
          `*[_type == "product" && sku == $sku][0]`,
          { sku }
        );

        if (producto) {
          // Incrementar popularidad en 1
          const nuevaPopularidad = (producto.popularidad || 0) + 1;
          
          // Obtener la cantidad vendida de este producto específico
          const cantidadVendida = quantities && quantities[index] ? quantities[index] : 1;
          const nuevaCantidadVendidos = (producto.cantidadVendidos || 0) + cantidadVendida;
          
          await client
            .patch(producto._id)
            .set({ 
              popularidad: nuevaPopularidad,
              cantidadVendidos: nuevaCantidadVendidos
            })
            .commit();

          console.log(`✅ Actualizado para ${sku}: popularidad ${nuevaPopularidad}, vendidos ${nuevaCantidadVendidos}`);
          return { 
            sku, 
            popularidad: nuevaPopularidad, 
            cantidadVendidos: nuevaCantidadVendidos,
            success: true 
          };
        } else {
          console.log(`⚠️ Producto no encontrado: ${sku}`);
          return { sku, error: 'Producto no encontrado', success: false };
        }
      } catch (error:any) {
        console.error(`❌ Error actualizando ${sku}:`, error);
        return { sku, error: error.message, success: false };
      }
    });

    const results = await Promise.all(updatePromises);
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    console.log(`📊 Popularidad actualizada: ${successful.length} exitosos, ${failed.length} fallidos`);

    return NextResponse.json({
      message: 'Popularidad actualizada',
      successful: successful.length,
      failed: failed.length,
      results
    });

  } catch (error) {
    console.error('❌ Error en update-popularity:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}