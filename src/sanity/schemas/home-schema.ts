import { defineField, defineType } from "sanity"

export const home = defineType({
  name: "home",
  title: "Home",
  type: "document",
  validation: (rule) => rule.required(),

  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      initialValue: "Home Page",
    }),
    // slider
    {
      name: "slider",
      title: "Slider",
      type: "array",
      of: [
        {
          title: "Slider",
          type: "object",
          name: "Slide",
          fields: [
            {
              title: "Image Desktop (jpg,png,webp) 1940x765",
              name: "imgdeskt",
              type: "image",
              validation: (rule) => rule.required(),
              options: {
                hotspot: true, // <-- Defaults to false
              },
            },
            {
              title: "Image Tablet (jpg,png,webp) 960x960",
              name: "imgtab",
              type: "image",
              validation: (rule) => rule.required(),
              options: {
                hotspot: true, // <-- Defaults to false
              },
            },

            {
              title: "Image Mobil (jpg,png,webp) 600x800",
              name: "imgmob",
              type: "image",
              options: {
                hotspot: true, // <-- Defaults to false
              },
              validation: (rule) => rule.required(),
            },
            {
              title: "Url Slider",
              name: "urlslider",
              type: "string",
              validation: (rule) => rule.required(),
            },
            {
              title: "Titulo",
              name: "titulo",
              type: "string",
              validation: (rule) => rule.required(),
            },
            {
              title: "Subtitulo",
              name: "subtitulo",
              type: "string",
              validation: (rule) => rule.required(),
            },
            {
              title: "Activar Botón con titulo",
              name: "activebuttontitle",
              type: "boolean",
              initialValue: false,
              validation: (rule) => rule.required(),
            },
            {
              title: "Btntext",
              name: "btntext",
              type: "string",
              validation: (rule) => rule.required(),
            },
            {
              title: "Link",
              name: "link",
              type: "string",
              validation: (rule) => rule.required(),
            },
            {
              title: "Image PNG 2000x2000",
              name: "img2",
              type: "image",
            },
          ],
        },
      ],
    },
    {
      name: "bannergenero",
      title: "Genero",
      type: "array",
      of: [
        {
          title: "Hombre Mujer",
          type: "object",
          name: "bannergenero",
          fields: [
            {
              title: "Imagen Principal (jpg,png,webp) 720x480",
              name: "img",
              type: "image",
              options: {
                hotspot: true, // <-- Defaults to false
              },
            },
            {
              title: "Titulo",
              name: "titulo",
              type: "string",
              validation: (rule) => rule.required(),
            },
            {
              title: "Link",
              name: "link",
              type: "string",
              validation: (rule) => rule.required(),
            },
          ],
        },
      ],
    },
    {
      name: "semifiltro",
      title: "Filtro con Slider",
      type: "array",
      of: [
        {
          title: "Semi filtro",
          type: "object",
          name: "semifiltro",
          fields: [
            {
              title: "Filtro",
              name: "filtro",
              type: "string",
              validation: (rule) => rule.required(),
            },
            {
              title: "cantidadSlider",
              name: "cantidadslider",
              type: "string",
              validation: (rule) => rule.required(),
            },
            {
              title: "Link",
              name: "link",
              type: "string",
              validation: (rule) => rule.required(),
            },
            {
              title: "Imagen Principal (jpg,png,webp) 470x399",
              name: "img",
              type: "image",
              options: {
                hotspot: true, // <-- Defaults to false
              },
            },
            // array images
            {
              name: "categorias",
              title: "Categorías",
              type: "array",
              of: [
                {
                  title: "Hombre Mujer",
                  type: "object",
                  name: "bannergenero",
                  fields: [
                    {
                      title: "Imagen Categoría (jpg,png,webp) 253x399",
                      name: "img",
                      type: "image",
                      options: {
                        hotspot: true, // <-- Defaults to false
                      },
                      validation: (rule) => rule.required(),
                    },
                    {
                      title: "Titulo",
                      name: "titulo",
                      type: "string",
                      validation: (rule) => rule.required(),
                    },
                    {
                      title: "BtnText",
                      name: "btnText",
                      type: "string",
                      validation: (rule) => rule.required(),
                    },
                    {
                      title: "Link",
                      name: "link",
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
    },
    {
      title: "Promo Home",
      type: "object",
      name: "promo",
      fields: [
        {
          title: "Activar Promo",
          name: "activebuttontitle",
          type: "boolean",
          initialValue: true,
          validation: (rule) => rule.required(),
        },
        {
          title: "Image(jpg,png,webp) 640x640",
          name: "imgdeskt",
          type: "image",
          validation: (rule) => rule.required(),
          options: {
            hotspot: true, // <-- Defaults to false
          },
        },
        {
          title: "Url",
          name: "urlslider",
          type: "string",
          validation: (rule) => rule.required(),
        },
        {
          title: "Descripción Imagen",
          name: "desc",
          type: "string",
          validation: (rule) => rule.required(),
        },
      ],
    },
    {
      title: "Video Url",
      name: "videohome",
      type: "string",
      validation: (rule) => rule.required(),
    },
    {
      title: "Numero WhatsApp flotante",
      name: "whatsapp",
      type: "string",
      validation: (rule) => rule.required(),
    },
  ],
})
