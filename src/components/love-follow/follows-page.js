"use client";

import React, { useEffect, useState } from "react";
import { Heart, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { ItemsFollow } from "./items-follow";
import { CartItemsFollows } from "../cart-items-follows";

export default function FollowsPage() {
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [follows, setFollows] = useState({
    intereses: [],
  });
  const { data: session } = useSession();
  
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
          setFollows(el || { intereses: [] });
          setLoadingFollow(false);
        })
        .catch((error) => {
          console.error("Error fetching follows:", error);
          setLoadingFollow(false);
        });
    } else {
      setLoadingFollow(false);
    }
  }, [session?.user.id]);

  if (loadingFollow && session?.user.id) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900 dark:border-white" />
      </div>
    );
  }

  return (
    <>
      <div className="h-full container max-w-6xl mx-auto px-4">
        <div className="grid place-items-center gap-6 py-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Heart className="w-6 h-6 text-red-500 fill-red-500" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">MI LISTA DE FAVORITOS</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {follows.intereses?.length || 0} producto{follows.intereses?.length !== 1 ? 's' : ''} en tu lista
            </p>
          </div>

          {/* Estado vacío */}
          {follows.intereses?.length === 0 || !follows.intereses ? (
            <>
              {session?.user.id ? (
                <div className="flex justify-center w-full">
                  <div className="flex flex-col items-center gap-4 text-center max-w-md">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      <Heart className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Tu lista está vacía</h2>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Aún no has añadido ningún artículo a tu lista de favoritos. 
                        Comienza a explorar y añade tus productos favoritos.
                      </p>
                    </div>
                    <Link href="/tienda">
                      <Button className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 px-6 py-3">
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Explorar productos
                      </Button>
                    </Link>
                    <CartItemsFollows />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 text-center max-w-md">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <Heart className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Inicia sesión para ver tus favoritos</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Guarda tus productos favoritos y accede a ellos desde cualquier dispositivo.
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <Link href="/auth">
                      <Button className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 px-6 py-3">
                        Iniciar sesión
                      </Button>
                    </Link>
                    <Link href="/auth">
                      <Button variant="outline" className="px-6 py-3 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800">
                        Registrarse
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Lista de productos favoritos */
            <div className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {follows.intereses?.map((el, i) => (
                  <div key={i} className="group">
                    <ItemsFollow id={follows?._id} sku={el} ind={i} />
                  </div>
                ))}
              </div>
              
              {/* Botón para continuar comprando */}
              <div className="text-center mt-8">
                <Link href="/tienda">
                  <Button variant="outline" className="px-6 py-3 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Continuar comprando
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 