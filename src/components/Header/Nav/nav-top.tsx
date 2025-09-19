"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Link from "next/link";
import { Edit, Heart, Search, ShoppingBag, X } from "lucide-react";
import { useCart } from "react-use-cart";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo/logo";

import { ThemeToggle } from "@/components/theme-toggle";
import { LoveFollowNavigation } from "@/components/love-follow/love-follow-navigation";
import { UserProfile } from "@/components/user-profile";
import NavSearch from "./nav-search";
import { useSearch } from "@/context/searchContext";
import { useSession } from "next-auth/react";

interface Props {
  setOpen: (value: boolean) => void;
  open: boolean;
}

export default function NavTop({
  setOpen,
  open,
}: Props) {
  const [search, setActiveSearch] = useState<boolean>(false);
  const [showMobileSearch, setShowMobileSearch] = useState<boolean>(false);
  const { openSearch } = useSearch();

  const { totalItems } = useCart();
  const [client, setClient] = useState(false);
  const { data: session } = useSession();
  const [roleLS, setRoleLS] = useState<string | null>(null);
  useEffect(() => {
    setClient(true);
    if (typeof window !== "undefined") {
      try {
        setRoleLS(localStorage.getItem("rol"));
      } catch {}
    }
  }, []);

  const isCallcenter = (session as any)?.user?.role === "callcenter" || roleLS === "callcenter";

  return (
    <div className="relative flex items-center justify-around xl:block">
      {/* Buscador móvil modal */}
      {showMobileSearch && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm xl:hidden">
          <div className="absolute top-0 left-0 right-0 bg-white dark:bg-gray-900 p-4 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => setShowMobileSearch(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <h2 className="text-lg font-semibold">Buscar productos</h2>
            </div>
            
            {/* Buscador móvil */}
            <div className="mb-4">
              <NavSearch />
            </div>
            
            {/* Sugerencias rápidas móviles */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Búsquedas rápidas
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Forum", icon: "🏃" },
                  { label: "Samba", icon: "⚽" },
                  { label: "Campus", icon: "🎓" },
                  { label: "Air Force", icon: "✈️" },
                  { label: "Gazelle", icon: "✈️" },

                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      window.location.href = `/tienda?search=${item.label.toLowerCase()}`;
                      setShowMobileSearch(false);
                    }}
                    className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {/* <span className="text-lg">{item.icon}</span> */}
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Buscador desktop */}
      <div
        className={`absolute w-full ${
          search
            ? "translate-y-[0rem] transition delay-150 ease-in"
            : "translate-y-[-25rem] transition delay-150 ease-in"
        } top-0  flex h-[20vh] items-center justify-center bg-gray-800/80 dark:bg-gray-800/80`}
      ></div>
      
      <div className="xl:hidden">
        <Logo />
      </div>

      <div>
        <div className="flex items-center xl:space-x-1">
          {/* Icono de favoritos */}
          <div className={`hidden xl:block ${!isCallcenter ? "xl:hidden" : ""}`}>
            <LoveFollowNavigation />
          </div>
          {/* Icono de favoritos móvil */}
          <div className="xl:hidden">
            <LoveFollowNavigation />
          </div>
       
          {/* icono carrito */}
          <Link href="/carrito">
            <Button size="sm" variant="ghost" className={`${!isCallcenter ? "xl:hidden" : ""}`}>
              <ShoppingBag className="h-5 w-5" />
              <span className="ml-2 text-sm font-bold">
                {client && totalItems}
              </span>
              <span className="sr-only">Cart</span>
            </Button>
          </Link>
          {/* dark mode - más visible */}
          <div className="mx-2 flex items-center">
            <ThemeToggle />
          </div>
          {/* user profile */}
          {/* <UserProfile /> */}
          {/* icono Buscador móvil */}
          <Button
            className="xl:hidden p-1"
            onClick={() => setShowMobileSearch(true)}
            size="sm"
            variant="ghost"
          >
            <Search className={"h-5 xl:w-5"} />
            <span className="sr-only">Buscar</span>
          </Button>
          {/* icono Buscador desktop */}
          <Button
            className={`hidden xl:block p-1 ${!isCallcenter ? "xl:hidden" : ""}`}
            onClick={openSearch}
            size="sm"
            variant="ghost"
          >
            <Search className={"h-5 xl:w-5"} />
            <span className="sr-only">Buscar</span>
          </Button>

          {/* burger menu */}
          <Button
            className="xl:hidden p-1"
            onClick={() => setOpen(!open)}
            size="sm"
            variant="ghost"
          >
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
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
