const LoadingSpinner = () => (
  <div>
    {/* Hero/Banner Section */}
    <section className="bg-gray-200 h-[90vh] md:h-[70vh] lg:h-[80vh] relative flex justify-center animate-pulse">
      <div className="bg-transparent h-8 w-[40%] md:w-[20%] lg:w-[20%] rounded absolute bottom-5 flex items-center justify-around">
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="bg-gray-300 h-6 w-6 rounded-full"></div>
          ))}
      </div>
    </section>

    {/* Categories Section */}
    <section className="py-12">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 uppercase">
          nuevos ingresos
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {Array(2)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="bg-transparent shadow-md flex flex-col justify-center items-start px-3 animate-pulse md:hidden"
              >
                <div className="bg-gray-300 h-[250px] w-full mb-4 rounded"></div>
                <div className="bg-gray-300 h-6 w-3/4 rounded mb-2"></div>
                <div className="bg-gray-300 h-4 w-1/2 rounded"></div>
              </div>
            ))}

          {Array(4)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="bg-transparent shadow-md flex flex-col justify-center items-start px-3 animate-pulse hidden md:block"
              >
                <div className="bg-gray-300 h-[450px]  xl:h-[300px] 2xl:h-[450px] w-full mb-4 rounded"></div>
                <div className="bg-gray-300 h-6 w-3/4 rounded mb-2"></div>
                <div className="bg-gray-300 h-4 w-1/2 rounded"></div>
              </div>
            ))}
        </div>
      </div>
    </section>

    {/* Products Section */}
    <div className="bg-white h-[300px] md:h-[300px] lg:h-[400px] shadow-md flex flex-col justify-center items-center p-4 animate-pulse"></div>
  </div>
);

export default LoadingSpinner;
