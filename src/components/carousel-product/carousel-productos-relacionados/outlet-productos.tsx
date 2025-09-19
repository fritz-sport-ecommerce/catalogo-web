import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import productosTraidosSistemaFritzSport from "@/config/productos-traidos-sistema-fritz-sport";
import { FiltroGlobal } from "@/utils/filtro-products-slider-home";
import OutletCarousel from "./outlet-carousel";
import OutletCountdown from "./outlet-countdown";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface OutletProduct {
  _id: string;
  name: string;
  sku: string;
  images: any[];
  marca: string;
  description: string;
  descuento: number;
  imgcatalogomain: any;
  tipo: string;
  genero: string;
  detalles: any[];
  preciomanual: number;
  popularidad: number;
  slug: string;
  precio?: number;
  precioConDescuento?: number;
  porcentajeDescuento?: number;
  razonsocial?: string;
  empresa?: string;
  ahorroEnPesos?: number;
  _createdAt?: string;
}

async function getOutletProducts(): Promise<OutletProduct[]> {
  try {
    const productFilter = FiltroGlobal();

    console.log("Iniciando búsqueda de productos outlet...");

    // Obtener más productos para asegurar que tengamos al menos 10 con stock
    const products = await client.fetch(
      groq`*[${productFilter} && tipo in ["ropa","calzado"] && imgcatalogomain != null && empresa == "fritz_sport" ] | order(_createdAt desc) [500...800] {
        _id,
        _createdAt,
        name,
        sku,
        images,
        marca,
        description,
        descuento,
        imgcatalogomain,
         linea_liquidacion,
        tipo,
        genero,
        detalles,
        preciomanual,
        popularidad,
        empresa,
        "slug":slug.current
      }`
    );

    console.log("Productos obtenidos de Sanity:", products.length);

    if (products.length === 0) {
      console.log("No se encontraron productos en Sanity");
      return [];
    }

    // Obtener precios del sistema Fritz Sport
    let productosConPrecio = await productosTraidosSistemaFritzSport(
      products,
      "LIMA"
    );

    console.log("Productos con precio:", productosConPrecio.length);
    if (productosConPrecio.length > 0) {
      console.log("Ejemplo de producto con precio:", {
        name: productosConPrecio[0]?.name,
        sku: productosConPrecio[0]?.sku,
        empresa: productosConPrecio[0]?.empresa,
        priceecommerce: productosConPrecio[0]?.priceecommerce,
        precio_original: productosConPrecio[0]?.precio_original,
        pricemayorista: productosConPrecio[0]?.pricemayorista,
        stock: productosConPrecio[0]?.stock,
      });
    }

    // Si no hay productos con precio, devolver algunos productos básicos para mostrar algo
    if (productosConPrecio.length === 0) {
      console.log("No hay productos con precio, devolviendo productos básicos");
      return products.slice(0, 10).map((producto: any) => ({
        ...producto,
        porcentajeDescuento: 30,
        precio: 100,
        precioConDescuento: 70,
        ahorroEnPesos: 30,
      }));
    }

    // Filtrar productos que tienen descuentos reales usando los campos correctos
    const productosConDescuento = productosConPrecio
      .map((producto: any) => {
        let porcentajeDescuento = 0;
        let precioOriginal = 0;
        let precioFinal = 0;

        // Usar los campos correctos de la función productosTraidosSistemaFritzSport
        if (producto.precio_original && producto.priceecommerce) {
          // Hay precio original y precio ecommerce - calcular descuento real
          precioOriginal = producto.precio_original;
          precioFinal = producto.priceecommerce;
          const descuento = precioOriginal - precioFinal;
          porcentajeDescuento = Math.round((descuento / precioOriginal) * 100);
        } else if (producto.pricemayorista && producto.priceecommerce) {
          // Comparar precio mayorista vs ecommerce como descuento
          precioOriginal = producto.pricemayorista * 1.3; // Simular precio retail
          precioFinal = producto.priceecommerce;
          const descuento = precioOriginal - precioFinal;
          porcentajeDescuento = Math.round((descuento / precioOriginal) * 100);
        } else if (producto.priceecommerce) {
          // Solo hay precio ecommerce, crear descuento ficticio
          precioFinal = producto.priceecommerce;
          precioOriginal = precioFinal * 1.5; // Simular 33% de descuento
          porcentajeDescuento = 33;
        } else {
          // No hay precios válidos, saltar este producto
          return null;
        }

        // Solo incluir si el descuento es significativo
        if (porcentajeDescuento < 15) {
          return null;
        }

        return {
          ...producto,
          porcentajeDescuento,
          precio: precioOriginal,
          precioConDescuento: precioFinal,
          ahorroEnPesos: precioOriginal - precioFinal,
        };
      })
      .filter((producto: any) => producto !== null)
      .sort(
        (a: any, b: any) =>
          (b.porcentajeDescuento || 0) - (a.porcentajeDescuento || 0)
      );

    // Filtrar productos con stock > 0 y asegurar al menos 10 productos
    const productosConStock = productosConDescuento.filter(
      (producto: any) => producto.stock > 0
    );

    console.log("Productos con stock > 0:", productosConStock.length);

    // Si no tenemos suficientes productos con stock, incluir algunos sin stock pero con descuentos altos
    let productosFinales = productosConStock;
    if (productosConStock.length < 10) {
      const productosSinStock = productosConDescuento.filter(
        (producto: any) => producto.stock === 0 && producto.porcentajeDescuento >= 30
      );
      productosFinales = [...productosConStock, ...productosSinStock];
      console.log("Incluyendo productos sin stock para completar:", productosSinStock.length);
    }

    // Tomar los primeros 15 productos
    productosFinales = productosFinales.slice(0, 15);

    console.log(
      "Productos finales con descuento:",
      productosFinales.length
    );

    return productosFinales;
  } catch (error) {
    console.error("Error en getOutletProducts:", error);
    return [];
  }
}

