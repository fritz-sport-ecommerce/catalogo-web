"use client";
import React, { useState, useEffect } from "react";
import HeaderSearchBar from "./HeaderSearchBar";
import HeaderNavMenu from "./HeaderNavMenu";
import HeaderActions from "./HeaderActions";
import HeaderSubMenu from "./HeaderSubMenu";
import { Logo } from "@/components/logo/logo";
import { ThemeToggle } from "../theme-toggle";
import { Search } from "lucide-react";
import ProductSearch from "../product-search/product-search";
import MultilevelSidebar from "../multilevel-sidebar/multilevel-sidebar.component";
import { useSession } from "next-auth/react";

const HeaderMain = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { data: session } = useSession();

  // Determinar si el usuario tiene rol desde la sesión
  const hasRole = !!(session?.user && (session.user as any).role);

  // Opciones del sidebar para usuarios sin rol (no autenticados)
  const optionsNoRole = [
    {
      id: 9001,
      title: "Catálogo",
      icon: "",
      hideBorder: false,
      disabled: false,
      to: "/pdf",
    },
    {
      id: 9002,
      title: "Emprende",
      icon: "",
      hideBorder: false,
      disabled: false,
      to: "/emprende",
    },
    {
      id: 9003,
      title: "Nuestras Tiendas",
      icon: "",
      hideBorder: false,
      disabled: false,
      to: "/nuestras-tiendas",
    },
  ];

  // Opciones del sidebar para usuarios con rol (autenticados)
  const optionsWithRole = [
    {
      id: 19,
      title: "Tienda",
      icon: "",
      hideBorder: false,
      disabled: false,
      to: "/tienda",
    },
    {
      id: 80,
      title: "Mayorista",
      icon: "",
      hideBorder: false,
      disabled: false,
      to: "/tienda-mayorista",
    },
  ];

  const sidebarOptions = hasRole ? optionsWithRole : optionsNoRole;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY === 0) {
        setShowHeader(true); // Solo muestra si está arriba
      } else {
        setShowHeader(false); // Oculta en cualquier otro caso
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleSearchOpen = () => {
    setIsSearchOpen(true);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  const handleSidebarToggle = (isOpen: boolean) => {
    setNavOpen(isOpen);
  };

  return (
    <>
      <header
        className={`w-full  shadow-sm sticky top-0  transition-transform duration-300 ${
          showHeader ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto xl:px-4 px-2 sm:px-6 lg:px-8 flex flex-col gap-0 mb-2">
          {/* Top: Logo + Search + Actions + ThemeToggle */}
          <div className="flex items-center justify-between py-2 gap-2">
            <div className="flex items-center xl:gap-4 gap-1">
              {/* Botón hamburguesa solo en móvil/tablet */}
              <button
                className="lg:hidden p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setNavOpen(true)}
                aria-label="Abrir menú"
              >
                <svg
                  className="h-6 w-6 text-gray-700 dark:text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <Logo />
            </div>

            {/* Barra de búsqueda solo en desktop */}
            <div className="hidden lg:block flex-1 max-w-md mx-4">
              <HeaderSearchBar />
            </div>

            {/* Icono de búsqueda solo en mobile */}

            <div className="flex items-center gap-2 gap-x-2">
              <div className="lg:hidden">
                <button
                  onClick={handleSearchOpen}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Buscar productos"
                >
                  <Search className="h-5 w-5 text-gray-700 dark:text-white" />
                </button>
              </div>
              <ThemeToggle />
              <HeaderActions />
            </div>
          </div>
          {/* Middle: Main Nav - Drawer animado en móvil, visible normal en desktop */}
          <nav className="relative">
            {/* Navegación desktop */}
            <div className="hidden lg:block">
              <HeaderNavMenu />
            </div>
          </nav>
          {/* Bottom: Submenu (optional) */}
          <HeaderSubMenu />
        </div>
        {/* Animación fade-in para fondo */}
        <style jsx global>{`
          @keyframes fade-in {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          .animate-fade-in {
            animation: fade-in 0.3s;
          }
        `}</style>
      </header>

      {/* Multilevel Sidebar para móvil */}
      <MultilevelSidebar
        open={navOpen}
        options={sidebarOptions}
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
              onClick={() => setNavOpen(false)}
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

      {/* Modal de búsqueda */}
      {isSearchOpen && (
        <ProductSearch onClose={handleSearchClose} isOpen={isSearchOpen} />
      )}
    </>
  );
};

export default HeaderMain;
