import { defineType } from "sanity";

export const validationErrors = defineType({
  name: "validationErrors",
  title: "Errores de Productos",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Related Product",
      type: "string",
    },
    {
      name: "relatedProduct",
      title: "Ver Productos",
      type: "reference",
      to: [{ type: "product" }],
    },
 
  ],
});
