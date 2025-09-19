
"use client"
import React from "react";
import Link from "next/link";

import { Button } from "../ui/button";
import { urlForImage } from "@/sanity/lib/image";

export default function PromoImageSec({ bannerhome, bottom }: { bannerhome: any, bottom: boolean }) {
  // Check if we have bannerhome data
  if (!bannerhome?.bannerhome) {
    return null;
  }

  const bannerData = bannerhome.bannerhome;
  const desktopImage = bannerData?.imgdeskt;
  const mobileImage = bannerData?.imgmob;

  return (
    <Link href={bannerData?.urlbtn || "#"}>

    <div className="relative xl:my-10 my-10 flex  w-full flex-col items-center justify-center xl:block">
      {desktopImage && (
        <img
          src={urlForImage(desktopImage).url()}
          alt={bannerData?.desc || "Banner desktop"}
          className="hidden w-[654px] md:w-full xl:block "
        />
      )}
      {mobileImage && (
        <img
          src={urlForImage(mobileImage).url()}
          alt={bannerData?.desc || "Banner mobile"}
          className="block  w-[654px] md:w-full xl:hidden "
        />
      )}
      {bottom ? (
        <div className="mt-2 flex xl:block flex-col items-center">
          <div className=" uppercase xl:text-2xl">
            {bannerData?.titulo}
          </div>
          <p className="mt-1 text-center xl:text-start text-sm xl:text-normal">
            {bannerData?.description}
          </p>
        
          {/* <Button className="mt-5 rounded-none uppercase">Comprar Ahora</Button> */}
        </div>
      ) : (
        <div className="absolute bottom-7 ml-5 text-white bot   xl:bottom-16 xl:ml-20">
          <h3 className="font-extrabold uppercase xl:text-3xl">
            {bannerData?.titulo}
          </h3>
          <p className="mt-3">{bannerData?.description}</p>
     
        </div>
      )}
    </div>
    </Link>
  );
}
