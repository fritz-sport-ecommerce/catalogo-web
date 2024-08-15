import { Dispatch, SetStateAction, memo, useEffect, useState } from "react";
import Link from "next/link";

interface IProps {
  setAndler: Dispatch<SetStateAction<boolean>>;
  handleHover: (Boolean: Number) => void;
  activeHoverNavDesktop: Number;
  menuSubmenu: {
    map(arg0: (menulist: any, index: any) => JSX.Element): React.ReactNode;
    img: string;
  };
  dataHeader: {
    menuSubmenu: [{ id: string; titulo: string; url: string }];
  };
}

export default function NavMenuDesktop({
  handleHover,
  setAndler,
  activeHoverNavDesktop,
  dataHeader,
}: IProps) {
  return (
    <div className="bg-blue-white w-full">
      {/* /*---------------------------------*/
      /* Desktop menu and Hover*/
      /* ---------------------------------*/}
      <div className="hidden xl:block">
        <nav>
          <div>
            <div>
              <div>
                <div className="flex items-center justify-around ">
                  {/* logo nav */}
                  <div className=" h-[7rem] lg:block ">
                    <div className="mb-6 mt-4 grid h-full grid-flow-col  p-0 lg:my-0 lg:flex-row lg:px-1   ">
                      {dataHeader.menuSubmenu.map((el, index) => (
                        <Link
                          href={`${el.url}`}
                          className="flex  h-full items-center justify-center px-2 "
                          key={el.id}
                          onClick={() => setAndler(false)}
                          onMouseEnter={() => handleHover(index)}
                          onMouseLeave={() => setAndler(false)}
                        >
                          <div className=" focus:text-brand-900 sm:focus:shadow-outline  inline-flex  items-center  justify-between rounded-md px-2 transition-all duration-500 focus:outline-none">
                            <span
                              className={`laptop:text-lg shrink-0 uppercase tracking-widest  xl:text-xs e ${
                                el.titulo === "DESCARGAR CATALOGO" &&
                                "text-red-500 hover:border-b-2 border-red-500 hover:border-red-500"
                              } ${
                                el.titulo === "TIENDA" && " font-extrabold "
                              } ${
                                activeHoverNavDesktop === index &&
                                el.titulo != "DESCARGAR CATALOGO" &&
                                `border-b-2 border-black dark:border-white`
                              }  2xl:text-base  `}
                            >
                              {el.titulo}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
