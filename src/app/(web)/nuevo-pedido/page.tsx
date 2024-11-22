"use client"
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';

export default function Page() {
  const { data: session } = useSession();
  return (
    <div className="min-h-screen mt-20 flex flex-col items-center justify-center px-4  relative overflow-hidden">
      {/* Animación de Felicidades */}
      {/* <div className="absolute z-[999] top-0 left-1/2 transform -translate-x-1/2 text-4xl font-bold text-yellow-500 animate-bounce mt-6">
        🎉 ¡Felicidades! 🎉
      </div> */}

      {/* Contenedor principal */}
      <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 text-center max-w-lg">
        {/* Imagen superior */}
        {/* <img
          src="https://cdn.sanity.io/images/ibvmpbc1/production/a3760b5c65cc8385ab8a926be1087cf002f51ec0-2100x900.jpg?fit=max&auto=format"
          alt="Compra exitosa"
          className="mx-auto mb-4 w-24 h-24 md:w-32 md:h-32"
        /> */}
        {/* Mensaje principal */}
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          ¡Gracias por tu compra! 🎉🛍️
        </h1>
        <p className="text-gray-600 mb-6">
          En breve, un asesor se comunicará contigo para completar tu compra y
          atender tu pedido. 📞💬
        </p>

        {/* Resumen del pedido */}
        {/* <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Resumen de tu pedido 🧾
          </h2>
          <ul className="text-gray-600 text-sm">
            <li>✔ Producto: Zapatillas deportivas</li>
            <li>✔ Cantidad: 2 pares</li>
            <li>✔ Total: $120.00</li>
          </ul>
        </div> */}

        {/* Imagen decorativa */}
        <div className="flex justify-center mb-6">
          <img
            src="https://cdn.sanity.io/images/ibvmpbc1/production/eb603a8439d01115ef250eb76483075d58359761-1280x1046.jpg?fit=max&auto=format"
            alt="Atención personalizada"
            className="rounded-lg shadow-md w-64"
          />
        </div>

        {/* Botones */}
        <div className="flex flex-col gap-4">
          <Link href={"/tienda"}>
          <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Volver a la tienda 🛒
          </button>
          </Link>
          <Link href={`/users/${session?.user.id}`}>
          <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            Ver Detalles de Pedido 🧾
          </button>
          </Link>
        </div>
      </div>

  
    </div>
  );
}
