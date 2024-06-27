"use client";

import { urlForImage } from "@/sanity/lib/image";
import { Button } from "../ui/button";

export default function PaginaEmprende({ emprende }) {
  const dataEmprende = {
    imgPortadaDesktop:
      "https://res.cloudinary.com/dmtq82guq/image/upload/v1711214297/fritz_sport/portada-fritz_c10l0o.jpg",
    imgPortadaMobil:
      "https://res.cloudinary.com/da868wsih/image/upload/v1701370311/fritz-ecommerce/emprende/celular-pt-fritz_z6fpcs.jpg",

    beneficiosTitulo: "Nuestros Beneficios",
    beneficiosGrid: [
      {
        titulo: "- Gana descuentos de hasta 35% en tus compras",
        img: "https://footloose.vtexassets.com/assets/vtex.file-manager-graphql/images/a8092058-5eae-4d09-9df9-4f066ee0a966___ec5fe3c96a0dec59974be71a435545f2.png",
      },
      {
        titulo: "- Productos seleccionados",
        img: "https://footloose.vtexassets.com/assets/vtex.file-manager-graphql/images/a88c40df-d351-486a-b4ed-f4e4b8057126___5208e3b26b5cc34a3de320369aae7fb2.png",
      },
      {
        titulo:
          "- Construye tu red de afiliados y Gana Bonos por Afiliación.  ",
        img: "https://footloose.vtexassets.com/assets/vtex.file-manager-graphql/images/454b1174-e673-4553-94e1-52fc112c15be___155617834f474132c7b99430e289c9b0.png",
      },
      {
        titulo: "- Catálogos personalizados ",
        img: "https://footloose.vtexassets.com/assets/vtex.file-manager-graphql/images/0b7b64c3-d16b-46f3-8020-3bfafbd444c0___53675cfa8bfb06aae8dc4798b959b067.png",
      },
      {
        titulo: "- Participa en sorteos y gana muchos premios.",
        img: "https://footloose.vtexassets.com/assets/vtex.file-manager-graphql/images/23fefe16-7dba-4b6b-a6b6-3c0a489d170b___a463340b403ca93a3c4803137ffd84e6.png",
      },
    ],

    emprendedores: {
      img: "https://res.cloudinary.com/dmtq82guq/image/upload/v1711390389/fritz_sport/web_f619vq_hk4lbz.jpg",
      beneficios: [
        {
          id: "a123512s",
          title: " - Gana descuentos de hasta 35% en tus compras.",
        },
        { id: "a245512s", title: "- Productos seleccionado" },
        {
          id: "a532112s",
          title:
            " - Construye tu red de afiliados y Gana Bonos por Afiliación.",
        },
        { id: "a51212s", title: "- Catálogos personalizados" },
        {
          id: "a55212s",
          title: "- Participa en sorteos y gana muchos premios.",
        },
      ],
      requisitos: [
        {
          id: "a24525512s",
          title: " Cualquier cliente compras mayores a 3 productos",
        },
        {
          id: "a532121512s",
          title: " - Productos seleccionado",
        },
        { id: "a51123212s", title: "- Catálogos personalizados" },
        {
          id: "a551231212s",
          title: "- Tener espíritu emprendedor y voluntad de progreso",
        },
      ],
    },

    mayoristas: {
      img: "https://res.cloudinary.com/dmtq82guq/image/upload/v1711214284/fritz_sport/senor-dos_pjdkhp.jpg",
      beneficios: [
        {
          id: "a123512s",
          title: " - Gana descuentos de mas de 35% en tus compras.",
        },
        { id: "a245512s", title: "- Sin limite de compras" },
        {
          id: "a532112s",
          title: " - Apoyo publicitario para hacer crecer tu red",
        },
        { id: "a51212s", title: "- Guía de tallas y catálogos" },
        {
          id: "a55212s",
          title: "- Participa en sorteos y gana muchos premios.",
        },
      ],
      requisitos: [
        {
          id: "a121233512s",
          title: " - Cualquier cliente compras mayores a 3 productos",
        },
        {
          id: "a24525512s",
          title: " - Tener espíritu emprendedor y voluntad de progreso",
        },
      ],
    },
    pasos: {
      pasosTitle: "Afiliare en 3 simples pasos",
      img: "https://res.cloudinary.com/dmtq82guq/image/upload/v1711214294/fritz_sport/fritz_pngv7m.jpg",
      pasosList: [
        {
          title: "1. Contacta a uno de nuestros asesores",
          subtitle: "Presiona el Botón de: Contactar a un Asesor",
        },
        {
          title: "2. Solicita tu catalogo",
          subtitle: "Realiza tu primera cotización por WhatsApp",
        },
        {
          title: "¡Gana!",
          subtitle: "Comparte tus catálogos y disfruta de tus ganancias.",
        },
      ],
    },
  };
  // src={urlForImage(emprende.portadadeskt.asset._ref).url()}
  return (
    <>
      <div className=" pt-14 md:pt-16">
        <div className="">
          {emprende.portadadeskt.asset._ref && (
            <img
              src={urlForImage(emprende.portadadeskt.asset._ref).url()}
              alt=""
              className="hidden md:block"
            />
          )}
          {emprende.portadamob.asset._ref && (
            <img
              src={urlForImage(emprende.portadamob.asset._ref).url()}
              alt=""
              className="block md:hidden"
            />
          )}
        </div>

        <div>
          <div className=" mx-auto h-full ">
            <div className="draggable h-full w-full">
              <h3 className="pt-20  text-center text-3xl">
                {emprende.titulobeneficios}
              </h3>
              <div className=" mx-auto flex flex-col items-center gap-16 pt-20">
                <div className=" block w-full gap-x-5 pb-20 xl:flex ">
                  {/* Beneficios */}
                  {emprende.benficiosgrid.map((el, i) => (
                    <div
                      key={i}
                      className="shadow-main flex cursor-pointer flex-col items-center gap-3 rounded-3xl bg-white px-8 py-10 dark:bg-black"
                    >
                      <span>
                        <img
                          src={urlForImage(el.img.asset._ref).url()}
                          alt=""
                          className=""
                          width={200}
                        />
                      </span>
                      <p className="laptop:text-xl text-center font-extrabold text-black dark:text-white 2xl:text-lg">
                        {el.titulo}
                      </p>
                    </div>
                  ))}
                </div>
                {/* 
              /*-------------------------------------------*/
                /* ¡Inicia a tu manera y gana! page Emprende*/
                /* --------------------------------------*/}

                {/* ------------------------------ */}
                <div value="Emprendedor" className="">
                  <h4 className="pb-20   text-center text-2xl">
                    {emprende.tituloemprende}
                  </h4>

                  <div>
                    {emprende.emprendemayorista.map((el, i) => (
                      <div key={el.titulo}>
                        <div className="w-full flex justify-center py-8">
                          <div className="text-xl">
                            {i === 0 ? "EMPRENDEDOR" : "MAYORISTA"}
                          </div>
                        </div>

                        <div className="flex flex-col  w-full items-center  xl:flex xl:flex-row">
                          <div className="w-full">
                            <img
                              src={urlForImage(el.img.asset._ref).url()}
                              alt=""
                            />
                          </div>

                          <div className="flex w-full flex-col items-center  text-base  xl:px-5">
                            <div>
                              <div className="my-7  text-center text-3xl font-bold  text-black dark:text-white">
                                {el.Requisitos}
                              </div>

                              <ul className="flex flex-col ">
                                {el.beneficios.map((elm, i) => (
                                  <li
                                    key={i}
                                    className="mt-3 font-semibold  text-black dark:text-white"
                                  >
                                    {elm}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="mt-10">
                              {/*  */}
                              <div className="  text-center text-3xl font-bold  text-black dark:text-white">
                                {el.titulobeneficios}
                              </div>
                              <ul className="flex flex-col ">
                                {el.beneficios.map((el, i) => (
                                  <li
                                    key={i}
                                    className="mt-3 font-semibold  text-black dark:text-white"
                                  >
                                    {el}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ---------------------------------------------------------------- */}

                  <div className="flex flex-col items-center justify-center pt-20 ">
                    <h5 className="pb-20  text-2xl">{emprende.pasos.titulo}</h5>

                    <div className="w-full justify-around xl:flex ">
                      <img
                        src={urlForImage(emprende.pasos.img.asset._ref).url()}
                        alt=""
                        width={600}
                      />

                      <div className="flex flex-col items-start justify-center px-10">
                        {emprende.pasos.afiliate.map((el, i) => (
                          <div key={i} className=" mt-10 flex flex-col">
                            <p className="my-3 text-lg font-bold">
                              {el.titulo}
                            </p>
                            <p className="text-start text-base xl:text-start ">
                              {el.subtitle}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ---------------------------------------------------------------- */}
                  <div className="flex w-full  justify-center pt-20 ">
                    <div className="flex flex-col pb-20">
                      <div>
                        <h6 className="text-center text-3xl">
                          {emprende.pasos.title}
                        </h6>
                      </div>
                      <div className="mt-10 flex h-3/5 w-full justify-between ">
                        {emprende.pasos.empiezaahora.map((el, i) => (
                          <a
                            key={i}
                            className="mr-5"
                            href={`https://api.whatsapp.com/send/?phone=51${el.urlbutton}&text&type=phone_number&app_absent=0`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Button className="text-base rounded-none">
                              {el.textbutton}
                            </Button>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
