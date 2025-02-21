
export default function LoadingSpinner() {
  return (
    <main className="w-full px-6 animate-pulse">
      <section aria-labelledby="products-heading" className="flex pb-24 pt-6">
        <div className="flex justify-center w-full">
          <div className="grid md:gap-x-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 xl:gap-x-10 gap-y-5 w-full h-full">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="px-5 py-5 border-[1px] border-gray-300 rounded-xl bg-gray-200 dark:bg-gray-700"
              >
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mx-auto"></div>
                <div className="flex justify-between py-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
                </div>
                <div className="h-96 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="w-full flex justify-center py-3">
                  <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
