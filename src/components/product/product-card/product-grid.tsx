"use client";
import { XCircle } from "lucide-react";

import { SanityProduct } from "@/config/inventory";
import Product from "@/components/product/product-card/product";

// const Loading = () => (
//   // Componente que muestra un esqueleto de carga mientras los productos se están cargando
//   <div className="flex flex-col xl:py-20 py-10 px-0">
//     <div className="xl:gap-x-2  grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 lg:col-span-3 lg:gap-x-8">
//       {Array.from({ length: 8 }).map((_, index) => (
//         <div
//           key={index}
//           className="w-full bg-gray-200 dark:bg-gray-700 rounded-md p-4 animate-pulse"
//         >
//           <div className="h-96 bg-gray-300 dark:bg-gray-600 rounded-md mb-4"></div>
//           <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-md mb-2"></div>
//           <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded-md w-3/4"></div>
//         </div>
//       ))}
//     </div>
//   </div>
// );

interface ProductGridProps {
  products: SanityProduct[];
  start: number;
  generoSku: boolean;
  outlet: boolean | undefined;
  descuentos: any;
  filter: string;
  order: string;
}

const productCache: { [key: string]: SanityProduct[] } = {};

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  start,
  descuentos,
  outlet,
  generoSku,
  filter,
  order,
}) => {
  console.log(products);

  return (
    <div className="flex flex-col w-full">
      {products.length === 0 ? (
        <div className="mx-auto grid h-40 w-full place-items-center rounded-md border-2 border-dashed bg-gray-50 py-10 text-center dark:bg-gray-900">
          <XCircle className="mx-auto h-10 w-10 text-gray-500 dark:text-gray-200" />
          <h1 className="mt-2 p-5 text-xl font-bold tracking-tight text-gray-500 dark:text-gray-200 sm:text-2xl">
            No se encontraron productos
          </h1>
        </div>
      ) : (
        <>
          {/* {verStart != 0 && ( */}
          {/* {loading && <Loading />} */}
          {/* )} */}
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 xl:gap-x-2 xl: 2xl:w-full xl:mx-auto sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 lg:gap-x-8">
            {products.map((product, index) => (
              <Product
                key={index}
                outlet={outlet}
                products={product}
                descuentos={descuentos}
              />
            ))}
          </div>
        </>
      )}
      <div id="load-more-trigger" className="h-20" />
    </div>
  );
};

export default ProductGrid;
