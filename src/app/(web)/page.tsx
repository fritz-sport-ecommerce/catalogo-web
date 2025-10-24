import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import ProductsLoader from "@/components/busca-tu-taba/ProductsLoader";
import OnboardingSkeleton from "@/components/busca-tu-taba/OnboardingSkeleton";
import { Suspense } from "react";
import LoadingSpinner from "./loading";
import QuickFilters from "@/components/busca-tu-taba/quick-filters";

interface Props {
  searchParams: {
    start?: string;
    fecha?: string;
    razonsocial?: string;
    priceecommerce?: string;
    precio?: string;
    price?: string;
    talla?: string;
    coleccion?: string;
    color?: string;
    category?: string;
    tipo?: string;
    marca?: string;
    size?: string;
    genero?: string;
    subgenero?: string;
    search?: string;
    sku?: string;
    page?: string;
    rangoPrecio?: string;
    tipoproducto?: string;
    populares?: string; // "true" to filter by popularidad > 1
  };
}

export default async function Page({ searchParams }: Props) {
  const {
    fecha: date,
    precio,
    price,
    color,
    category,
    size,
    search,
    subgenero,
    razonsocial,
    genero,
    coleccion,
    talla,
    marca,
    tipo,
    rangoPrecio: priceRange,
    razonsocial: razonSocial,
    tipoproducto,
    populares,
  } = searchParams;

  const hasStyleSelected = Boolean(category || tipo || populares === "true" || date === "desc");
  const hasGenero = Boolean(genero);
  const hasMarca = Boolean(marca);
  const hasRangoPrecio = Boolean(priceRange);
  const canShowProducts = hasStyleSelected && hasGenero && hasMarca && hasRangoPrecio;

  // Debug logs para verificar filtros
  console.log('📋 PAGE DEBUG - Filtros:', {
    category,
    tipo,
    genero,
    marca,
    priceRange,
    populares,
    date,
    hasStyleSelected,
    hasGenero,
    hasMarca,
    hasRangoPrecio,
    canShowProducts
  });

  // Si no hay estilo seleccionado aún, mostrar onboarding y no traer productos
  if (!canShowProducts) {
    const searchKey = JSON.stringify(searchParams);
    return (
      <Suspense fallback={<OnboardingSkeleton />}>
        <div key={searchKey}>
          <main className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-center py-6">
                <div className="sticky xl:top-2 top-10 z-20">
                  <a
                    href="/pdf"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-black dark:bg-white text-white dark:text-black px-6 py-3 text-base font-semibold shadow-lg hover:bg-blue-700 transition-all hover:shadow-xl"
                  >
                    Ver catálogo completo
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>
              
              <section className="min-h-[70vh] flex items-start justify-center py-8 lg:py-12">
                <div className="max-w-5xl w-full">
                  <div className="mb-8 lg:mb-12">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-4 text-gray-900 dark:text-white">
                      Busca tu Producto
                    </h1>
                    <p className="text-center text-gray-600 dark:text-gray-400 text-base sm:text-lg mb-8">
                      Encuentra tus productos ideales en 5 pasos simples
                    </p>
                  </div>
                  
                  {/* <div className="mb-8 p-6 sm:p-8 rounded-2xl    from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-xl">
                    <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-900 dark:text-white">¿Cómo funciona?</h2>
                    <ol className="space-y-4 text-base sm:text-lg">
                      <li className="flex items-start gap-4">
                        <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold flex items-center justify-center text-lg">1</span>
                        <span className="pt-1"><strong className="text-gray-900 dark:text-white">Selecciona el tipo:</strong> <span className="text-gray-700 dark:text-gray-300">Calzado, Ropa o Accesorios</span></span>
                      </li>
                      <li className="flex items-start gap-4">
                        <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold flex items-center justify-center text-lg">2</span>
                        <span className="pt-1"><strong className="text-gray-900 dark:text-white">Selecciona el género:</strong> <span className="text-gray-700 dark:text-gray-300">Hombre, Mujer, Unisex o Niños</span></span>
                      </li>
                      <li className="flex items-start gap-4">
                        <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold flex items-center justify-center text-lg">3</span>
                        <span className="pt-1"><strong className="text-gray-900 dark:text-white">Elige un estilo:</strong> <span className="text-gray-700 dark:text-gray-300">Urbano, Running o Chimpunes</span></span>
                      </li>
                      <li className="flex items-start gap-4">
                        <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold flex items-center justify-center text-lg">4</span>
                        <span className="pt-1"><strong className="text-gray-900 dark:text-white">Elige la marca:</strong> <span className="text-gray-700 dark:text-gray-300">Adidas, Nike, Reebok o Fritz Sport</span></span>
                      </li>
                      <li className="flex items-start gap-4">
                        <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold flex items-center justify-center text-lg">5</span>
                        <span className="pt-1"><strong className="text-gray-900 dark:text-white">Define tu presupuesto:</strong> <span className="text-gray-700 dark:text-gray-300">Establece el rango de precios</span></span>
                      </li>
                    </ol>
                  </div> */}
               
                  <div className="flex items-center justify-center">
                    <QuickFilters variant="onboarding" />
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </Suspense>
    );
  }

  const itemsPerPage = 10; // Mostrar 10 productos inicialmente
  const searchKey = JSON.stringify(searchParams);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div key={searchKey}>
        <div>
          <main className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-[1920px] mx-auto">
              <section aria-labelledby="products-heading" className="pt-6 lg:pt-8">
                <h2 id="products-heading" className="sr-only">Products</h2>
                <div
                  className={cn(
                    "grid grid-cols-1 gap-x-6 lg:gap-x-8 gap-y-8 items-start",
                    "lg:grid-cols-[340px_1fr] xl:grid-cols-[380px_1fr]"
                  )}
                >
                  {/* Sidebar Desktop con Filtros */}
                  <div className="hidden lg:block sticky top-20 space-y-6 max-h-[calc(100vh-6rem)] overflow-y-auto">
                    <a
                      href="/pdf"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-black text-white px-5 py-3 text-base font-semibold shadow-lg hover:bg-blue-700 transition-all hover:shadow-xl"
                    >
                      Ver catálogo completo
                      <ExternalLink className="w-5 h-5" />
                    </a>
                    <QuickFilters />
                  </div>
                  
                  <div id="productos">
                    <ProductsLoader searchParams={searchParams} itemsPerPage={itemsPerPage} />
                  </div>
                </div>
                
                {/* Botón flotante mobile - Solo visible en mobile */}
                <div className="lg:hidden">
                  <QuickFilters />
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </Suspense>
  );
}
