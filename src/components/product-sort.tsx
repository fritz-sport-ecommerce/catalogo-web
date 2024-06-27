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

const sortOptions = [
  { name: "Lo mas Nuevo", value: "tienda/?date=desc" },
  // { name: "Precio, Bajo a Alto", value: "tienda/?price=asc" },
  // { name: "Precio, Alto a Bajo", value: "tienda/?price=desc" },
];

export function ProductSort() {
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
        <SheetTrigger className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 ">
          <span className="sr-only">Filtros</span>
          <Filter className="h-5 w-5 " aria-hidden="true" />
        </SheetTrigger>
      </Sheet>
    </div>
  );
}
