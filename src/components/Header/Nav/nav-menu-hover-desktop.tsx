import { UrlObject } from "url";
import React, { Dispatch, SetStateAction } from "react";
import Link from "next/link";

interface IProps {
  setAndler: Dispatch<SetStateAction<boolean>>;
  hoverMenu: {
    map(arg0: (menulist: any, index: any) => JSX.Element): React.ReactNode;
    img: string;
  };
  andler: boolean;
}
export default function NavMenuHoverDesktop({
  andler,
  setAndler,
  hoverMenu,
}: IProps) {
  return (
    <button
      id="navMenuDesktop"
      className={`absolute  ${
        andler && hoverMenu ? "flex" : "hidden"
      }  z-50 w-[100vw]  flex-col  items-center   border-b-[1px] border-t-0 border-blue-gray-300 dark:border-transparent justify-center   bg-white  dark:bg-background xl:top-[110px]   2xl:top-[110px] `}
      onMouseEnter={() => setAndler(true)}
      onMouseLeave={() => setAndler(false)}
    >
      <div className="container grid w-full grid-flow-col">
        {hoverMenu &&
          hoverMenu.map((menulist, index) => (
            <div key={index} className="p-5 ">
              {/* <ul>
                {menulist.img && (
                  <li>
                    <div className=" w-auto ">
                      <img
                        src="https://brand.assets.adidas.com/image/upload/f_auto,q_auto,fl_lossy/esPE/Images/Originals_pe_tcm202-1056773.jpg"
                        alt="asdasd"
                        className="max-h-[400px]"
                      />
                    </div>
                  </li>
                )}
              </ul> */}
              {menulist.categoria && (
                <ul className="mt-2 grid grid-cols-1 justify-items-start gap-y-3">
                  {menulist.categoria.map(
                    (
                      el: {
                        url: string | UrlObject;
                        title:
                          | string
                          | number
                          | boolean
                          | React.ReactElement<
                              any,
                              string | React.JSXElementConstructor<any>
                            >
                          | React.ReactFragment
                          | React.ReactPortal
                          | null
                          | undefined;
                      },
                      i: React.Key | null | undefined
                    ) => (
                      <li key={i}>
                        <Link
                          href={`${el.url}`}
                          className={` border-b-[1px] border-transparent transition ease-out  hover:border-b-[1px] hover:border-black dark:hover:border-white xl:text-[0.90rem] `}
                        >
                          <span
                            className={`${
                              i === 0 && "text-base font-bold"
                            }  text-black dark:text-white`}
                          >
                            {el.title}
                          </span>
                        </Link>
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>
          ))}
      </div>
    </button>
  );
}
