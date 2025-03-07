export default function LoadingSpinner() {
  return (
    <div className="p-4 animate-pulse">
      <div className="flex justify-center flex-col w-full items-center">
        <div className="flex gap-4 mb-4">
          <div className="xl:px-4 px-3 py-2 rounded bg-gray-300 w-32 h-10"></div>
          <div className="xl:px-4 px-3 rounded bg-gray-300 w-32 h-10"></div>
        </div>
        <div className="mb-4 xl:flex flex flex-col items-center justify-center xl:flex-row">
          <div className="font-bold w-40 h-6 bg-gray-300"></div>
          <div className="ml-2 p-2 border rounded bg-gray-300 w-32 h-10"></div>
        </div>
      </div>
      <div>
        <div className="w-full rounded h-[70vh] bg-gray-300"></div>
        <div className="my-6">
          <div className="text-2xl font-bold text-center uppercase w-20 h-6 bg-gray-300 mx-auto"></div>
          <ul className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 2xl:mx-auto 2xl:px-20 px-0 gap-y-20 xl:gap-y-0 lg:grid-cols-2 xl:grid-cols-3 2xl:gap-6 mt-6">
            <li className="p-4 border rounded shadow bg-gray-100 dark:bg-black flex flex-col justify-between">
              <div className="text-xl font-bold text-center uppercase w-40 h-6 bg-gray-300 mx-auto"></div>
              <div className="flex justify-center">
                <div className="max-h-[35rem] mt-4 rounded 2xl:max-h-[35rem] bg-gray-300 w-full h-96"></div>
              </div>
              <div className="flex justify-center w-full items-center py-4">
                <div className="xl:text-lg text-md text-center w-48 h-6 bg-gray-300"></div>
              </div>
              <div className="flex justify-around">
                <div className="mt-3 w-20 h-10 bg-gray-300 rounded"></div>
                <div className="mt-3 w-32 h-10 bg-gray-300 rounded"></div>
              </div>
            </li>
            <li className="p-4 border rounded shadow bg-gray-100 dark:bg-black flex flex-col justify-between">
              <div className="text-xl font-bold text-center uppercase w-40 h-6 bg-gray-300 mx-auto"></div>
              <div className="flex justify-center">
                <div className="max-h-[55rem] mt-4 rounded 2xl:max-h-[35rem] bg-gray-300 w-full h-96"></div>
              </div>
              <div className="flex justify-center w-full items-center py-4">
                <div className="xl:text-lg text-md text-center w-48 h-6 bg-gray-300"></div>
              </div>
              <div className="flex justify-around">
                <div className="mt-3 w-20 h-10 bg-gray-300 rounded"></div>
                <div className="mt-3 w-32 h-10 bg-gray-300 rounded"></div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
