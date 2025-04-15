import { client } from "@/sanity/lib/client";


export default async function eliminarTallas() {
  // try {
  //   // Consulta para obtener todos los productos
  //   const productos = await client.fetch(`*[_type == "product" && defined(tallas)]{_id, name ,sku}`);
  //   let index = 0;

  //   const eliminarTallasBatch = () => {
  //     // Obtiene un lote de 10 productos
  //     const batch = productos.slice(index, index + 10);

  //     // Muestra en consola los productos que se están procesando en este lote
  //     console.log('Eliminando "tallas" de los siguientes productos:', batch.map((producto) => producto.sku));

  //     const operaciones = batch.map((producto) =>
  //       client
  //         .patch(producto._id)
  //         .unset(['tallas'])
  //         .commit()
  //     );

  //     // Ejecuta las operaciones de eliminación
  //     Promise.all(operaciones)
  //       .then(() => {
  //         index += 10;
  //         if (index < productos.length) {
  //           setTimeout(eliminarTallasBatch, 5000); // Espera 5 segundos antes de la próxima iteración
  //         } else {
  //           console.log('Eliminación de "tallas" completada para todos los productos.');
  //         }
  //       })
  //       .catch((error) => {
  //         console.error('Error al eliminar "tallas":', error);
  //       });
  //   };

  //   eliminarTallasBatch();
  // } catch (error) {
  //   console.error('Error en la consulta de productos:', error);
  // }
}


