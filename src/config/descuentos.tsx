import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

import { SanityProduct } from "./inventory";

export default async function Descuentos() {
  const descuentos =
    await client.fetch<SanityProduct>(groq`*[_type == "descuentos"][0] {
    descuentofritzsport,
    descuentooutlet,
    descuentofz
}`);

  return descuentos;
}
