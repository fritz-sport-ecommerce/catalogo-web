"use client";

import React from "react";
import Link from "next/link";
import { urlForImage } from "@/sanity/lib/image";

export default function HombreMujer({ bannerGenero }) {
  return (
    <>
      <div className="mt-20">
        <div className=" h-full w-full  pb-20   xl:flex xl:gap-x-5">
          {bannerGenero.bannergenero.map((el, i) => (
            <Link key={i} href={el.link} className="w-full">
              <div className="relative mt-3 flex h-full w-full justify-center ">
                <img
                  className="w-full "
                  src={urlForImage(el.img.asset._ref).url()}
                  alt=""
                />
                <div className="opacidad-container  absolute flex    h-full w-full items-center justify-center ">
                  <div className="flex w-5/6 items-center justify-center  ">
                    <h5 className="text-4xl font-extrabold text-white xl:text-5xl">
                      {el.titulo}
                    </h5>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
