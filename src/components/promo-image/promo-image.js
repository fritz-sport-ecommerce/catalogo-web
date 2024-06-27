import React from "react";
import Link from "next/link";

import { Button } from "../ui/button";
import { urlForImage } from "@/sanity/lib/image";

export default function PromoImageSec({ bannerhome, bottom }) {
  return (
    <div className="relative my-10 flex  w-full flex-col items-center justify-center xl:block">
      <img
        src={urlForImage(bannerhome.bannerhome?.imgdeskt?.asset._ref).url()}
        alt={bannerhome.bannerhome.desc}
        className="hidden w-[654px] md:w-full xl:block "
      />
      <img
        src={urlForImage(bannerhome.bannerhome?.imgmob?.asset._ref).url()}
        alt={bannerhome.bannerhome.desc}
        className="block  w-[654px] md:w-full xl:hidden "
      />
      {bottom ? (
        <div className="mt-2 flex xl:block flex-col items-center">
          <div className=" uppercase xl:text-2xl">
            {bannerhome.bannerhome.titulo}
          </div>
          <p className="mt-1 text-center xl:text-start text-sm xl:text-normal">
            {bannerhome.bannerhome.description}
          </p>
          <Link href={`${bannerhome.bannerhome.urlbtn}`}>
            <Button className="mt-5 rounded-none uppercase">
              Comprar Ahora
            </Button>
          </Link>
          {/* <Button className="mt-5 rounded-none uppercase">Comprar Ahora</Button> */}
        </div>
      ) : (
        <div className="absolute bottom-5 ml-5 text-white  xl:bottom-16 xl:ml-20">
          <h3 className="font-extrabold uppercase xl:text-3xl">
            {bannerhome.bannerhome.titulo}
          </h3>
          <p className="mt-3">{bannerhome.bannerhome.description}</p>
          <Link href={`${bannerhome.bannerhome.urlbtn}`}>
            <Button className="dark:bg-bg-white mt-5 rounded-none bg-white uppercase text-black dark:text-black">
              Comprar Ahora
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
