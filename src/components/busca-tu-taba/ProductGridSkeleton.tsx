export default function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="flex flex-col w-full">
      {/* Grid de productos skeleton - versión más ligera para paginación */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="relative">
            <div className="h-full flex flex-col border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
              {/* Imagen skeleton - más simple */}
              <div className="relative overflow-hidden bg-gray-200 dark:bg-gray-800 aspect-square">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent "></div>
              </div>
              
              {/* Contenido skeleton - más compacto */}
              <div className="flex-1 flex flex-col p-3 space-y-2">
                {/* Nombre del producto */}
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded "></div>
                
                {/* Precio */}
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 "></div>
                
                {/* Botón */}
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded "></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
