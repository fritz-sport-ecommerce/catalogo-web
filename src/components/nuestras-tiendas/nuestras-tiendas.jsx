"use client";

import React, { useState } from "react";
import Link from "next/link";
import { urlForImage } from "@/sanity/lib/image";
import ModalHorarios from "../modal/modal-horarios";

const dataNuestrasEmpresas = [
  {
    img: "https://lh5.googleusercontent.com/p/AF1QipNc0m8OUrP-oiueHkxwr2q8Rc2Hstqf9rM7uQl5=s450-k-no",
    title: "Miguel Graú ",
    subtitle: "Fritz Sport, Av. Miguel Grau 231, Lima 15001",
    dataHorarios: [
      " Lunes de 09:00 am a 09:00 pm",
      " Martes de 09:00 am a 09:00 pm",
      " Miércoles de 09:00 am a 09:00 pm",
      " Jueves de 09:00 am a 09:00 pm",
      " Viernes de 09:00 am a 09:00 pm",
      " Sábado de 09:00 am a 09:00 pm",
      " Domingo de 09:00 am a 09:00 pm",
    ],
    ubicacion: "https://maps.app.goo.gl/h54ryBi9SqHQkQUW6",
  },
  {
    img: "https://lh5.googleusercontent.com/p/AF1QipMs6zTdg1C_xoBmP2gsXzpMT18dCkjEitH9EIfM=s450-k-no",
    title: "Tumbes ",
    subtitle: "Av. República del Perú 373, 24101",
    dataHorarios: [
      " Lunes de 09:00 am a 07:00 pm",
      " Martes de 09:00 am a 07:00 pm",
      " Miércoles de 09:00 am a 07:00 pm",
      " Jueves de 09:00 am a 07:00 pm",
      " Viernes de 09:00 am a 07:00 pm",
      " Sábado de 09:00 am a 07:00 pm",
      " Domingo de 09:00 am a 07:00 pm",
    ],
    ubicacion: "https://maps.app.goo.gl/iUxXwFKqF2BAEGhC7",
  },
];
export default function NuestrasTiendas({ nuestrasTiendas }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);
  return (
    <div className=" pt-14 md:pt-16">
      <section className="blog body-font mb-20 text-black">
        <div className="container mx-auto  px-5">
          <div className="flex h-2/6 items-center">
            <section className="w-full bg-cover bg-center ">
              <div className="relative flex h-full w-full items-center justify-center ">
                <div className="container absolute mx-auto text-center text-white">
                  <h1 className="mb-6 text-3xl font-bold sm:text-3xl xl:text-5xl">
                    {" "}
                    {nuestrasTiendas.name}
                  </h1>
                </div>
                {/* video desktop */}
                <video
                  muted={true}
                  webkit-playsinline={true}
                  playsInline={true}
                  preload="auto"
                  autoPlay={true}
                  loop={true}
                  className="laptop:h-full hidden  w-[100vw] xl:block"
                >
                  <source
                    src={`https://www.fritzsport.pe/adidas-video.mp4`}
                    type="video/mp4"
                  />
                  <track
                    src="captions_en.vtt"
                    kind="captions"
                    srcLang="en"
                    label="english_captions"
                  />
                  <track
                    src="captions_es.vtt"
                    kind="captions"
                    srcLang="es"
                    label="spanish_captions"
                  />
                </video>
                {/* video mobil */}

                <video
                  muted={true}
                  webkit-playsinline={true}
                  playsInline={true}
                  preload="auto"
                  autoPlay={true}
                  loop={true}
                  className="h-full w-[100vw]  xl:hidden"
                >
                  <source
                    src={`https://www.fritzsport.pe/adidas-video.mp4`}
                    type="video/mp4"
                  />
                  <track
                    src="captions_en.vtt"
                    kind="captions"
                    srcLang="en"
                    label="english_captions"
                  />
                  <track
                    src="captions_es.vtt"
                    kind="captions"
                    srcLang="es"
                    label="spanish_captions"
                  />
                </video>
              </div>
            </section>
          </div>
          {/*  */}
          <h5 className=" text-center text-xl font-semibold text-black dark:text-white sm:mt-16 sm:text-xl xl:mb-32 xl:mt-20 xl:text-3xl">
            {nuestrasTiendas.titulosede}
          </h5>
          <div className="-mx-4 -mb-10 -mt-4 flex flex-wrap px-1 sm:-m-4 sm:px-5">
            {/* Tumbes */}
            {nuestrasTiendas.sedes.map((el, i) => (
              <div
                key={i}
                className="mx-auto mb-6 mt-10 flex max-w-sm flex-col items-center justify-center p-0 md:mb-0 md:w-1/3"
              >
                <div className="relative flex max-w-[24rem] flex-col rounded-xl  bg-clip-border text-gray-700 shadow-md">
                  <div className="relative m-0 overflow-hidden rounded-none bg-transparent bg-clip-border text-gray-700 shadow-none">
                    <img
                      src={urlForImage(el.img.asset._ref).url()}
                      alt="ui/ux review check"
                    />
                  </div>
                  <div className="p-6">
                    <h4 className="block text-center font-sans text-2xl font-semibold leading-snug tracking-normal text-black antialiased dark:text-white">
                      {el.titulosede}
                    </h4>
                    <p className="mt-3 block text-center  font-sans  font-normal leading-relaxed text-black antialiased dark:text-white">
                      {el.direccion}
                    </p>
                  </div>
                  <div className="flex items-center justify-between p-6">
                    <div className="flex w-full justify-around gap-1">
                      <Link
                        href={el.urlubicacion}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <button className=" bg-black p-5 py-2 capitalize  dark:bg-white ">
                          {el.ubicanosboton}
                        </button>
                      </Link>

                      <div className="relative">
                        <ModalHorarios>
                          <div className="xl:p-5 p-1 xl:text-xl">
                            <div className="flex  justify-center text-center">
                              <div>Horarios de Atención</div>
                            </div>{" "}
                            <div className="flex w-full flex-col  items-center justify-center">
                              {el.horarios.map((horario, i) => (
                                <div
                                  key={i}
                                  className="my-2 w-full  border-b-2 text-center"
                                >
                                  {horario}
                                </div>
                              ))}
                            </div>
                          </div>
                        </ModalHorarios>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Miguel Graú */}
          </div>
        </div>
      </section>
    </div>
  );
}
