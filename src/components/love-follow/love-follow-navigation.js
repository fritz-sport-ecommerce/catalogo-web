// import { Heart } from "lucide-react";
// import React from "react";
// import { Button } from "../ui/button";

// export default function LoveFollowNavigation() {
//   return (
//     <Button className=" z-10 hover:bg-blue-gray-600 p-0 bg-transparent  xl:px-2 px-1 py-[1px]">
//       <Heart className="w-5 h-5 xl:h-5 xl:w-5 text-black dark:text-white " />
//     </Button>
//   );
// }

"use client";
import React, { useEffect, useState } from "react";

import { CircleX, Heart } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { SanitySlider } from "@/config/inventory";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { ItemsFollow } from "./items-follow";
import { CartItemsEmpty } from "../cart-items-empty";
import { CartItemsFollows } from "../cart-items-follows";

export default function LoveFollowNavigation() {
  const [open, setOpen] = React.useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [follows, setFollows] = useState({
    intereses: [],
  });
  const { data: session } = useSession();
  const handleOpen = () => setOpen(!open);
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
          console.log(el);

          setFollows(el);

          setLoadingFollow(false);
        })
        .catch((error) => {
          // setLoadingFollow(false);

          console.log(error);
        });
    } else {
      console.log("error");
    }
  }, [session?.user.id]);

  if (loadingFollow && session?.user.id) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900" />
      </div>
    );
  } else {
    return (
      <>
        <div className="h-full container ">
          <div className="grid place-items-center gap-4 ">
            <div>MI LISTA DE FAVORITOS</div>

            {follows.intereses?.length === 0 || !follows.intereses ? (
              <>
                {session?.user.id && (
                  <div className="flex justify-center w-full">
                    <div className="flex flex-col gap-2">
                      <p> ARTÍCULOS</p>
                      <div className="text-center font-normal">
                        Aún no has añadido ningún artículo a tu lista de
                        favoritos. Comienza a comprar y añade tus favoritos.
                      </div>
                      {<CartItemsFollows />}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <></>
            )}
            <div
              className={`h-full  w-full grid ${
                follows.intereses?.length === 0 ? "grid-cols-1" : "grid-cols-2"
              }  gap-2 `}
            >
              {follows.intereses?.map((el, i) => (
                <button onClick={() => setOpen(!open)} key={i}>
                  <ItemsFollow id={follows?._id} sku={el} ind={i}></ItemsFollow>
                </button>
              ))}
            </div>
          </div>
          {!session?.user.id && (
            <div className="space-x-2">
              <div className="flex justify-evenly w-full">
                <Link href={"/auth"}>
                  <Button color="blue-gray" onClick={handleOpen}>
                    Iniciar Session
                  </Button>
                </Link>
                <Link href={"/auth"}>
                  <Button color="blue-gray" onClick={handleOpen}>
                    Regístrate
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
}

// import React from "react";

// export default function LoveFollowNavigation() {
//   return <div>love-follow-navigation</div>;
// }
