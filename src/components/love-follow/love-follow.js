// import React from 'react'

// export default function LoveLollow() {
//   return (
//     <div>love-follow</div>
//   )
// }

"use client";
import { ArrowRight, Heart } from "lucide-react";

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
          setDataFollow(el.intereses);

          let result = el.intereses?.find((el) => el === product?.sku);
          setFollows(result);
          setLoadingFollow(false);
        })
        .catch((error) => {
          // setLoadingFollow(false);

          console.log(error);
        });
    } else {
      console.log("error");
    }
  }, [session?.user.id, follows, product.sku]);

  //   console.log(session?.user.id);
  const handlerLove = async (exite, name) => {
    setLoadingFollow(true);
    if (session?.user.id) {
      // let result = user.find((el) => el._id === session?.user.id);
      // console.log(result);
      // console.log(session?.user.id);
      if (exite) {
        client
          .patch(session?.user.id)
          // Ensure that the `reviews` arrays exists before attempting to add items to it
          .setIfMissing({ intereses: [] })
          .append("intereses", [product.sku])
          .commit({ autoGenerateArrayKeys: true })
          .then((resultad) => {
            console.log(resultad);
            let result = resultad.intereses?.find((el) => el === product?.sku);

            toast({
              title: `${name} `,
              description: "Producto Agregado a la lista de Favoritos",
              action: (
                <Link href={"/follows"}>
                  <Button
                    variant={"link"}
                    className="gap-x-5 whitespace-nowrap"
                  >
                    <span>Ver favoritos</span>
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              ),
            });
            setFollows(result);
            setLoadingFollow(false);
          });
      } else {
        setLoadingFollow(true);
        dataFollow.map((items, i) => {
          if (items === product.sku) {
            client
              .patch(session?.user.id)
              .unset([`intereses[${i}]`])
              .commit()
              .then((res) => {
                let result = res.intereses?.find((el) => el === product?.sku);
                toast({
                  title: `${name} `,
                  description: "Eliminado de la lista de Favoritos",
                  action: (
                    <Link href={"/follows"}>
                      <Button
                        variant={"link"}
                        className="gap-x-5 whitespace-nowrap"
                      >
                        <span>Ver favoritos</span>
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </Link>
                  ),
                });
                setFollows(result);
                setLoadingFollow(false);
              })
              .catch((err) => {
                console.error("Delete failed: ", err.message);
              });
          }
        });
      }
    } else {
      setLoadingFollow(false);
    }
  };

  return (
    <>
      {!session?.user.id ? (
        <div
          className={`${
            view && "absolute  xl:left-5 left-1 xl:top-5 top-1"
          }  z-10  bg-transparent `}
        >
          <Link href={"/auth"}>
            <Button
              className={`z-10 hover:bg-transparent bg-transparent ${
                view ? " text-black" : " text-black dark:text-white"
              }  focus:bg-transparent`}
            >
              <Heart
                className={` ${
                  view && "absolute"
                } w-5 h-5 xl:h-auto xl:w-auto bg-transparent  focus:bg-transparent `}
              />
            </Button>
          </Link>
        </div>
      ) : (
        <div
          className={`${
            view &&
            "absolute  xl:left-5 left-1 xl:top-5 top-1 z-10  bg-transparent "
          } `}
        >
          {loadingFollow ? (
            <Button className="z-10 bg-transparent hover:bg-transparent focus:bg-transparent">
              <Heart
                className={`${view ? "w-5 h-5" : "w-7 h-7"}  bg-transparent `}
              />
            </Button>
          ) : (
            <Button
              className="z-10 bg-transparent hover:bg-transparent focus:bg-transparent"
              onClick={() =>
                handlerLove(
                  follows === product.sku ? false : true,
                  product.name
                )
              }
            >
              <Heart
                className={`${
                  view ? "w-5 h-5" : "w-7 h-7"
                }   focus:bg-transparent ${
                  follows === product.sku
                    ? "text-red-900 fill-red-900"
                    : ` text-black ${!view && "dark:text-white"} `
                }`}
              />
            </Button>
          )}
        </div>
      )}
    </>
  );
}
