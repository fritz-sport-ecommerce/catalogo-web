import FetchingSkeleton from "@/components/busca-tu-taba/FetchingSkeleton";

const LoadingSpinner = () => (
  <div className="w-full px-4 sm:px-6 lg:px-8">
    <div className="max-w-[1920px] mx-auto">
      <section className="pt-6 lg:pt-8">
        <div className="grid grid-cols-1 gap-x-6 lg:gap-x-8 gap-y-8 items-start lg:grid-cols-[340px_1fr] xl:grid-cols-[380px_1fr]">
          {/* Sidebar Skeleton */}
          <div className="hidden lg:block sticky top-20 space-y-6">
            {/* Botón PDF skeleton */}
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            
            {/* Filtros skeleton */}
            <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-5 md:p-6 shadow-lg">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Main Content - FetchingSkeleton */}
          <div>
            <FetchingSkeleton />
          </div>
        </div>
      </section>
    </div>
  </div>
);

export default LoadingSpinner;
