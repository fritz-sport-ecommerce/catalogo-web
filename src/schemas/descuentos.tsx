import { defineField, defineType } from "sanity";

export const descuentos = defineType({
  name: "descuentos",
  title: "Descuentos",
  type: "document",
  validation: (rule) => rule.required(),

  fields: [
    {
      name: "titulo",
      title: "Descuentos Globales",
      type: "string",
      initialValue: "Descuentos Globales",
    },
    {
      name: "descuentofritzsport",
      title: "Descuento Fritz Sport",
      type: "number",
    },
    {
      name: "descuentooutlet",
      title: "Descuento Outlet Fritz Sport",
      type: "number",
    },
    {
      name: "descuentofz",
      title: "Descuento Fz Premium",
      type: "number",
    },
  ],
});
