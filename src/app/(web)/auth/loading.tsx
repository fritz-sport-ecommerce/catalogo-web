import React from 'react'

export default function loading() {
  return (
    <section className="container mx-auto min-h-screen flex items-center xl:items-start xl:mt-20 justify-center transition-colors">
      <div className="rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black   ">
        {/* Tabs */}
        <div className="flex mb-8">
          <div className="flex-1 py-2 rounded-l-2xl h-10 bg-gray-200 dark:bg-gray-800 mr-1"></div>
          <div className="flex-1 py-2 rounded-r-2xl h-10 bg-gray-200 dark:bg-gray-800 ml-1"></div>
        </div>
        {/* Google Button */}
        <div className="w-full flex items-center justify-center gap-3 border border-gray-300 dark:border-gray-700 rounded-lg py-2 mb-4 bg-gray-100 dark:bg-gray-900 h-12"></div>
        {/* Inputs */}
        <div className="space-y-4">
          <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg w-full"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg w-full"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg w-full"></div>
          {/* Checkbox skeleton */}
          <div className="flex items-center space-x-3 mt-2">
            <div className="h-5 w-5 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-5 w-48 bg-gray-200 dark:bg-gray-800 rounded"></div>
          </div>
          {/* Submit Button */}
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-lg w-full mt-4"></div>
        </div>
      </div>
    </section>
  )
}
