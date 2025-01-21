"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Link from "next/link";
import { Edit, Heart, Search, ShoppingBag, X } from "lucide-react";
import { useCart } from "react-use-cart";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo/logo";

import { ThemeToggle } from "@/components/theme-toggle";
// import LoveFollowNavigation from "@/components/love-follow/love-follow-navigation";

interface Props {
  setActiveSearchDesk: Dispatch<SetStateAction<boolean>>;
  activeSearchDesk: Boolean;
  open:Boolean
  setOpen:Dispatch<SetStateAction<boolean>>;
}
export default function NavTop({
 
  setActiveSearchDesk,
  activeSearchDesk,
  setOpen,
  open
}: Props) {
  const [search, setActiveSearch] = useState<boolean>(false);

  const { totalItems } = useCart();
  const [client, setClient] = useState(false);
  useEffect(() => {
    setClient(true);
  }, []);

  return (
    <div className="relative flex items-center justify-around  xl:block ">
      {/* Buscador */}
      <div
        className={`absolute  w-full ${
          search
            ? "translate-y-[0rem] transition delay-150 ease-in"
            : "translate-y-[-25rem] transition delay-150 ease-in"
        } top-0 z-[888] flex h-[20vh]  items-center  justify-center bg-gray-800/80 dark:bg-gray-800/80`}
      >

      </div>
      <div className="xl:hidden">
        <Logo />
      </div>

      <div className="xl:flex xl:w-full  xl:justify-center  ">
        <div>
          <div className="flex items-center xl:space-x-1">
            {/* dark mode */}
            <ThemeToggle />
            {/* <div className="hidden xl:block">
              <Link href={"/follows"}>
                <Button className=" z-10 hover:bg-blue-gray-600 p-0 bg-transparent  xl:px-2 px-1 py-[1px]">
                  <Heart className="w-5 h-5 xl:h-5 xl:w-5 text-black dark:text-white" />
                </Button>
              </Link>
            </div> */}
            {/* icono carrito */}
            {/* <Link href="/carrito">
              <Button size="sm" variant="ghost">
                <ShoppingBag className="h-5 w-5" />
                <span className="ml-2 text-sm font-bold">
                  {client && totalItems}
                </span>
                <span className="sr-only">Cart</span>
              </Button>
            </Link> */}
            {/* icono Buscador */}
            {/* <Button
              className="xl:hidden p-1"
              onClick={() => setActiveSearchDesk(!activeSearchDesk)}
              size="sm"
              variant="ghost"
            >
              <Search className={"h-5 xl:w-5"} />
              <span className="sr-only">Buscar</span>
            </Button>
            <Button
              className="hidden xl:block p-1"
              onClick={() => setActiveSearchDesk(!activeSearchDesk)}
              size="sm"
              variant="ghost"
            >
              <Search className={"h-5 xl:w-5"} />
              <span className="sr-only">Buscar</span>
            </Button> */}
            {/* <LoveFollowNavigation></LoveFollowNavigation> */}

            {/* burger menu */}
            <button className="xl:hidden p-1 " onClick={() => setOpen(!open)}>
              {open ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>

  

            {/* {process.env.NODE_ENV === "development" && (
              <Link href={"/studio"}>
                <Button size={"sm"} variant={"ghost"}>
                  <Edit className="h-5 w-5" />
                </Button>
              </Link>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}
