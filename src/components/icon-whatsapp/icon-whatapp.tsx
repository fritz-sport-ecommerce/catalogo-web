"use client";

import Link from "next/link";

import ModalPreguntasFrecuentes from "../modal/modal-preguntas-frecuentes";

interface Props {
  urlWhatsApp: {
    whatsapp: string;
  };
}
// traer cambios
export default function IconWhatapp({ urlWhatsApp }: Props) {

  return (
    <>
      <ModalPreguntasFrecuentes>
        <>
          <div className="bg-white">
            <div className=" overflow-y-scroll xl:h-[60vh] h-[80vh] xl:w-[40vw] w-full xl:p-8 xl:py-5 p-2">
              <div>
     

                <div className="font-extrabold pt-5 pb-2">MEDIOS DE PAGO</div>
                <p className="text-xs xl:text-base ">
                  Contamos con diversos medios de pago. - Pago con tarjeta de
                  crédito o débito al finalizar tu compra en el carrito. Visa /
                  Mastercard / AMEX / Dinners.
                </p>
              </div>
              <div>
                <div className="font-extrabold pt-5 pb-2">
                  ¿CUÁNTO DEMORA EN LLEGAR MI PEDIDO?
                </div>
                <p className="text-xs xl:text-base">
                  De 3 hasta 10 días hábiles según el destino de entrega. -
                  Entregas de 5 a 7 días hábiles: Cercado de lima, Magdalena,
                  San Miguel, Jesús María, Lince, Pueblo Libre, Miraflores, San
                  Borja, Chorrillos, Callao, Barranco, Surquillo, Surco, Breña,
                  San Luis, San Isidro, Santa Anita, La Victoria, Ate, La
                  Molina, Carabayllo, Comas, Independencia, Los Olivos, San
                  Martín de Porres, Ventanilla (Hasta Refinería), Rímac, San
                  Juan de Miraflores y Callao. - Entregas de 7 a 10 días
                  hábiles: Provincias del País. - Recojos en tienda de 3 a 5
                  días hábiles.
                </p>
                <p className="text-xs xl:text-base">
                  Nuestros tiempos pueden variar según coyunturas y casos
                  extraordinarios. Los días hábiles son considerados de Lunes a
                  Viernes, no cuentan fines de semana ni feriados. Atención al
                  cliente:{" "}
                  <a
                    href="https://api.whatsapp.com/send/?phone=51983478551&text&type=phone_number&app_absent=0"
                    target="_blank"
                    className="text-green-300"
                  >
                    consultas
                  </a>
                </p>
              </div>
              <div>
                <div className="font-extrabold pt-5 pb-2">
                  ¿SI COMPRO CON EL MÉTODO RECOJO EN TIENDA PUEDO IR HOY MISMO?
                </div>
                <p className="text-xs xl:text-base">
                  La opción de recojo en tienda para una compra por
                  www.fritzsport.pe, recibirás una llamada cuando tu pedido esté
                  listo para que puedes pasar a recoger el producto.Cualquier detalle
                  adicional por favor comunícate con
                  <a
                    href="https://api.whatsapp.com/send/?phone=51983478551&text&type=phone_number&app_absent=0"
                    target="_blank"
                    className="text-green-300 ml-2"
                  >
                    consultas
                  </a>
                </p>
              </div>
              <div>
                <div className="font-extrabold pt-5 pb-2">
                  CAMBIOS Y DEVOLUCIONES
                </div>
                <p className="text-xs xl:text-base">
                  Cuentas con 7 días para poder realizar cambio y/o devoluciones
                  posteriores a la entrega. Atención al cliente:{" "}
                  <a
                    href="https://api.whatsapp.com/send/?phone=51983478551&text&type=phone_number&app_absent=0"
                    target="_blank"
                    className="text-green-300 ml-2"
                  >
                    consultas
                  </a>
                </p>
              </div>
              <div>
                <div className="font-extrabold pt-5 pb-2">
                  ¿TODOS SUS PRODUCTOS SON 100% ORIGINALES?
                </div>
                <p className="text-xs xl:text-base">
                  Sí, trabajamos directamente con las marcas globales para
                  ofrecerles nuestros productos en calidad y precio retail de
                  las marcas.
                </p>
              </div>
              <div>
                <div className="font-extrabold pt-5 pb-2">
                  ¿TODOS LOS PRODUCTOS DE TIENDA SE ENCUENTRAN EN WEB?
                </div>
                <p className="text-xs xl:text-base">
                  La web contiene todos los productos de nuestras marcas.
                  Cualquier detalle estamos a tu disposición en
                  <a
                    href="https://api.whatsapp.com/send/?phone=51983478551&text&type=phone_number&app_absent=0"
                    target="_blank"
                    className="text-green-300 ml-2"
                  >
                    Preguntas
                  </a>
                </p>
              </div>
              <div>
                <div className="font-extrabold pt-5 pb-2">
                  ¿POR QUÉ MI COMPRA FUE CANCELADA?
                </div>
                <p className="text-xs xl:text-base">
                  Si tu compra fuera cancelada, por favor comunícate con
                  <a
                    href="https://api.whatsapp.com/send/?phone=51983478551&text&type=phone_number&app_absent=0"
                    target="_blank"
                    className="text-green-300 ml-2"
                  >
                    consulta sobre tu pedido
                  </a>{" "}
                  para que te puedan brindar mayor detalle.
                </p>
              </div>
            </div>
          </div>
        </>
      </ModalPreguntasFrecuentes>
      <Link
        href="/emprende"
        className="z-header  sticky-0 fixed bottom-20 left-4 z-[999] flex items-center justify-center xl:bottom-[80px] xl:left-16 "
        rel="noreferrer"
      >
        <div className=" relative mb-[6vh] mr-1 flex  h-[50px] cursor-pointer  items-center  justify-end rounded-r-full    pl-1 md:w-10">
          <span className="absolute h-[30px] w-[30px] animate-ping rounded-full bg-black  dark:bg-white xl:h-[50px] xl:w-[50px]"></span>
          <div className="flex flex-col items-center justify-center xl:h-[50px] xl:w-[50px] xl:justify-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              className="h-8 w-8 stroke-orange-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
              />
            </svg>
            <span className=" hidden text-orange-500 xl:block xl:text-sm font-semibold">
              Emprende
            </span>
          </div>
        </div>
      </Link>
      <Link
        href={`https://api.whatsapp.com/send/?phone=51983478551&text&type=phone_number&app_absent=0`}
        target="_blank"
        className="z-header sticky-0 fixed bottom-52 right-5 z-[999] xl:right-16"
        rel="noreferrer"
      >
        <div className=" relative mb-[6vh] mr-1  flex h-[50px]  cursor-pointer  items-center  justify-end  rounded-r-full pl-1 md:w-28">
          <span className="absolute h-[30px] w-[30px] animate-ping rounded-full bg-green-600 xl:h-[50px] xl:w-[50px]"></span>

          <svg
            className="z-20 h-[30px] w-[30px] xl:h-[50px] xl:w-[50px]  "
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_21_26)">
              <circle cx="15.5" cy="15.5" r="11.5" fill="white" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.2219 0.578953C7.26327 0.578953 0.789474 7.05455 0.789474 15.0155C0.789474 18.1727 1.80764 21.1007 3.53846 23.4773L1.73964 28.841L7.28864 27.0675C9.57093 28.5782 12.2945 29.4522 15.2303 29.4522C23.189 29.4522 29.6628 22.9764 29.6628 15.0157C29.6628 7.05481 23.189 0.579191 15.2303 0.579191L15.2219 0.578953ZM11.1916 7.91206C10.9117 7.24163 10.6995 7.21624 10.2754 7.199C10.131 7.19062 9.97011 7.18224 9.79171 7.18224C9.23999 7.18224 8.66314 7.34344 8.31521 7.69986C7.89112 8.13268 6.83893 9.14252 6.83893 11.2135C6.83893 13.2844 8.34921 15.2873 8.55275 15.5676C8.76491 15.8473 11.4971 20.1588 15.7394 21.916C19.0569 23.2909 20.0413 23.1635 20.7963 23.0023C21.8993 22.7647 23.2824 21.9496 23.6303 20.9653C23.9783 19.9806 23.9782 19.1404 23.8762 18.9622C23.7745 18.784 23.4943 18.6824 23.0702 18.4699C22.6461 18.2577 20.5841 17.2392 20.1938 17.1034C19.8119 16.9592 19.4472 17.0103 19.1589 17.4177C18.7516 17.9863 18.3529 18.5636 18.0303 18.9114C17.7758 19.183 17.3598 19.217 17.0121 19.0726C16.5454 18.8776 15.2389 18.4189 13.6267 16.9846C12.3793 15.873 11.5309 14.4897 11.285 14.0739C11.0388 13.6497 11.2596 13.4032 11.4545 13.1742C11.6667 12.911 11.8702 12.7244 12.0824 12.4782C12.2945 12.2322 12.4133 12.1047 12.5491 11.8161C12.6935 11.5361 12.5915 11.2475 12.4897 11.0353C12.3879 10.823 11.5395 8.75208 11.1916 7.91206Z"
                fill="#67C15E"
              />
            </g>
            <defs>
              <clipPath id="clip0_21_26">
                <rect
                  width="28.8733"
                  height="28.8733"
                  transform="translate(0.789474 0.578953)"
                />
              </clipPath>
            </defs>
          </svg>
        </div>
      </Link>
    </>
  );
}
//
