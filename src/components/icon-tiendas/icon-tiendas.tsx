"use client";

import { MapPin } from "lucide-react";
import Link from "next/link";

export default function IconTiendas() {
  return (
    <Link
      href="/nuestras-tiendas"
      className="z-header sticky-0 fixed xl:bottom-28 bottom-20 right-5 z-[999] xl:right-16"
      rel="noreferrer"
    >
      <div className="relative mb-[6vh] mr-1 flex h-[50px] cursor-pointer items-center justify-end rounded-r-full pl-1 md:w-28">
        <span className="absolute h-[30px] w-[30px] animate-ping rounded-full bg-blue-600 xl:h-[50px] xl:w-[50px]"></span>

        <div className="z-20 flex h-[30px] w-[30px] items-center justify-center xl:h-[50px] xl:w-[50px]">
          <div className="relative">
          <MapPin className="w-8 h-8 text-blue-600 " />
          </div>
        </div>
      </div>
    </Link>
  );
} 