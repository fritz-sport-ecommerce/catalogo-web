export default function OnboardingSkeleton() {
  return (
    <main className="w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Botón PDF skeleton */}
        <div className="flex items-center justify-center py-6">
          <div className="h-12 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg "></div>
        </div>
        
        <section className="min-h-[70vh] flex items-start justify-center py-8 lg:py-12">
          <div className="max-w-5xl w-full">
            {/* Título skeleton */}
            <div className="mb-8 lg:mb-12">
              <div className="h-12 sm:h-14 lg:h-16 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl mx-auto w-3/4 mb-4 "></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto w-1/2 "></div>
            </div>
            
            {/* Cómo funciona skeleton */}
            <div className="mb-8 p-6 sm:p-8 rounded-2xl   border-2 border-gray-200 dark:border-gray-700 shadow-xl">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-48 mb-6 "></div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 "></div>
                    <div className="flex-1 space-y-2 pt-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full "></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 "></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
         
            {/* Filtros skeleton */}
            <div className="flex items-center justify-center">
              <div className="w-full space-y-8">
                {/* Stepper skeleton */}
                <div className="border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-5 md:p-6 shadow-lg">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2 md:gap-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex flex-col items-center gap-2 md:gap-3 w-full text-center rounded-xl px-3 py-4 md:py-5 border-2 border-gray-200 dark:border-gray-700">
                        <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 "></div>
                        <div className="space-y-1 w-full">
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto "></div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-12 mx-auto "></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 h-5 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto "></div>
                </div>

                {/* Paso 1 skeleton */}
                <div className="  border-2 border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-lg">
                  <div className="px-5 md:px-6 py-4 md:py-5 border-b-2 border-gray-100 dark:border-gray-800">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 "></div>
                  </div>
                  <div className="p-5 md:p-6 grid grid-cols-3 gap-3 md:gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex flex-col items-center gap-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 px-4 py-5 md:px-5 md:py-6">
                        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full "></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 "></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
