import { defineField, defineType } from "sanity"

export const emprende = defineType({
  name: "emprende",
  title: "Emprende",
  type: "document",
  validation: (rule) => rule.required(),

  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      initialValue: "Pagina Emprende",
      validation: (rule) => rule.required(),
    }),
    // Banner Emprende
    {
      title: "Portada Desktop (jpg,png,webp) 1903x563",
      name: "portadadeskt",
      type: "image",
      options: {
        hotspot: true, // <-- Defaults to false
      },
      validation: (rule) => rule.required(),
    },
    {
      title: "Portada Mobil (jpg,png,webp) 836x563",
      name: "portadamob",
      type: "image",
      options: {
        hotspot: true, // <-- Defaults to false
      },
      validation: (rule) => rule.required(),
    },
    {
      title: "Titulo Beneficios",
      name: "titulobeneficios",
      initialValue: "Nuestros Beneficios",
      type: "string",
      validation: (rule) => rule.required(),
    },

    {
      title: "Beneficios Grid  (jpg,png,webp) 292x292",
      name: "benficiosgrid",
      type: "array",
      validation: (rule) => rule.required(),
      of: [
        {
          title: " Grid img",
          type: "object",
          name: "gridimg",
          validation: (rule) => rule.required(),

          fields: [
            {
              title: "Imagen (jpg,png,webp) 292x292",
              name: "img",
              type: "image",
              options: {
                hotspot: true, // <-- Defaults to false
              },
            },
            {
              title: "Titulo ",
              name: "titulo",
              type: "string",
              validation: (rule) => rule.required(),
            },
          ],
        },
      ],
    },
    {
      title: "Titulo Emprende",
      name: "tituloemprende",
      initialValue: "¡Inicia a tu manera y gana!",
      type: "string",
      validation: (rule) => rule.required(),
    },
    {
      title: "Beneficios Emprendedor Mayorista",
      name: "emprendemayorista",
      type: "array",
      validation: (rule) => rule.required(),
      of: [
        {
          title: "Drag",
          type: "object",
          name: "bannergenero",
          validation: (rule) => rule.required(),

          fields: [
            {
              title: "Titulo ",
              name: "titulo",
              type: "string",
              validation: (rule) => rule.required(),
            },
            {
              title: "Imagen Principal (jpg,png,webp) 720x480",
              name: "img",
              validation: (rule) => rule.required(),
              type: "image",
              options: {
                hotspot: true, // <-- Defaults to false
              },
            },
            {
              title: "Titulo Beneficios",
              name: "titulobeneficios",
              initialValue: "Beneficios",
              type: "string",
              validation: (rule) => rule.required(),
            },
            {
              title: "Beneficios",
              name: "beneficios",
              type: "array",
              validation: (rule) => rule.required(),
              of: [
                {
                  title: "Titulo",
                  name: "titulo",
                  type: "string",
                  validation: (rule) => rule.required(),
                },
              ],
            },
            {
              title: "Titulo Requisitos",
              name: "Requisitos",
              initialValue: "¡Inicia a tu manera y gana!",
              type: "string",
              validation: (rule) => rule.required(),
            },
            {
              title: "Requisitos",
              name: "requisitos",
              type: "array",
              validation: (rule) => rule.required(),
              of: [
                {
                  title: "Titulo",
                  name: "titulo",
                  type: "string",
                  validation: (rule) => rule.required(),
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Pasos",
      name: "pasos",
      type: "object",
      validation: (rule) => rule.required(),
      fields: [
        {
          title: "Titulo ",
          name: "titulo",
          type: "string",
          validation: (rule) => rule.required(),
        },
        {
          title: "Imagen(jpg,png,webp) 1280x1046",
          name: "img",
          validation: (rule) => rule.required(),
          type: "image",
          options: {
            hotspot: true, // <-- Defaults to false
          },
        },
        {
          title: "Afíliate",
          name: "afiliate",
          type: "array",
          validation: (rule) => rule.required(),
          of: [
            {
              title: "Pasos",
              type: "object",
              name: "pasos",
              validation: (rule) => rule.required(),

              fields: [
                {
                  title: "Titulo ",
                  name: "titulo",
                  type: "string",
                  validation: (rule) => rule.required(),
                },
                {
                  title: "Subtitle",
                  name: "subtitle",
                  type: "string",
                  validation: (rule) => rule.required(),
                },
              ],
            },
          ],
        },
        {
          title: "Title ",
          name: "title",
          type: "string",
          validation: (rule) => rule.required(),
        },
        {
          title: "Empieza Ahora",
          name: "empiezaahora",
          type: "array",
          validation: (rule) => rule.required(),
          of: [
            {
              title: "buttons",
              type: "object",
              name: "button",
              validation: (rule) => rule.required(),

              fields: [
                {
                  title: "Text Button",
                  name: "textbutton",
                  type: "string",
                  validation: (rule) => rule.required(),
                },
                {
                  title: "Url Button",
                  name: "urlbutton",
                  type: "string",
                  validation: (rule) => rule.required(),
                },
              ],
            },
          ],
        },
      ],
    },
  ],
})
