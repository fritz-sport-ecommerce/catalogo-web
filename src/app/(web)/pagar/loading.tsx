const LoadingSpinner = () => (
  <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32   ">
  {/* Order Summary Section */}
  <div className="px-4 pt-8">
    <div className="h-7 w-40 bg-gray-200 rounded mb-2"></div>
    <div className="h-4 w-64 bg-gray-200 rounded mb-8"></div>
    
    {/* Product Item */}
    <div className="mt-8 space-y-3 rounded-lg border px-2 py-4 sm:px-6">
      <div className="flex flex-col items-center py-6 sm:flex-row sm:justify-between">
        <div className="flex w-full items-center space-x-2 sm:space-x-4">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded"></div>
          <div className="flex flex-col w-full space-y-2">
            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
            <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
            <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
            <div className="h-4 w-1/4 bg-gray-200 rounded ml-auto"></div>
          </div>
        </div>
      </div>
    </div> 
    
    {/* Shipping Methods */}
    <div className="mt-8">
      <div className="h-6 w-48 bg-gray-200 rounded mb-5"></div>
      <div className="flex flex-col gap-y-2">
        <div className="h-12 w-full bg-gray-200 rounded-lg"></div>
        <div className="h-12 w-full bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  </div>
  
  {/* Payment Details Section */}
  <div className="mt-10 px-4 pt-8 lg:mt-0">
    <div className="h-7 w-40 bg-gray-200 rounded mb-2"></div>
    <div className="h-4 w-64 bg-gray-200 rounded mb-8"></div>
    
    {/* Form Fields */}
    <div className="grid xl:grid-cols-2 xl:gap-4 gap-y-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-10 w-full bg-gray-200 rounded"></div>
      ))}
    </div>
    
    {/* Radio Buttons */}
    <div className="flex justify-center pt-5 gap-10">
      <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
      <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
    </div>
    
    {/* Location Selects */}
    <div className="mt-5 space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-10 w-full bg-gray-200 rounded-lg"></div>
      ))}
    </div>
    
    {/* Order Summary */}
    <div className="mt-6 space-y-4">
      <div className="flex justify-between">
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
        <div className="h-4 w-10 bg-gray-200 rounded"></div>
      </div>
      <div className="flex justify-between">
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
        <div className="h-4 w-10 bg-gray-200 rounded"></div>
      </div>
      <div className="flex justify-between">
        <div className="h-6 w-20 bg-gray-200 rounded"></div>
        <div className="h-6 w-16 bg-gray-200 rounded"></div>
      </div>
    </div>
    
    {/* Terms Checkbox */}
    <div className="mt-6 flex items-center">
      <div className="h-5 w-5 bg-gray-200 rounded"></div>
      <div className="ml-2 h-4 w-48 bg-gray-200 rounded"></div>
    </div>
    
    {/* Submit Button */}
    <div className="mt-4 h-12 w-full bg-gray-200 rounded"></div>
  </div>
</div>
);

export default LoadingSpinner;