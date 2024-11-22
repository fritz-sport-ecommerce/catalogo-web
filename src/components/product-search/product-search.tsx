// components/ProductSearch.tsx
"use client";
import { useState, useEffect, ChangeEvent } from "react";
import ProductSearchCard from "./product-search-card";
import Descuentos from "@/config/descuentos";
import { SanityProduct } from "@/config/inventory";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  imageUrl: string;
  descuentos: [];
}

export default function ProductSearch() {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [descuentosProduct, setDescuentos] = useState<SanityProduct>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchSuggestions = async (input: string) => {
    setIsLoading(true);
    let descuentos = await Descuentos();
    setDescuentos(descuentos);

    const results: Product[] = await  client.fetch(groq
      `*[_type == "product" && (
        lower(sku) match $input || 
        lower(name) match $input || 
        lower(marca) match $input || 
        lower(tipo) match $input || 
        lower(genero) match $input || 
        lower(categories) match $input
      )] {
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
      } [0..10] | order(name asc)`,
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
    <div className="relative w-full flex justify-center">
      <div className="w-5/12">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={query}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none text-black"
        />
      </div>
      <div className="absolute top-full left-0 w-full bg-white dark:bg-black border rounded-md max-h-72 overflow-y-auto mt-0 shadow-lg">
        {isLoading && (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-500"></div>
          </div>
        )}
        {suggestions.length > 0 && (
          <ul className="grid xl:grid-cols-4 gap-y-1 grid-cols-2 text-[3px] mx-auto container">
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
        )}
      </div>
    </div>
  );
}
