"use client";

export default function GiaDeTallasZapatillas({ dataTallasZapatillas }) {
  return (
    <div className="w-full">
      {/* Título de la tabla - Responsive */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 dark:text-white mb-1 sm:mb-2">
          {dataTallasZapatillas?.title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          Encuentra la equivalencia entre tallas USA y europeas (EU) para diferentes marcas
        </p>
      </div>

      {/* Contenedor de la tabla con scroll horizontal - Responsive */}
      <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <table className="w-full min-w-[500px] sm:min-w-[600px] table-auto">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
              {dataTallasZapatillas?.TABLE_HEAD.map((head, index) => (
                <th
                  key={head}
                  className={`px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-center border-b-2 border-gray-200 dark:border-gray-600 ${
                    index === 0 
                      ? "bg-blue-600 text-white font-bold sticky left-0 z-10" 
                      : "text-gray-700 dark:text-gray-300 font-semibold"
                  }`}
                >
                  <div className="text-xs sm:text-sm font-bold uppercase tracking-wide">
                    {head}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataTallasZapatillas?.TABLE_ROWS.map(
              ({ TITLE, ADIDAS, REEBOK, NIKE, CAT, FILA }, index) => (
                <tr 
                  key={index} 
                  className={`transition-colors duration-150 hover:bg-blue-50 dark:hover:bg-gray-700 ${
                    index % 2 === 0 
                      ? "bg-white dark:bg-gray-900" 
                      : "bg-gray-50 dark:bg-gray-800"
                  }`}
                >
                  <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700 sticky left-0 z-10 bg-inherit">
                    <div className="text-center font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 py-1.5 sm:py-2 px-2 sm:px-3 rounded-md text-xs sm:text-sm">
                      {TITLE}
                    </div>
                  </td>
                  <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="text-center font-medium text-gray-800 dark:text-gray-200 py-1.5 sm:py-2 px-2 sm:px-3 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors duration-150 text-xs sm:text-sm">
                      {ADIDAS || "-"}
                    </div>
                  </td>
                  <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="text-center font-medium text-gray-800 dark:text-gray-200 py-1.5 sm:py-2 px-2 sm:px-3 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors duration-150 text-xs sm:text-sm">
                      {REEBOK || "-"}
                    </div>
                  </td>
                  <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="text-center font-medium text-gray-800 dark:text-gray-200 py-1.5 sm:py-2 px-2 sm:px-3 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors duration-150 text-xs sm:text-sm">
                      {NIKE || "-"}
                    </div>
                  </td>
                  <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="text-center font-medium text-gray-800 dark:text-gray-200 py-1.5 sm:py-2 px-2 sm:px-3 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors duration-150 text-xs sm:text-sm">
                      {CAT || "-"}
                    </div>
                  </td>
                  {dataTallasZapatillas?.TABLE_HEAD.includes("Fila") && (
                    <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="text-center font-medium text-gray-800 dark:text-gray-200 py-1.5 sm:py-2 px-2 sm:px-3 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors duration-150 text-xs sm:text-sm">
                        {FILA || "-"}
                      </div>
                    </td>
                  )}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Nota informativa - Responsive */}
      <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-2 sm:gap-3">
          <div className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 bg-blue-100 dark:bg-blue-900 rounded-full flex-shrink-0 mt-0.5">
            <svg
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-600 dark:text-blue-400"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 16v-4M12 8h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs sm:text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1">
              Información importante
            </h4>
            <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 break-words">
              Las tallas mostradas son aproximadas y pueden variar según el modelo. Consulta las medidas específicas del producto antes de tu compra.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
