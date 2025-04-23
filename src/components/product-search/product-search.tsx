// components/ProductSearch.tsx
"use client";
import { useState, useEffect, ChangeEvent } from "react";
import ProductSearchCard from "./product-search-card";
import Descuentos from "@/config/descuentos";
import { SanityProduct } from "@/config/inventory";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  imageUrl: string;
  descuentos: [];
}
interface ModalProps {
  onClose: () => void;
}
// test
export default function ProductSearch({ onClose }: ModalProps) {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement> | any) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [descuentosProduct, setDescuentos] = useState<SanityProduct>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchSuggestions = async (input: string) => {
    setIsLoading(true);
    let descuentos = await Descuentos();
    setDescuentos(descuentos);

    const results: Product[] = await client.fetch(
      groq`*[_type == "product" && (
        lower(sku) match $input || 
        lower(name) match $input || 
        lower(marca) match $input || 
        lower(tipo) match $input || 
        lower(genero) match $input || 
        lower(categories) match $input
      )  && categories != "originals"] {
        _id,
        name,
        sku,
        images,
           priceecommerce,
        description,
        genero,
        subgenero_ninos,
        tipo,
        coleccion,
        marca,
        descuento,
        color,
        razonsocial,
        descuentosobred,
        tallas,
        preciomanual,
        "slug": slug.current
      } [0..10]  | order(name asc)`,
      { input: `${input}*` }
    );

    setSuggestions(results);
    setIsLoading(false);
  };

  useEffect(() => {
    if (query.length > 0) {
      fetchSuggestions(query);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="flex-col flex p-3 w-full justify-center items-center">
      <div className="w-5/6 ">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={query}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-none focus:outline-none text-black"
        />
      </div>
      <div className=" left-0 w-full   rounded-sm h-auto overflow-y-auto mt-0 shadow-lg">
        {isLoading && (
          <div className="flex justify-center items-center h-full w-full">
            <div className="animate-spin rounded-full h-8 w-8 "></div>
          </div>
        )}
        {suggestions.length > 0 && (
          <>
            <div className="flex w-full justify-center my-2">
              <Link href={`/catalogo?search=${query}`}>
                <button
                  onClick={handleOverlayClick}
                  className="uppercase dark:bg-black dark:text-white border-black dark:border-transparent border-[1px] dark:border-none px-3 py-2 text-xs"
                >
                  ver todo{" "}
                </button>
              </Link>
            </div>
            <ul
              onClick={handleOverlayClick}
              className="grid xl:grid-cols-4 gap-y-2 grid-cols-2 text-[3px] mx-auto container w-full"
            >
              {suggestions.map((product) => (
                <ProductSearchCard
                  key={product._id}
                  descuentos={descuentosProduct}
                  products={product}
                  outlet={false}
                  stock={false}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
