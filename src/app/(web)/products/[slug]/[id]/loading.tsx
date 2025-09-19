import React from 'react'

export default function loading() {
  return (
<div className="xl:px-5 mx-auto p-4">
      <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6">
        
        {/* Sección de las imágenes del producto */}
        <div className="container w-full h-full space-y-4 lg:space-y-0 lg:space-x-4 xl:flex">
          {/* Imagen 1 */}
          <div className="w-full h-[28rem] xl:h-[40rem] bg-gray-300 rounded-md    transition-all duration-300 hover:scale-105"></div>
          {/* Imagen 2 */}
          <div className="w-full h-[28rem] xl:h-[40rem] bg-gray-300 rounded-md    transition-all duration-300 hover:scale-105"></div>
        </div>

        {/* Sección de detalles del producto */}
        <div className="flex-1 space-y-4">
          {/* Título del producto */}
          <div className="h-8 bg-gray-300 rounded-md w-3/4   "></div>

          {/* Precio */}
          <div className="h-6 bg-gray-300 rounded-md w-1/4   "></div>

          {/* Tallas */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded-md w-1/3   "></div>
            <div className="flex space-x-2">
              <div className="w-10 h-10 bg-gray-300 rounded-md   "></div>
              <div className="w-10 h-10 bg-gray-300 rounded-md   "></div>
              <div className="w-10 h-10 bg-gray-300 rounded-md   "></div>
              <div className="w-10 h-10 bg-gray-300 rounded-md   "></div>
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded-md w-full   "></div>
            <div className="h-4 bg-gray-300 rounded-md w-3/4   "></div>
            <div className="h-4 bg-gray-300 rounded-md w-full   "></div>
          </div>

          {/* Botón agregar al carrito */}
          <div className="h-12 bg-gray-300 rounded-md w-full   "></div>
        </div>
      </div>
    </div>
  )
}
