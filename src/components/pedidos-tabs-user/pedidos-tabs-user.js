"use client";

import { client } from "@/sanity/lib/client";

import { useSession } from "next-auth/react";
import { groq } from "next-sanity";
import React, { useEffect, useState } from "react";

export default function PedidosTabsUser() {
  const [dataPedidos, setDataPedidos] = useState([]);
  const { data: session } = useSession();
  useEffect(() => {
    if (session?.user.id) {
      client
        .fetch(
          groq`*[_type == "pedidos" && estado != "pendiente" && userId match "${session?.user.id}"] | order(_createdAt desc)`
        )
        .then((result) => {
          setDataPedidos(result);
        });
    }
  }, []);

  const [activeStep, setActiveStep] = React.useState(0);
  const [isLastStep, setIsLastStep] = React.useState(false);
  const [isFirstStep, setIsFirstStep] = React.useState(false);

  const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);
  return (
    <div>
      {dataPedidos.length > 0 && (
        <div className="grid grid-flow-row gap-y-5">
          {dataPedidos.map((el, i) => (
            <div
              key={i}
              className="xl:flex  items-center border-y-[1px] border-blue-gray-300 p-5"
            >
              <div className="w-full pl-5 flex flex-col ">
                <div>
                  <div>
                    <span className="font-bold"> Ultima Modificación </span> :
                    {el._createdAt.split("T")[0]}
                  </div>
                  <div>
                    <span className="font-bold"> Total </span>: S/
                    {el.cart_total}
                  </div>
                  {el.tipoEntrega === "envio" ? (
                    <>
                      <div>
                        <span className="font-bold"> Tipo de Entrega </span> :{" "}
                        <span className="uppercase"> {el.tipoEntrega}</span>
                      </div>
                      <div>
                        <span className="font-bold"> Dirección </span> :{" "}
                        {el.direccion}
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <span className="font-bold"> Tipo de Entrega </span> :{" "}
                        <span className="uppercase">
                          {" "}
                          {el.tipoEntrega} en tienda
                        </span>
                      </div>
                      <div>
                        <span className="font-bold"> Dirección </span> : <br />{" "}
                        Tienda Fritz Sport, Av. Miguel Grau 231, Lima 15001
                      </div>
                    </>
                  )}
                </div>
                <div className="flex flex-col mb-10 gap-10 mt-10 ">
                  <div className="text-start xl:text-xl">
                    Seguimiento de Pedido:
                  </div>
                  {/*  */}
                  <div
                    className={`flex items-center w-full ${
                      el.estado === "porentregar" || "porentregar"
                        ? "text-green-400"
                        : "text-black dark:text-white"
                    } `}
                  >
                    <div
                      className={`border-[2px] flex justify-center items-center ${
                        el.estado === "porentregar" || "porentregar"
                          ? " border-green-300 fill-green-300 "
                          : " dark:border-white dark:fill-white border-black fill-black"
                      }w-10 h-10 text-center rounded-full`}
                    >
                      <svg
                        className="fill-neutral-700 min-w-min transition-all duration-300 cursor-default"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M11.634 9.123a.716.716 0 0 1 .448-.001l1.774.577-.012-6.53a.287.287 0 0 0-.288-.287l-3.431.007a.288.288 0 0 0-.288.288l.007 6.536 1.79-.59Z"
                        ></path>
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M18.708 12.24c.649 0 1.272.095 1.86.276.193.06.396-.08.395-.283l-.008-4.073c-.01-1.575-.538-2.957-1.488-3.907-.912-.903-2.141-1.373-3.572-1.373h-.325c-.16 0-.289.13-.288.289l.018 7.516c0 .23-.115.45-.297.585a.734.734 0 0 1-.644.106l-2.496-.816-2.515.835a.682.682 0 0 1-.643-.106.693.693 0 0 1-.298-.575l-.009-7.532a.288.288 0 0 0-.292-.288l-.323.005c-3.024.01-5.05 2.131-5.05 5.29v.019l.01 7.622c.01 1.527.48 2.832 1.373 3.792.912.98 2.189 1.498 3.687 1.498h.019l4.496-.009c.205 0 .344-.208.279-.402a6.36 6.36 0 0 1-.33-2.027 6.449 6.449 0 0 1 6.441-6.442Z"
                        ></path>
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M21.727 15.18a.72.72 0 0 0-1.019 0l-3.604 3.61-1.488-1.488a.721.721 0 0 0-1.018 1.018l1.998 1.997a.724.724 0 0 0 1.018 0l4.114-4.119a.721.721 0 0 0-.001-1.018Z"
                        ></path>
                      </svg>
                    </div>
                    <span className="ml-10">Envio creado</span>
                  </div>
                  {/*  */}

                  {/* estado entregado  */}
                  {el.estado != "devuelto" ? (
                    <>
                      {el.tipoEntrega === "envio" && (
                        <>
                          <div
                            className={`flex items-center w-full ${
                              el.estado === "porentregar" ||
                              el.estado === "entregado"
                                ? "text-green-400"
                                : "text-black dark:text-white"
                            } `}
                          >
                            <div
                              className={`border-[2px] flex justify-center items-center ${
                                el.estado === "porentregar" ||
                                el.estado === "entregado"
                                  ? " border-green-300 fill-green-300 "
                                  : "dark:border-white dark:fill-white border-black fill-black"
                              } w-10 h-10 text-center rounded-full`}
                            >
                              <svg
                                className="fill-neutral-700 min-w-min transition-all duration-300 cursor-default fill-neutral-400"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  d="M11.005 20.126c-.26-.002-.563-.225-.571-.533a.544.544 0 0 1 .287-.493c.015-.006.025-.018.039-.025a.578.578 0 0 1 .209-.05h.015a.56.56 0 0 1 .557.532.554.554 0 0 1-.536.57Zm9.88-4.52a.753.753 0 0 0-.976-.417l-7.434 2.988a2.074 2.074 0 0 0-1.558-.652c-.014.001-.028.006-.042.006L6.588 6.944a.753.753 0 0 0-.484-.439l-2.081-.609A.75.75 0 0 0 3.6 7.335l1.733.508 4.178 10.318a2.035 2.035 0 0 0-.578 1.476 2.056 2.056 0 0 0 2.056 1.99c.019 0 .037 0 .057-.002a2.052 2.052 0 0 0 1.99-2.058l7.43-2.986a.75.75 0 0 0 .418-.976Z"
                                ></path>
                                <path
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  d="M12.182 10.479c-.564.216-.98.595-1.201 1.096-.23.518-.225 1.133.01 1.729l.642 1.682c.359.926 1.11 1.455 1.967 1.455.268 0 .546-.052.826-.16l2.686-1.04c.564-.214.978-.593 1.2-1.093.228-.518.225-1.134-.01-1.731l-.642-1.682c-.47-1.211-1.613-1.745-2.793-1.296l-2.685 1.04ZM8.836 8.088c.36.918 1.111 1.444 1.966 1.444.267 0 .546-.052.825-.16l2.688-1.03.004-.001c1.167-.46 1.656-1.626 1.187-2.834l-.644-1.683c-.236-.603-.652-1.06-1.172-1.287-.5-.22-1.062-.217-1.619.002l-2.69 1.03c-1.169.46-1.657 1.628-1.188 2.835l.643 1.684Z"
                                ></path>
                              </svg>
                            </div>
                            <span className="ml-10">
                              Preparación para entregar
                            </span>
                          </div>

                          <div
                            className={`flex items-center w-full ${
                              el.estado === "entregado"
                                ? "text-green-400"
                                : "text--white "
                            } `}
                          >
                            <div
                              className={`border-[2px] flex justify-center items-center ${
                                el.estado === "entregado"
                                  ? " border-green-300 fill-green-300 "
                                  : "dark:border-white dark:fill-white border-black fill-black"
                              } w-10 h-10 text-center rounded-full`}
                            >
                              <svg
                                className="fill-neutral-700 min-w-min transition-all duration-300 cursor-default fill-neutral-400"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  d="M18.6 13.16h1.65v1.94c0 .74-.6 1.33-1.33 1.33h-.17c-.25-.86-.93-1.55-1.8-1.8V9.16l2.34 1.03c.58.25.96.83.96 1.47H18.6c-.42 0-.75.34-.75.75 0 .42.33.75.75.75Zm-2.4 5.19c-.55 0-1-.37-1.13-.87-.03-.1-.04-.2-.04-.3 0-.36.16-.68.42-.89.2-.17.46-.27.75-.27s.55.1.75.28a1.163 1.163 0 0 1-.75 2.05ZM8.96 8.22H5.39a.749.749 0 1 1 0-1.5h3.57a.749.749 0 1 1 0 1.5Zm-.74 8.97c0 .03 0 .05-.01.08-.04.61-.54 1.08-1.16 1.08-.63 0-1.15-.51-1.16-1.15v-.02c0-.64.52-1.16 1.16-1.16.65 0 1.17.52 1.17 1.16v.01Zm11.67-8.37-2.94-1.3v-.54c0-1.56-1.27-2.83-2.83-2.83H5.05c-1.55 0-2.8 1.26-2.8 2.8v2.128c0 .167.134.301.3.3.864-.005 3.353-.018 4.29-.018a.749.749 0 1 1 0 1.5c-1.137 0-3.462-.007-4.29-.01a.3.3 0 0 0-.3.3v3.95c0 1.35.96 2.49 2.23 2.76a2.661 2.661 0 0 0 5.13.07h4.03a2.667 2.667 0 0 0 2.56 1.92c1.21 0 2.23-.81 2.55-1.92h.17c1.56 0 2.83-1.27 2.83-2.83v-3.44c0-1.24-.73-2.36-1.86-2.84Z"
                                ></path>
                              </svg>
                            </div>
                            <span className="ml-10">
                              En Camino a ser entregado
                            </span>
                          </div>
                        </>
                      )}
                      <div
                        className={`flex items-center w-full ${
                          el.estado === "entregado"
                            ? "text-green-400"
                            : "text--white "
                        } `}
                      >
                        <div
                          className={`border-[2px] flex justify-center items-center ${
                            el.estado === "entregado"
                              ? " border-green-300 fill-green-300 "
                              : "dark:border-white dark:fill-white border-black fill-black"
                          } w-10 h-10 text-center rounded-full`}
                        >
                          <svg
                            className="fill-neutral-700 min-w-min transition-all duration-300 cursor-default fill-neutral-400"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M12.387 6.81a.728.728 0 0 1 .452 0l.98.322-.008-4.393c0-.16-.13-.288-.288-.288l-1.845.005a.288.288 0 0 0-.287.289l.004 4.395.992-.33Z"
                            ></path>
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M9.024 10.108c1.632-.039 3.139.288 4.406.595 1.08.274 1.937.93 2.457 1.797.096.16.313.21.46.093.172-.137.343-.269.51-.393a3.71 3.71 0 0 1 2.84-.693c.186.03.367-.107.366-.297l-.009-4.75c0-1.316-.355-2.343-1.056-3.034-.662-.653-1.632-1.008-2.822-.989l-.636.007a.288.288 0 0 0-.285.288l.009 5.388c0 .23-.115.452-.298.586a.754.754 0 0 1-.653.106l-1.699-.567-1.709.576a.947.947 0 0 1-.23.03.691.691 0 0 1-.423-.135.723.723 0 0 1-.297-.586V2.744a.288.288 0 0 0-.288-.288h-.7c-1.2 0-2.142.336-2.785.99-.691.69-1.037 1.718-1.037 3.062l.009 4.228c0 .219.235.358.431.26.997-.493 2.116-.855 3.439-.888Z"
                            ></path>
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M20.88 13.398a2.528 2.528 0 0 0-3.304-.242c-.296.222-.593.465-.894.712-.5.41-1.006.821-1.53 1.15.04-.18.062-.365.062-.557 0-1.232-.83-2.272-2.072-2.59-1.189-.293-2.6-.588-4.092-.56-2.114.049-3.661 1.108-5.158 2.133l-.517.352a.719.719 0 1 0 .804 1.195l.526-.359c1.444-.988 2.691-1.842 4.377-1.88 1.304-.026 2.562.231 3.71.515.596.153.982.621.982 1.194 0 .69-.543 1.19-1.292 1.19h-.231a10.98 10.98 0 0 0-.791 0h-.537a.71.71 0 0 0-.686.556.442.442 0 0 0-.013.061c-.005.036-.021.066-.021.103 0 .021.01.038.013.06 0 .027-.01.054-.005.083.007.048.032.088.048.133l.002.006a.714.714 0 0 0 .767.469c.151-.022.31-.025.468-.031h.764l.141.004c.309.011.617.02.924.015 1.718-.035 3.074-1.148 4.27-2.13.285-.233.566-.464.845-.672a1.085 1.085 0 0 1 1.42.107c.203.202.316.475.316.766 0 .291-.113.563-.32.769l-.207.208c-1.416 1.426-2.639 2.659-4.458 3.371-2.631 1.018-5.074.539-7.995-.034-1.188-.234-2.252-.254-3.42-.254a.72.72 0 0 0 0 1.44c1.091 0 2.081.017 3.232.244 1.654.325 3.256.639 4.883.639 1.248 0 2.511-.186 3.823-.693 2.105-.824 3.49-2.221 4.958-3.698l.202-.205c.478-.475.742-1.11.742-1.787a2.5 2.5 0 0 0-.737-1.783Z"
                            ></path>
                          </svg>
                        </div>
                        <span className="ml-10">
                          {el.tipoEntrega === "envio"
                            ? "Entrega en domicilio"
                            : "Listo para recojo"}{" "}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      {" "}
                      <div className={`flex items-center w-full text-red-300`}>
                        <div
                          className={`border-[2px] flex justify-center items-center border-red-300 fill-red-300  w-10 h-10 text-center rounded-full`}
                        >
                          <svg
                            className="fill-neutral-700 min-w-min transition-all duration-300 cursor-default fill-neutral-400"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M12.387 6.81a.728.728 0 0 1 .452 0l.98.322-.008-4.393c0-.16-.13-.288-.288-.288l-1.845.005a.288.288 0 0 0-.287.289l.004 4.395.992-.33Z"
                            ></path>
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M9.024 10.108c1.632-.039 3.139.288 4.406.595 1.08.274 1.937.93 2.457 1.797.096.16.313.21.46.093.172-.137.343-.269.51-.393a3.71 3.71 0 0 1 2.84-.693c.186.03.367-.107.366-.297l-.009-4.75c0-1.316-.355-2.343-1.056-3.034-.662-.653-1.632-1.008-2.822-.989l-.636.007a.288.288 0 0 0-.285.288l.009 5.388c0 .23-.115.452-.298.586a.754.754 0 0 1-.653.106l-1.699-.567-1.709.576a.947.947 0 0 1-.23.03.691.691 0 0 1-.423-.135.723.723 0 0 1-.297-.586V2.744a.288.288 0 0 0-.288-.288h-.7c-1.2 0-2.142.336-2.785.99-.691.69-1.037 1.718-1.037 3.062l.009 4.228c0 .219.235.358.431.26.997-.493 2.116-.855 3.439-.888Z"
                            ></path>
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M20.88 13.398a2.528 2.528 0 0 0-3.304-.242c-.296.222-.593.465-.894.712-.5.41-1.006.821-1.53 1.15.04-.18.062-.365.062-.557 0-1.232-.83-2.272-2.072-2.59-1.189-.293-2.6-.588-4.092-.56-2.114.049-3.661 1.108-5.158 2.133l-.517.352a.719.719 0 1 0 .804 1.195l.526-.359c1.444-.988 2.691-1.842 4.377-1.88 1.304-.026 2.562.231 3.71.515.596.153.982.621.982 1.194 0 .69-.543 1.19-1.292 1.19h-.231a10.98 10.98 0 0 0-.791 0h-.537a.71.71 0 0 0-.686.556.442.442 0 0 0-.013.061c-.005.036-.021.066-.021.103 0 .021.01.038.013.06 0 .027-.01.054-.005.083.007.048.032.088.048.133l.002.006a.714.714 0 0 0 .767.469c.151-.022.31-.025.468-.031h.764l.141.004c.309.011.617.02.924.015 1.718-.035 3.074-1.148 4.27-2.13.285-.233.566-.464.845-.672a1.085 1.085 0 0 1 1.42.107c.203.202.316.475.316.766 0 .291-.113.563-.32.769l-.207.208c-1.416 1.426-2.639 2.659-4.458 3.371-2.631 1.018-5.074.539-7.995-.034-1.188-.234-2.252-.254-3.42-.254a.72.72 0 0 0 0 1.44c1.091 0 2.081.017 3.232.244 1.654.325 3.256.639 4.883.639 1.248 0 2.511-.186 3.823-.693 2.105-.824 3.49-2.221 4.958-3.698l.202-.205c.478-.475.742-1.11.742-1.787a2.5 2.5 0 0 0-.737-1.783Z"
                            ></path>
                          </svg>
                        </div>
                        <span className="ml-10">Cancelado</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="grid grid-columns-1 tailwind w-full p-5 gap-1">
                {el.productos?.map((producto, i) => (
                  <div
                    key={i}
                    className="flex  items-center w-full p-2  border-b-[1px] border-blue-gray-300"
                  >
                    <div>
                      <img src={producto.picture_url} width={56} alt="" />
                    </div>
                    <div className="text-sm">
                      <div className="ml-10 ">
                        <div>{producto.name}</div>
                      </div>
                      {/* <div className="ml-10">
                        <div>{producto.sku}</div>
                      </div> */}
                      <div className="ml-10">
                        <div>
                          {" "}
                          <span className="font-bold">Talla</span> :
                          {producto.talla}
                        </div>
                      </div>
                      <div className="ml-10">
                        <div>
                          {" "}
                          <span className="font-bold">Cantidad</span> : x
                          {producto.cantidad}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
