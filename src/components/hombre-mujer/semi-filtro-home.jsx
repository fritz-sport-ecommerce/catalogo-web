"use client";

import React from "react";
import Link from "next/link";
import { urlForImage } from "@/sanity/lib/image";

export default function SemiFiltroHome({ dataSemifiltroHome }) {
  return (
    <div className=" h-full w-full items-start justify-center gap-x-5 xl:flex ">
      <Link href={dataSemifiltroHome.link}>
        <picture className=" h-full  ">
          <img
            src={urlForImage(dataSemifiltroHome.img.asset._ref).url()}
            alt=""
            width={600}
            height={600}
          />
        </picture>
      </Link>
      <div className="flex h-full  items-center justify-center gap-1 xl:items-start xl:gap-x-8  ">
        {dataSemifiltroHome.categorias.map((el) => (
          <Link key={el._key} href={el.link}>
            <div className="mt-3 flex h-full w-full flex-col justify-start xl:mt-0 ">
              <img
                src={urlForImage(el.img.asset._ref).url()}
                alt=""
                width={350}
                height={350}
                className=""
              />
              <div className="flex flex-col  justify-center xl:items-center">
                <h3 className="text-bold py-2 text-center  font-extrabold  capitalize xl:text-2xl">
                  {el.titulo}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
