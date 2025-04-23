"use client";

import { useState } from "react";
import Link from "next/link";

import CarouselProductRelacionados from "../carousel-product/carousel-product-relacionados";
import { Button } from "../ui/button";
import Cabecera from "./cabecera";
import CarouselProductTabs from "./carousel-product-tabs";
import { ProductSliderTab } from "./product-slider-tab";

export default function MainTab({ dataCabeceraTab, dataProductTab }) {
  const [dataTab, setDataTab] = useState(dataProductTab.productosAll);
  const [genero, setGenero] = useState("tienda");
  const handler = (value) => {
    switch (value) {
      case "Hombre":
        setDataTab(dataProductTab.productosHombre);
        setGenero("hombre");
        break;
      case "Mujer":
        setDataTab(dataProductTab.productosMujer);
        setGenero("mujer");

        break;
      case "Niños":
        setDataTab(dataProductTab.productosNinos);
        setGenero("niños");

        break;
      case "All":
        setDataTab(dataProductTab.productosAll);
        setGenero("tienda");
        break;
    }
  };

  return (
    <div className="mt-20  flex h-full w-full justify-center">
      <div className="flex  flex-col ">
        <Cabecera dataCabeceraTab={dataCabeceraTab} handler={handler} />
        <CarouselProductRelacionados nuevo={true} products={dataTab} />
        <div className="mt-5 flex w-full justify-center">
          <Link
            href={`/catalogo${genero === "tienda" ? `` : `?genero=${genero}`}`}
          >
            <Button className="uppercase">Ver Mas</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
