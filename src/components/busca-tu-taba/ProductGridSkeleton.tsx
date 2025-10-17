export default function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="flex flex-col w-full">
      {/* Contador skeleton */}
      <div className="mb-6">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-48 "></div>
      </div>

      {/* Grid de productos skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="relative">
            <div className="h-full flex flex-col border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
              {/* Imagen skeleton */}
              <div className="relative overflow-hidden bg-gray-200 dark:bg-gray-800 aspect-square ">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent animate-shimmer"></div>
              </div>
              
              {/* Contenido skeleton */}
              <div className="flex-1 flex flex-col p-3 space-y-2.5">
                {/* Género y SKU */}
                <div className="flex items-center justify-between">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 "></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12 "></div>
                </div>
                
                {/* Nombre del producto */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full "></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 "></div>
                </div>

                {/* Precios */}
                <div className="space-y-1.5">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 "></div>
                  <div className="flex gap-2">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16 "></div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16 "></div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16 "></div>
                  </div>
                </div>

                {/* Separador */}
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2 "></div>
                  <div className="flex flex-wrap gap-1">
                    {[1, 2, 3, 4, 5].map((t) => (
                      <div key={t} className="h-5 w-10 bg-gray-200 dark:bg-gray-700 rounded "></div>
                    ))}
                  </div>
                </div>

                {/* Botón WhatsApp */}
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg  mt-2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
