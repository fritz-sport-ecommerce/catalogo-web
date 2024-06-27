"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

const filters = [
  {
    id: "tipo",
    name: "Tipo",
    options: [
      { value: "ropa", label: "ropa" },
      { value: "calzado", label: "calzado" },
      { value: "accesorios", label: "accesorios" },
    ],
  },
  // {
  //   id: "coleccion",
  //   name: "Colección",
  //   options: [
  //     { label: "Adidas Superstar", value: "superstar" },
  //     { label: "Adidas Forum", value: "forum" },
  //     { label: "Adidas Stan Smith", value: "stansmith" },
  //     { label: "Adidas Samba", value: "samba" },
  //     { label: "Adidas Gazelle", value: "gazelle" },
  //     { label: "Adidas Campus", value: "campus" },
  //     { label: "Nike Air Max Excee", value: "airmaxexcee" },
  //     { label: "Nike Air Force 1", value: "airforce1" },
  //     { label: "Nike Air Max SC", value: "airmaxsc" },
  //     { label: "Nike Air Max 90", value: "airforcemax90" },
  //     { label: "Nike Air Jordan", value: "airjordan" },
  //     { label: "Nike Dunk", value: "airjordan" },
  //   ],
  // },

  {
    id: "genero",
    name: "Género",
    options: [
      { value: "hombre", label: "Hombre" },
      { value: "mujer", label: "Mujer" },
      { value: "unisex", label: "unisex" },

      // { value: "niños", label: "Niños" },
      { value: "niños", label: "Niños" },
      // { value: "niña", label: "Niña" },
    ],
  },

  {
    id: "category",
    name: "Categoria",
    options: [
      { label: "Mochilas", value: "mochilas" },
      { label: "Terrex", value: "terrex" },
      { label: "Urbano", value: "urbano" },
      { label: "Casacas", value: "casacas" },
      { label: "Bolsos", value: "bolsos" },
      { label: "Medias", value: "medias" },
      { label: "Chimpunes", value: "chimpunes" },
      { label: "Plataforma", value: "plataforma" },
      { label: "Pelotas ", value: "pelotas" },
      { label: "Camisetas", value: "camisetas" },
      { label: "Toma todo", value: "tomatodos" },
      { label: "Buzos", value: "buzos" },
      { label: "Escolar", value: "escolar" },
      { label: "Pantalón", value: "pantalon" },
      { label: "Gorras", value: "gorras" },
      { label: "Shorts", value: "shorts" },
      { label: "Polos", value: "polos" },
      { label: "Sandalias", value: "sandalias" },
      { label: "Running", value: "running" },
      { label: "Selección Peruana", value: "seleccion" },
      { label: "Poleras", value: "poleras" },
      { label: "Básquet", value: "basquet" },
    ],
  },
  {
    id: "talla",
    name: "Tallas",
    options: [
      { value: "2XS", label: "2XS" },
      { value: "XS", label: "XS" },
      { value: "S", label: "S" },
      { value: "M", label: "M" },
      { value: "L", label: "L" },
      { value: "XL", label: "XL" },
      { value: "2XL", label: "2XL" },
      { value: "3XL", label: "3XL" },
      { value: "4XL", label: "4XL" },
      { value: "3K", label: "3K" },
      { value: "4K", label: "4K" },
      { value: "5K", label: "5K" },
      { value: "5.5K", label: "5.5K" },
      { value: "6K", label: "6K" },
      { value: "6.5K", label: "6.5K" },
      { value: "7K", label: "7K" },
      { value: "7.5K", label: "7.5K" },
      { value: "8K", label: "8K" },
      { value: "8.5K", label: "8.5K" },
      { value: "9K", label: "9K" },
      { value: "9.5K", label: "9.5K" },
      { value: "10K", label: "10K" },
      { value: "10.5K", label: "10.5K" },
      { value: "11K", label: "11K" },
      { value: "11.5K", label: "11.5K" },
      { value: "12K", label: "12K" },
      { value: "12.5K", label: "12.5K" },
      { value: "13K", label: "13K" },
      { value: "13.5K", label: "13.5K" },
      { value: "1", label: "1" },
      { value: "1.5", label: "1.5" },
      { value: "2", label: "2" },
      { value: "2.5", label: "2.5" },
      { value: "3", label: "3" },
      { value: "3.5", label: "3.5" },
      { value: "4", label: "4" },
      { value: "4.5", label: "4.5" },
      { value: "5", label: "5" },
      { value: "5.5", label: "5.5" },
      { value: "6", label: "6" },
      { value: "6.5", label: "6.5" },
      { value: "7", label: "7" },
      { value: "7.5", label: "7.5" },
      { value: "8", label: "8" },
      { value: "8.5", label: "8.5" },
      { value: "9", label: "9" },
      { value: "9.5", label: "9.5" },
      { value: "10", label: "10" },
      { value: "10.5", label: "10.5" },
      { value: "11", label: "11" },
      { value: "11.5", label: "11.5" },
      { value: "12", label: "12" },
      { value: "12.5", label: "12.5" },
      { value: "13", label: "13" },
      { value: "13.5", label: "13.5" },
      { value: "14", label: "14" },
      { value: "15", label: "15" },
      // { value: "30A", label: "30A" },
      // { value: "30B", label: "30B" },
      // { value: "30C", label: "30C" },
      // { value: "32A", label: "32A" },
      // { value: "32B", label: "32B" },
      // { value: "32C", label: "32C" },
      // { value: "34A", label: "34A" },
      // { value: "34B", label: "34B" },
      // { value: "34C", label: "34C" },
      // { value: "34DD", label: "34DD" },
      // { value: "36A", label: "36A" },
      // { value: "36B", label: "36B" },
      // { value: "36C", label: "36C" },
      // { value: "36D", label: "36D" },
      // { value: "1", label: "1" },
      // { value: "2", label: "2" },
      // { value: "3", label: "3" },
      // { value: "4", label: "4" },
      // { value: "5", label: "5" },
      // { value: "6", label: "6" },
      // { value: "7", label: "7" },
      // { value: "8", label: "8" },
      // { value: "9", label: "9" },
      // { value: "10", label: "10" },
      // { value: "11", label: "11" },
      // { value: "12", label: "12" },
      // { value: "10.5", label: "10.5" },
      // { value: "10K", label: "10K" },
      // { value: "11K", label: "11K" },
      // { value: "12K", label: "12K" },
      // { value: "13-", label: "13-" },
      // { value: "13K", label: "13K" },
      // { value: "14", label: "14" },
      // { value: "16", label: "16" },
      // { value: "18", label: "18" },
      // { value: "1X", label: "1X" },
      // { value: "2X", label: "2X" },
      // { value: "30DD", label: "30DD" },
      // { value: "32D", label: "32D" },
      // { value: "32F", label: "32F" },
      // { value: "34D", label: "34D" },
      // { value: "34E", label: "34E" },
      // { value: "34F", label: "34F" },
      // { value: "34G", label: "34G" },
      // { value: "36DD", label: "36DD" },
      // { value: "36E", label: "36E" },
      // { value: "38A", label: "38A" },
      // { value: "38B", label: "38B" },
      // { value: "38C", label: "38C" },
      // { value: "38DD", label: "38DD" },
      // { value: "3 años", label: "3 años" },
      // { value: "3X", label: "3X" },
      // { value: "40A", label: "40A" },
      // { value: "40B", label: "40B" },
      // { value: "40C", label: "40C" },
      // { value: "40D", label: "40D" },
      // { value: "40DD", label: "40DD" },
      // { value: "40E", label: "40E" },
      // { value: "40F", label: "40F" },
      // { value: "42C", label: "42C" },
      // { value: "42D", label: "42D" },
      // { value: "42DD", label: "42DD" },
      // { value: "42E", label: "42E" },
      // { value: "42F", label: "42F" },
      // { value: "44C", label: "44C" },
      // { value: "44D", label: "44D" },
      // { value: "44DD", label: "44DD" },
      // { value: "44E", label: "44E" },
      // { value: "44F", label: "44F" },
      // { value: "46C", label: "46C" },
      // { value: "46D", label: "46D" },
      // { value: "46DD", label: "46DD" },
      // { value: "46E", label: "46E" },
      // { value: "48C", label: "48C" },
      // { value: "48D", label: "48D" },
      // { value: "48DD", label: "48DD" },
      // { value: "48E", label: "48E" },
      // { value: "4X", label: "4X" },
      // { value: "9.5", label: "9.5" },
    ],
  },
  {
    id: "marca",
    name: "Marca",
    options: [
      { value: "adidas", label: "adidas" },
      { value: "nike", label: "nike" },
      { value: "puma", label: "puma" },
      { value: "reebok", label: "reebok" },
      { value: "cat", label: "cat" },
      { value: "joma", label: "joma" },
    ],
  },
  {
    id: "color",
    name: "Color",
    options: [
      { value: "blanco", label: "Blanco" },
      { value: "negro", label: "Negro" },
      { value: "azul", label: "Azul" },
      { value: "verde", label: "Verde" },
      { value: "rosa", label: "Rosa" },
      { value: "gris", label: "Gris" },
      { value: "naranja", label: "Naranja" },
      { value: "celeste", label: "celeste" },
      { value: "amarillo", label: "amarillo" },
    ],
  },
];

