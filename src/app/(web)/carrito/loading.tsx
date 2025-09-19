const LoadingSpinner = () => (
<main className="mx-auto max-w-2xl px-4 xl:pt-16 sm:px-6 lg:max-w-7xl lg:px-8   ">
  {/* Title */}
  <div className="h-8 w-48 bg-gray-200 rounded mb-6 sm:h-10 sm:mb-8 xl:mb-12"></div>

  <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
    {/* Cart Items Section */}
    <section className="lg:col-span-7">
      {/* Cart Items List */}
      <div className="divide-y divide-gray-200 border-y border-gray-200 dark:divide-gray-500 dark:border-gray-500">
        {/* Cart Item */}
        <div className="flex py-6 sm:py-10">
          {/* Product Image */}
          <div className="shrink-0">
            <div className="h-24 w-24 rounded-md bg-gray-200 sm:h-48 sm:w-48"></div>
          </div>
          
          {/* Product Details */}
          <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
            <div className="relative justify-between sm:flex sm:gap-x-6 gap-x-0 sm:pr-0">
              <div className="space-y-2">
                {/* Product Title */}
                <div className="h-5 w-48 bg-gray-200 rounded"></div>
                {/* Product Price */}
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                {/* Product Size */}
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </div>
              
              {/* Quantity Selector */}
              <div className="mt-4 sm:mt-0 flex items-center">
                <div className="h-8 w-20 bg-gray-200 rounded"></div>
                {/* Remove Button */}
                <div className="h-5 w-5 bg-gray-200 rounded ml-2"></div>
              </div>
            </div>
            
            {/* Total Price */}
            <div className="mt-4 h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </section>

    {/* Order Summary Section */}
    <section className="sticky bottom-0 mt-16 rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-6 shadow-md dark:border-gray-900 dark:bg-black sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8 xl:top-36">
      {/* Summary Title */}
      <div className="h-6 w-40 bg-gray-200 rounded mb-6"></div>
      
      {/* Summary Details */}
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-600">
          <div className="h-5 w-16 bg-gray-200 rounded"></div>
          <div className="h-5 w-20 bg-gray-200 rounded"></div>
        </div>
      </div>
      
      {/* Checkout Button */}
      <div className="mt-6 h-10 w-full bg-gray-200 rounded"></div>
    </section>
  </div>
</main>
);

export default LoadingSpinner;