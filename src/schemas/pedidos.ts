import { defineField, defineType } from "sanity";

export const pedidos = defineType({
  name: "pedidos",
  title: "Pedidos",
  type: "document",

  fields: [
    defineField({
      title: "Estado de Pedido",
      name: "estado",
      type: "string",

      validation: (rule) => rule.required(),
      options: {
        list: [
          { title: "pendiente", value: "pendiente" },
          { title: "pagado", value: "pagado" },
          { title: "Por Entregar", value: "porentregar" },
          { title: "entregado", value: "entregado" },
          { title: "devuelto", value: "devuelto" },
        ], // <-- predefined values
      },
    }),
    {
      name: "id_payer",
      title: "id_payer",
      type: "string",
    },
    {
      name: "tipoEntrega",
      title: "tipo de Entrega",
      type: "string",
    },

    {
      name: "razon",
      title: "razón social",
      type: "string",
    },
    {
      name: "id_mercado_pago",
      title: "Id Mercado Pago",
      type: "string",
    },

    {
      name: "userId",
      title: "Id user",
      type: "string",
    },
    {
      name: "nombres",
      title: "nombres",
      type: "string",
    },
    {
      name: "apellidos",
      title: "apellidos",
      type: "string",
    },
    {
      name: "email",
      title: "email",
      type: "string",
    },
    {
      name: "documento",
      title: "documento",
      type: "string",
    },
    {
      name: "cart_total",
      title: "cart_total",
      type: "number",
    },
    {
      name: "telefono",
      title: "telefono",
      type: "string",
    },
    {
      name: "departamento",
      title: "departamento",
      type: "string",
    },
    {
      name: "provincia",
      title: "provincia",
      type: "string",
    },
    {
      name: "distrito",
      title: "distrito",
      type: "string",
    },

    {
      name: "direccion",
      title: "direccion",
      type: "string",
    },
    {
      name: "comprobante",
      title: "comprobante",
      type: "string",
    },
    {
      name: "info_adicional",
      title: "info_adicional",
      type: "string",
    },
    {
      name: "ruc",
      title: "ruc",
      type: "string",
    },
    {
      name: "productos",
      title: "Productos",
      type: "array",

      of: [
        defineField({
          name: "productos",
          title: "productos",
          type: "object",
          fields: [
            {
              name: "name",
              title: "nombre",
              type: "string",
            },
            {
              name: "cantidad",
              title: "cantidad",
              type: "number",
            },
            {
              name: "sku",
              title: "sku",
              type: "string",
            },
            {
              name: "talla",
              title: "talla",
              type: "string",
            },
            {
              name: "unit_price",
              title: "unit_price",
              type: "number",
            },
            {
              name: "picture_url",
              title: "picture_url",
              type: "string",
            },
          ],
        }),
      ],
    },
    // Banner Emprende
  ],
});
