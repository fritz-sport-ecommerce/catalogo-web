import { type SchemaTypeDefinition } from "sanity"

import { catalogo } from "./schemas/catalogo-schema"
import { emprende } from "./schemas/emprende-schema"
import { home } from "./schemas/home-schema"
import { nuestras_tiendas } from "./schemas/nuestras-tiendas-schema"
import { pedidos } from "./schemas/pedidos"
import { product } from "./schemas/product-schema"

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [home, product, nuestras_tiendas, emprende, pedidos, catalogo],
}
