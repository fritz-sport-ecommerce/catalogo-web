"use client";
import { ArrowRight, Heart, AlertCircle } from "lucide-react";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { client } from "@/sanity/lib/client";

import { groq } from "next-sanity";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "../ui/use-toast";

export default function LoveFollow({ product, view = true }) {
  const { data: session } = useSession();
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [follows, setFollows] = useState();
  const [dataFollow, setDataFollow] = useState([]);
  const [isOutOfStock, setIsOutOfStock] = useState(false);

  // Verificar si el producto está agotado
  useEffect(() => {
    if (product?.stock !== undefined) {
      setIsOutOfStock(product.stock <= 0);
    } else if (product?.tallas) {
      // Si no hay stock global, verificar por tallas
      const hasStock = product.tallas.some(talla => talla.stock > 0);
      setIsOutOfStock(!hasStock);
    }
  }, [product]);

  useEffect(() => {
    setLoadingFollow(true);
    if (session?.user.id) {
      client
        .fetch(
          groq`*[_type == "user" && _id match "${session?.user.id}" ][0] {
        intereses,
        _id
      }`
        )
        .then((el) => {
          setDataFollow(el.intereses || []);
          let result = el.intereses?.find((el) => el === product?.sku);
          setFollows(result);
          setLoadingFollow(false);
        })
        .catch((error) => {
          console.error("Error fetching user follows:", error);
          setLoadingFollow(false);
        });
    } else {
      setLoadingFollow(false);
    }
  }, [session?.user.id, product?.sku]);

  const handlerLove = async (exite, name) => {
    if (!session?.user.id) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para agregar productos a favoritos",
        action: (
          <Link href="/auth">
            <Button variant="link" className="gap-x-2">
              <span>Iniciar sesión</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        ),
      });
      return;
    }

    setLoadingFollow(true);
    try {
      if (exite) {
        // Agregar a favoritos
        const resultad = await client
          .patch(session?.user.id)
          .setIfMissing({ intereses: [] })
          .append("intereses", [product.sku])
          .commit({ autoGenerateArrayKeys: true });

        let result = resultad.intereses?.find((el) => el === product?.sku);
        setFollows(result);
        setDataFollow(resultad.intereses || []);

        toast({
          title: `${name}`,
          description: "Producto agregado a favoritos",
          action: (
            <Link href="/follows">
              <Button variant="link" className="gap-x-2">
                <span>Ver favoritos</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          ),
        });
      } else {
        // Remover de favoritos
        const index = dataFollow.findIndex(item => item === product.sku);
        if (index !== -1) {
          const res = await client
            .patch(session?.user.id)
            .unset([`intereses[${index}]`])
            .commit();

          let result = res.intereses?.find((el) => el === product?.sku);
          setFollows(result);
          setDataFollow(res.intereses || []);

          toast({
            title: `${name}`,
            description: "Producto removido de favoritos",
            action: (
              <Link href="/follows">
                <Button variant="link" className="gap-x-2">
                  <span>Ver favoritos</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ),
          });
        }
      }
    } catch (error) {
      console.error("Error updating follows:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la lista de favoritos",
      });
    } finally {
      setLoadingFollow(false);
    }
  };

  // Si el producto está agotado, mostrar indicador solo en follows
  // if (isOutOfStock && !view) {
  //   return (
  //     <div className="absolute xl:left-5 left-1 xl:top-4 top-1 z-50 bg-transparent">
  //       <div className="flex items-center space-x-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
  //         <AlertCircle className="w-3 h-3" />
  //         <span>Agotado</span>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <>
      {view ? (
        // Estilo para tarjetas de productos (posicionado absolutamente)
        <div className="absolute xl:left-5 left-1 xl:top-4 top-1 z-50 bg-transparent">
          {!session?.user.id ? (
            <Link href="/auth">
              <Button
                className="z-50 hover:bg-transparent bg-white/80 dark:bg-gray-800/80 text-black dark:text-white focus:bg-transparent hover:scale-110 transition-transform duration-200 rounded-full p-2 shadow-lg"
              >
                <Heart className="w-5 h-5 bg-transparent focus:bg-transparent" />
              </Button>
            </Link>
          ) : (
            <>
              {loadingFollow ? (
                <Button className="z-50 bg-white/80 dark:bg-gray-800/80 hover:bg-transparent focus:bg-transparent rounded-full p-2 shadow-lg">
                  <Heart className="w-5 h-5 bg-transparent   " />
                </Button>
              ) : (
                <Button
                  className="z-50 bg-white/80 dark:bg-gray-800/80 hover:bg-transparent focus:bg-transparent hover:scale-110 transition-transform duration-200 rounded-full p-2 shadow-lg"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handlerLove(
                      follows === product.sku ? false : true,
                      product?.name
                    );
                  }}
                >
                  <Heart
                    className={`w-5 h-5 focus:bg-transparent transition-all duration-200 ${
                      follows === product.sku
                        ? "text-red-500 fill-red-500 scale-110"
                        : "text-black dark:text-white hover:text-red-400"
                    }`}
                  />
                </Button>
              )}
            </>
          )}
        </div>
      ) : (
        // Estilo para ProductAddToCart (botón inline)
        <>
          {!session?.user.id ? (
            <Link href="/auth">
              <Button
                variant="outline"
                size="sm"
                className="ml-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-red-500 transition-colors duration-200 p-3"
              >
                <Heart className="w-6 h-6" />
              </Button>
            </Link>
          ) : (
            <>
              {loadingFollow ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 p-3"
                  disabled
                >
                  <Heart className="w-6 h-6   " />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className={`ml-2 transition-colors duration-200 p-3 ${
                    follows === product.sku
                      ? "border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30"
                      : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-red-500"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handlerLove(
                      follows === product.sku ? false : true,
                      product?.name
                    );
                  }}
                >
                  <Heart 
                    className={`w-6 h-6 ${
                      follows === product.sku ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                </Button>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