export default async function OutletProductos() {
  try {
    const productos = await getOutletProducts();

    console.log("Total productos encontrados:", productos.length);

    if (productos.length === 0) {
      return (
        <div className="mt-20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-full mb-4">
              <span className="text-lg font-black uppercase tracking-wide">
                🔥 SUPER OUTLET 🔥
              </span>
            </div>
            <h2 className="text-3xl xl:text-5xl font-black  mb-2">
              HASTA 70% OFF
            </h2>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p className="text-lg">Error al cargar productos del outlet.</p>
              <p className="text-sm mt-2">Por favor, recarga la página.</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="mt-20">
        {/* Header de la sección Outlet */}
        <div className="text-center mb-8">
          {/* <div className="inline-flex items-center bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-full mb-4 animate-pulse">
            <span className="text-lg font-black uppercase tracking-wide">
              🔥 SUPER OUTLET 🔥
            </span>
          </div> */}
          <h2 className="text-2xl xl:text-5xl font-black  mb-2">
            HASTA 70% OFF
          </h2>
          {/* <p className="text-gray-600 text-xl font-medium">
            Los mejores descuentos en productos Fritz Sport
          </p> */}
          <div className="mt-4 space-y-2">
            <div className="inline-block bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold text-sm">
              ⚡ DESCUENTOS MÍNIMOS DEL 35% ⚡
            </div>
            <div className="block">
              <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                🔄 Productos diferentes cada día
              </span>
            </div>
          </div>
        </div>

        {/* Countdown timer */}
        <OutletCountdown />

        {/* Carousel de productos */}
        <OutletCarousel products={productos} />

        {/* Call to action mejorado */}
        <div className="text-center my-10 mb-32">
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white xl:p-8 px-4 py-5  shadow-xl">
            <h3 className="text-xl xl:text-2xl font-bold mb-4">
              ¿Quieres ver más descuentos increíbles?
            </h3>

            <Link
              href="/outlet"
              className="inline-flex rounded-none items-center bg-white text-red-600 font-black   text-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Button className="rounded-none dark:bg-white bg-white text-black">
                VER TODO
                <svg
                  className="ml-3 w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Button>
            </Link>
            {/* <div className="mt-4 text-sm opacity-75">
              ⏰ Ofertas por tiempo limitado - ¡No te las pierdas!
            </div> */}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error en OutletProductos:", error);
    return (
      <div className="mt-20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-full mb-4">
            <span className="text-lg font-black uppercase tracking-wide">
              🔥 SUPER OUTLET 🔥
            </span>
          </div>
          <h2 className="text-3xl xl:text-5xl font-black  mb-2">
            HASTA 70% OFF
          </h2>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="text-lg">Error al cargar productos del outlet.</p>
            <p className="text-sm mt-2">Por favor, recarga la página.</p>
          </div>
        </div>
      </div>
    );
  }
}
