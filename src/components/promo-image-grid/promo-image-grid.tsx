import React from "react";
import Link from "next/link";

import { Button } from "../ui/button";

interface Props {
  urlImg: string;

  titulo: string;
  subtitulo: string;
  url: string;
}
export default function PromoImageGrid({
  urlImg,
  titulo,
  subtitulo,
  url,
}: Props) {
  return (
    <Link href={url}>
      <div className="relative my-10 flex w-full flex-col hover:opacity-70 hover:mt-5 transition-all items-center justify-center xl:flex ">
        <img src={urlImg} alt="" className=" " width={350} height={400} />
        {/* <div className="mt-1 "> */}
          {/* <h3 className="font-extrabold uppercase xl:text-xl">{titulo}</h3> */}
          {/* <p className="mb-3 mt-2 text-xs">{subtitulo}</p>
        <Button className="mt-1 rounded-none uppercase">Comprar Ahora</Button> */}
        {/* </div> */}
      </div>
    </Link>
  );
}
