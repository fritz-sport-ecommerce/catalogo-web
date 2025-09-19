export default function Loading() {
  return (
    <div className=" px-4 py-8 sm:px-6 lg:px-8">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full "></div>
          <div>
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded  mb-2"></div>
            <div className="h-4 w-80 bg-gray-200 dark:bg-gray-700 rounded "></div>
          </div>
        </div>
        
        {/* Info card skeleton */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full "></div>
            <div className="flex-1">
              <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded  mb-2"></div>
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded "></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Filtros skeleton */}
        <div className="lg:col-span-1">
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded  mb-3"></div>
                <div className="space-y-2">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded "></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Productos skeleton */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded  mb-2"></div>
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded "></div>
            </div>
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded "></div>
          </div>

          {/* Grid de productos skeleton */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="aspect-square bg-gray-200 dark:bg-gray-700 "></div>
                <div className="p-4">
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded  mb-2"></div>
                  <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded  mb-3"></div>
                  <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded "></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


