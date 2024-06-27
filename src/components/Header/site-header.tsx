"use client";
import { useState } from "react";
import { Logo } from "@/components/logo/logo";
import { NavNavigation } from "./Nav/nav-navigation";
import NavSearch from "./Nav/nav-search";
import NavTop from "./Nav/nav-top";


export function SiteHeader() {
  const [activeSearchDesk, setActiveSearchDesk] = useState<boolean>(true);

  // console.log(activeSearchDesk)

  return (
    <>
      <header className="border-blue-gray-700/20 dark:border-transparent sticky top-0   z-40 w-full items-center  justify-around border-b bg-background xl:block">
        {/* <Banner className="flex w-full justify-center  bg-black text-base text-white dark:bg-white  dark:text-black">
          30% de Descuento! Sólo por este mes*
        </Banner> */}
        <div className="xl:hidden">
          <NavTop
            setActiveSearchDesk={setActiveSearchDesk}
            activeSearchDesk={activeSearchDesk}
          >
            <NavSearch />
          </NavTop>
        </div>

        <div className=" max-w-6/6 mx-auto hidden h-full items-center justify-around space-x-4   sm:space-x-0 xl:flex xl:h-full">
          <NavNavigation
            setActiveSearchDesk={setActiveSearchDesk}
            activeSearchDesk={activeSearchDesk}
          >
            <Logo />
          </NavNavigation>
        </div>
        <div
          className={`flex  w-full justify-center ${
            activeSearchDesk && "hidden"
          }`}
        >
          <NavSearch />
        </div>
      </header>
    </>
  );
}
