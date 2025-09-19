const LoadingSpinner = () => (
  <div className="flex flex-col   px-0">

      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white py-8 mb-6">
        <div className="container mx-auto text-center">
          
          <h1 className="text-xl md:text-6xl font-black mb-4"> HASTA 70% OFF </h1>
          {/* <p className="text-xl mb-4">
            Solo productos Fritz Sport con descuentos del 30% o más
          </p> */}
          <div className="text-sm font-medium">
            ... productos encontrados con súper descuentos
          </div>
        </div>
      </div>
     
    <div className="xl:gap-x-2 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 lg:col-span-3 lg:gap-x-8">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="w-full bg-gray-200 dark:bg-gray-700 rounded-md p-4 ">
          <div className="h-96 bg-gray-300 dark:bg-gray-600 rounded-md mb-4"></div>
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-md mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded-md w-3/4"></div>
        </div>
      ))}
    </div>
  </div>
);

export default LoadingSpinner;
