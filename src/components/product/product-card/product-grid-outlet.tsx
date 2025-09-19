"use client";
import { XCircle } from "lucide-react";
import { SanityProduct } from "@/config/inventory";
import ProductOutlet from "@/components/product/product-outlet";

interface ProductGridOutletProps {
  products: SanityProduct[];
  start: number;
  generoSku: boolean;
  outlet: boolean | undefined;
  descuentos: any;
  filter: string;
  order: string;
}

const ProductGridOutlet: React.FC<ProductGridOutletProps> = ({
  products,
  start,
  descuentos,
  outlet,
  generoSku,
  filter,
  order,
}) => {
  return (
    <div className="flex flex-col w-full">
      {products.length === 0 ? (
        <div className="mx-auto grid h-40 w-full place-items-center rounded-md border-2 border-dashed bg-gray-50 py-10 text-center dark:bg-gray-900">
          <XCircle className="mx-auto h-10 w-10 text-gray-500 dark:text-gray-200" />
          <h1 className="mt-2 p-5 text-xl font-bold tracking-tight text-gray-500 dark:text-gray-200 sm:text-2xl">
            No se encontraron productos en outlet
          </h1>
          <p className="text-gray-400 mt-2">
            Intenta ajustar los filtros o vuelve más tarde para ver nuevas ofertas
          </p>
        </div>
      ) : (
        <>
          {/* Información de productos encontrados */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center bg-red-100 text-red-800 px-4 py-2 rounded-full">
              <span className="font-bold">🔥 {products.length} productos con súper descuentos encontrados</span>
            </div>
          </div>

          {/* Grid de productos */}
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 xl:gap-x-4 xl:gap-y-8 2xl:w-full xl:mx-auto sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 lg:gap-x-8">
            {products.map((product, index) => (
              <ProductOutlet
                key={`${product._id}-${index}`}
                products={product}
              />
            ))}
          </div>

          {/* Mensaje motivacional */}
          {/* <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-2xl shadow-xl max-w-2xl mx-auto">
              <h3 className="text-xl font-bold ">¡No te pierdas estas ofertas!</h3>
              <p className="text-sm opacity-90">
                Productos Fritz Sport con descuentos del 30% o más. Stock limitado.
              </p>
            </div>
          </div> */}
        </>
      )}
      {/* <div id="load-more-trigger" className="h-20" /> */}
    </div>
  );
};

export default ProductGridOutlet;