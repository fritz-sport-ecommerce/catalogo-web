"use client";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo/logo";
import { NavDesktop } from "./Nav/nav-desktop";
import NavTop from "./Nav/nav-top";

import options from "@/components/multilevel-sidebar/multilevel-sidebar.data";
import MultilevelSidebar from "../multilevel-sidebar/multilevel-sidebar.component";
import ProductSearch from "../product-search/product-search";
import ModalDesk from "../modal/Modal";

export function SiteHeader() {
  const [activeSearchDesk, setActiveSearchDesk] = useState<boolean>(false);

  // Estado para el header
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  // Umbral para mostrar el header al subir el scroll
  const scrollUpThreshold = 100;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // Mostrar siempre el header cuando el scroll está en el tope (top: 0)
      if (currentScrollTop === 0) {
        setShowHeader(true);
      } 
      // Si el usuario está desplazándose hacia abajo, ocultar el header
      else if (currentScrollTop > lastScrollTop) {
        setShowHeader(false);
      } 
      // Mostrar el header si el usuario sube más de 'scrollUpThreshold' píxeles
      else if (lastScrollTop - currentScrollTop > scrollUpThreshold) {
        setShowHeader(true);
      }

      // Guardar la posición del scroll actual
      setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollTop]);

  // Estado para el sidebar
  const [open, setOpen] = useState(false);
  const handleSidebarToggle = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  return (
    <>
      {/* Header */}
      <header
        className={`${
          showHeader ? 'translate-y-0' : '-translate-y-full'
        } transition-transform duration-500 ease-in-out border-blue-gray-700/20 dark:border-transparent sticky top-0 z-40 w-full items-center justify-around border-b bg-background`}
      >
        {/* Elementos dentro del header */}
        <div className="xl:hidden w-full">
          <NavTop
            setOpen={setOpen}
            open={open}
            setActiveSearchDesk={setActiveSearchDesk}
            activeSearchDesk={activeSearchDesk}
          />
               
         

        </div>

        <div className="max-w-6/6 mx-auto hidden h-full items-center justify-around space-x-4 sm:space-x-0 xl:flex xl:h-full">
          <NavDesktop
            setActiveSearchDesk={setActiveSearchDesk}
            activeSearchDesk={activeSearchDesk}
          >
            <Logo />
          </NavDesktop>
        </div>

   

     
      </header>

      {/* Sidebar */}
      <MultilevelSidebar
        open={open}
        options={options}
        header={
          <div className="flex w-full justify-center py-3">
            <Logo />
            <svg
              className="absolute right-3 top-3 h-6 w-6 cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              onClick={() => setOpen(!open)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        }
        onToggle={handleSidebarToggle}
      />

         
      {/* <ModalDesk isOpen={activeSearchDesk}  onClose={() => setActiveSearchDesk(false)}>
                  <ProductSearch onClose={() => setActiveSearchDesk(false)}></ProductSearch>

              </ModalDesk> */}
    </>
  );
}