export function ProductFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchValues = Array.from(searchParams.entries());
  return (
    <form className="sticky top-20 ">
      <h3 className="sr-only">Categories</h3>

      {filters.map((section, i) => (
        <Accordion key={i} type="single" collapsible>
          <AccordionItem value={`item-${i}`}>
            <AccordionTrigger>
              <span>
                {section.name}
                <span className="ml-1 text-xs font-extrabold uppercase text-gray-400">
                  {searchParams.get(section.id)
                    ? `(${searchParams.get(section.id)})`
                    : ""}
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className=" space-y-4  ">
                {section.options.map((option, optionIdx) => (
                  <div
                    key={option.value}
                    className={`flex items-center space-x-2 `}
                  >
                    <Checkbox
                      id={`filter-${section.id}-${optionIdx}`}
                      checked={searchValues.some(
                        ([key, value]) =>
                          key === section.id && value === option.value
                      )}
                      onClick={(event) => {
                        const params = new URLSearchParams(
                          searchParams.toString()
                        );
                        const checked =
                          event.currentTarget.dataset.state === "checked";
                        checked
                          ? params.delete(section.id)
                          : params.set(section.id, option.value);
                        router.replace(`tienda/?${params.toString()}`);
                      }}
                    />
                    <label
                      htmlFor={`filter-${section.id}-${optionIdx}`}
                      className="text-sm font-medium uppercase leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </form>
  );
}
