"use client";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo/logo";
import { NavDesktop } from "./Nav/nav-desktop";
import NavTop from "./Nav/nav-top";
import { Search, ShoppingBag, User, Menu } from "lucide-react";
import { useSearch } from "@/context/searchContext";
import ProductSearch from "../product-search/product-search";
import ModalDesk from "../modal/Modal";
import { ThemeToggle } from "../theme-toggle";
import { useSession } from "next-auth/react";

export function ModernHeader() {
  const { isSearchOpen, closeSearch, openSearch } = useSearch();
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = useSession();
  const [roleLS, setRoleLS] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        setRoleLS(localStorage.getItem("rol"));
      } catch {}
    }
  }, []);

  const isCallcenter =
    (session as any)?.user?.role === "callcenter" || roleLS === "callcenter";

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (currentScrollTop === 0) {
        setShowHeader(true);
        setIsScrolled(false);
      } else if (currentScrollTop > lastScrollTop) {
        setShowHeader(false);
      } else if (lastScrollTop - currentScrollTop > 100) {
        setShowHeader(true);
      }

      setIsScrolled(currentScrollTop > 50);
      setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  return (
    <>
      <header
        className={`${
          showHeader ? "translate-y-0" : "-translate-y-full"
        } transition-all duration-500 ease-in-out sticky top-0 z-50 w-full  backdrop-blur-md border-b border-gray-100 shadow-sm`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo centrado */}
            <div className="flex-1 flex justify-center lg:justify-start">
              <div className="flex-shrink-0">
                <Logo />
              </div>
            </div>

            {/* Navegación desktop */}
            <nav className="hidden lg:flex items-center space-x-11 ">
              <a href="/tienda" className="font-medium transition-colors duration-200">
                TIENDA
              </a>
              <a href="/tienda-mayorista" className="font-medium transition-colors duration-200 text-blue-600 hover:text-blue-700">
                MAYORISTA
              </a>
              <a href="/tienda?search=hombre" className="font-medium transition-colors duration-200">
                HOMBRE
              </a>
              <a href="/tienda?search=mujer" className="font-medium transition-colors duration-200">
                MUJER
              </a>
              <a href="/tienda?search=niños" className="font-medium transition-colors duration-200">
                NIÑOS
              </a>
              <a href="/nuestras-tiendas" className="font-medium transition-colors duration-200">
                UBICANOS
              </a>
            </nav>

            {/* Acciones */}
            <div className="flex items-center space-x-3">
         
              <button
          
                className=" text-gray-600transition-colors duration-200 xl:ml-10"
              >
                 <ThemeToggle />
              </button>
              <button
                onClick={openSearch}
                className={`p-2 text-gray-600transition-colors duration-200 xl:ml-10 ${!isCallcenter ? "lg:hidden" : ""}`}
              >
                <Search size={20} />
              </button>
              <a href="/carrito" className={`p-2 text-gray-600transition-colors duration-200 relative ${!isCallcenter ? "lg:hidden" : ""}`}>
                <ShoppingBag size={20} />
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </a>
              <a href="/auth" className="p-2 text-gray-600transition-colors duration-200">
                <User size={20} />
              </a>
              <button className="lg:hidden p-2 text-gray-600transition-colors duration-200">
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <ModalDesk isOpen={isSearchOpen} onClose={closeSearch}>
        <ProductSearch onClose={closeSearch} />
      </ModalDesk>
    </>
  );
} 