import { defineField, defineType } from "sanity";

export const descuento_registro = defineType({
  name: "descuento_users",
  title: "Descuento Users",
  type: "document",
  validation: (rule) => rule.required(),
 
  fields: [
    {
      name: "titulo_descuentos",
      title: "Título de Descuentos por Primer Registro",
      type: "string",
      initialValue: "Descuentos Por Usuario",
    },
    {
      name: "bloque_descuentos_usuario",
      title: "Descuentos por Primer Registro de Usuario",
      type: "object",
      fields: [
 
        {
          name: "desc_user_fz_premium",
          title: "Descuento para Usuario en Fz Premium",
          type: "number",
          initialValue: 0,
          description: "Porcentaje de descuento para usuarios nuevos en la tienda Fz Premium.",
        },
        {
          name: "desc_user_fritz_sport",
          title: "Descuento para Usuario en Fritz Sport",
          type: "number",
          initialValue: 0,
          description: "Porcentaje de descuento para usuarios nuevos en la tienda Fritz Sport.",
        },
        {
          name: "desc_user_fritz_sport_outlet",
          title: "Descuento para Usuario en Outlet Fritz Sport",
          type: "number",
          initialValue: 0,
          description: "Porcentaje de descuento para usuarios nuevos en el Outlet Fritz Sport.",
        },
      ],
    },


  ],
});
