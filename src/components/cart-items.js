"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { urlForImage } from "@/sanity/lib/image";
import { X } from "lucide-react";
import { useCart } from "react-use-cart";
import { useToast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CartItemsEmpty } from "@/components/cart-items-empty";
import RoleContext from "@/context/roleContext";

export function CartItems() {
  const [clientState, setClientState] = useState(false);
  const { toast } = useToast();
  const { items, removeItem } = useCart();
  const { userRole } = useContext(RoleContext);
  const [invalidItems, setInvalidItems] = useState({}); // {id: {reason, newPrice}}
  const [itemsToRemove, setItemsToRemove] = useState([]); // [{id, delay}]

  useEffect(() => {
    setClientState(true);
  }, []);

  // Eliminar productos después del delay
  useEffect(() => {
    if (itemsToRemove.length > 0) {
      const timer = setTimeout(() => {
        itemsToRemove.forEach(({ id }) => {
          removeItem(id);
        });
        setItemsToRemove([]);
        setInvalidItems({});
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [itemsToRemove, removeItem]);

  // Validación de stock y precio en carrito
  useEffect(() => {
    if (!clientState || items.length === 0) return;
    console.log("[CARRITO] Validando productos:", items.length);
    const validateCart = async () => {
      // Agrupa por SKU
      const skus = [...new Set(items.map((item) => item.objectID))];
      console.log("[CARRITO] SKUs a validar:", skus);
      const res = await fetch("/api/valid-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products: skus.map((sku) => {
            const prod = items.find((i) => i.objectID === sku);
            return {
              sku,
              empresa: prod.empresa,
              genero: prod.genero,
              marca: prod.marca,
              tipo: prod.tipo,
            };
          }),
          ciudad: "LIMA",
        }),
      });
      const validProducts = await res.json();
      console.log("[CARRITO] Respuesta API:", validProducts);
      let invalid = {};
      let itemsParaEliminar = [];
      for (const item of items) {
        const valid = validProducts.find((p) => p.sku === item.objectID);
        if (!valid) {
          // Producto eliminado
          invalid[item.id] = { reason: "eliminado" };
          itemsParaEliminar.push(item.id);
          toast({
            title: "Producto eliminado",
            description: `${item.name} ya no está disponible y será eliminado del carrito en 4 segundos.`,
          });
          continue;
        }
        // Stock por talla
        const tallaApi = valid.tallas.find((t) => t.talla === item.talla);
        if (!tallaApi) {
          invalid[item.id] = { reason: "talla no disponible" };
          itemsParaEliminar.push(item.id);
          toast({
            title: "Talla no disponible",
            description: `${item.name} (${item.talla}) ya no está disponible y será eliminado del carrito en 4 segundos.`,
          });
          continue;
        }
        if (tallaApi.stock < item.quantity) {
          invalid[item.id] = { reason: "sin stock", stockDisponible: tallaApi.stock };
          itemsParaEliminar.push(item.id);
          toast({
            title: "Stock insuficiente",
            description: `${item.name} (${item.talla}) ya no tiene stock suficiente y será eliminado del carrito en 4 segundos.`,
          });
          continue;
        } else if (tallaApi.price && tallaApi.price !== item.price) {
          // Si la API retorna el precio actualizado por talla
          invalid[item.id] = { reason: "price", newPrice: tallaApi.price };
          toast({
            title: "Precio actualizado",
            description: `${item.name} (${item.talla}) cambió de precio.`,
          });
        }
      }
      console.log("[CARRITO] Productos inválidos:", invalid);
      setInvalidItems(invalid);
      if (itemsParaEliminar.length > 0) {
        setItemsToRemove(itemsParaEliminar.map(id => ({ id, delay: 4000 })));
      }
    };
    validateCart();
    // eslint-disable-next-line
  }, [clientState, items]);

  const deleteProduct = (product) => {
    if (userRole === "mayorista") {
      let itemsMayorista = items.filter(
        (item) => item.objectID === product.objectID
      );

      itemsMayorista.map((item) => {
        removeItem(item.id);
      });
    } else {
      removeItem(product.id);
    }
  };
  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <>
      {clientState && (
        <div role="list" className="divide-y divide-gray-100 dark:divide-gray-800">
          {items.length === 0 && <CartItemsEmpty />}
          {items.map((el) => (
            <div
              key={el.id}
              className={`group relative p-6 transition-all duration-200 ${
                invalidItems[el.id] 
                  ? "bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500" 
                  : "hover:bg-gray-50 dark:hover:bg-gray-900/50"
              }`}
            >
              {/* Badge de estado si hay problemas */}
              {invalidItems[el.id] && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    {invalidItems[el.id]?.reason === "sin stock" && "Sin stock"}
                    {invalidItems[el.id]?.reason === "talla no disponible" && "Talla no disponible"}
                    {invalidItems[el.id]?.reason === "eliminado" && "Eliminado"}
                    {invalidItems[el.id]?.reason === "stock" && "Sin stock"}
                    {invalidItems[el.id]?.reason === "price" && "Precio actualizado"}
                    {invalidItems[el.id]?.reason === "precio cambiado" && "Precio actualizado"}
                  </div>
                </div>
              )}

              <div className="flex gap-6">
                {/* Imagen del producto */}
                <div className="shrink-0">
                  <div className="relative">
                    {el?.image && (
                      <img
                        className="h-24 w-24 sm:h-32 sm:w-32 lg:h-40 lg:w-40 rounded-xl border-2 border-gray-200 dark:border-gray-700 object-cover object-center shadow-sm group-hover:shadow-md transition-shadow duration-200"
                        src={urlForImage(el?.image).url()}
                        width={160}
                        alt={el.name}
                      />
                    )}
                    {/* Overlay si hay problemas */}
                    {invalidItems[el.id] && (
                      <div className="absolute inset-0 bg-red-500 bg-opacity-20 rounded-xl flex items-center justify-center">
                        <div className="bg-red-500 text-white p-2 rounded-lg text-xs font-bold">
                          ⚠️
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Información del producto */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col h-full">
                    {/* Header con nombre y botón eliminar */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 min-w-0 pr-4">
                        <Link
                          href={`/products/${el.slug}/${el.objectID}`}
                          className="group/link"
                        >
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover/link:text-blue-600 dark:group-hover/link:text-blue-400 transition-colors duration-200 line-clamp-2">
                            {el.name}
                          </h3>
                        </Link>
                        
                        {/* Información básica */}
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Talla:</span>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                              {el.talla}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Cantidad:</span>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                              {el.quantity}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Botón eliminar */}
                      <Button
                        onClick={() => deleteProduct(el)}
                        variant="outline"
                        size="sm"
                        className="border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 hover:border-red-500 dark:hover:border-red-600 transition-all duration-200"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Precios */}
                    <div className="flex-1 flex flex-col justify-end">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Precio unitario:
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatPrice(invalidItems[el.id]?.newPrice || el.price)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                          <span className="text-base font-semibold text-gray-900 dark:text-white">
                            Subtotal:
                          </span>
                          <span className="text-lg font-bold text-green-600 dark:text-green-400">
                            {formatPrice(el.itemTotal)}
                          </span>
                        </div>
                      </div>

                      {/* Botón ver producto si hay problemas */}
                      {invalidItems[el.id] && (
                        <div className="mt-3">
                          <Link href={`/products/${el.slug}/${el.objectID}`}>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="w-full border-2 border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-600 hover:border-orange-500 dark:hover:border-orange-600"
                            >
                              Ver producto actualizado
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mensaje de eliminación automática */}
              {itemsToRemove.some(item => item.id === el.id) && (
                <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
                  <p className="text-sm text-red-800 dark:text-red-200 text-center">
                    Este producto será eliminado automáticamente en unos segundos...
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
