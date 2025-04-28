"use client";

import { useRouter } from "next/navigation";
import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ProductFilters } from "@/components/product-filters";
import { useEffect, useState } from "react";

const sortOptions = [
  { name: "Lo más Nuevo", value: "catalogo/?date=desc" },
  { name: "Precio, Bajo a Alto", value: "catalogo/?price=asc" },
  { name: "Precio, Alto a Bajo", value: "catalogo/?price=desc" },
];

function ProductSort() {
  const router = useRouter();
  return (
    <div className="flex items-center">
      <Select onValueChange={(value) => router.replace(value)}>
        <SelectTrigger className="sm:w-[180px]">
          <SelectValue placeholder="Ordenar por" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.name} value={option.value}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Sheet>
        <SheetContent className="w-[300px]">
          <SheetHeader>
            <SheetTitle>Filtros</SheetTitle>
            <SheetDescription>
              Limite su búsqueda de productos utilizando las opciones
              siguientes.
            </SheetDescription>
          </SheetHeader>
          <ProductFilters />
        </SheetContent>
        <SheetTrigger className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6">
          <span className="sr-only">Filtros</span>
          <Filter className="h-5 w-5" aria-hidden="true" />
        </SheetTrigger>
      </Sheet>
    </div>
  );
}

export function MainSort() {
  // Estado para mostrar el header
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  // Umbral para controlar el scroll hacia arriba
  const scrollUpThreshold = 100; // Controla cuánto debe scrollar hacia arriba antes de mostrar el header

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

  return (
    <div
      className={`${
        showHeader ? "top-[80px] xl:top-[110px] 2xl:top-[101px]" : "top-0"
      } transition-transform duration-500 ease-in-out sticky z-20 h-full w-full border-b-[1px] border-blue-gray-700/20`}
    >
      <div
        className={`flex w-full items-center justify-between ${
          showHeader
            ? "dark:bg-black dark:text-white bg-white"
            : "dark:bg-white bg-white dark:text-black"
        } px-6 py-4 dark:bg-background`}
      >
        <h1 className="text-xl font-bold tracking-tight sm:text-xl">
          <span>Filtrar por:</span>
        </h1>
        {/* Product Sort */}
        <ProductSort />
      </div>
    </div>
  );
}
