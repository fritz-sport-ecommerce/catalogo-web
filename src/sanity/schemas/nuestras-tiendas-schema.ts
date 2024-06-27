import { defineField, defineType } from "sanity"

export const nuestras_tiendas = defineType({
  name: "nuestrastiendas",
  title: "Nuestras Tiendas",
  type: "document",
  validation: (rule) => rule.required(),
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      initialValue: "Nuestras Tiendas",
      validation: (rule) => rule.required(),
    }),
    // video
    {
      title: "Video Url Desktop",
      name: "videohomedesk",
      type: "string",
      initialValue:
        "https://res.cloudinary.com/dmtq82guq/video/upload/v1705420976/ecommerce-fritz-sport/slider-home/fw23_rivalry_launch_hp_mh_d_2c98ca2cf4_1_t5xs5v.mp4",
      validation: (rule) => rule.required(),
    },
    {
      title: "Video Url Mobil",
      name: "videohomemob",
      type: "string",
      initialValue:
        "https://res.cloudinary.com/dmtq82guq/video/upload/v1705420976/ecommerce-fritz-sport/slider-home/fw23_rivalry_launch_hp_mh_d_2c98ca2cf4_1_t5xs5v.mp4",
      validation: (rule) => rule.required(),
    },
    {
      title: "Titulo Sedes",
      name: "titulosede",
      type: "string",
      initialValue: "Conoce la Ubicación y Nuestros Horarios de Atención",
      validation: (rule) => rule.required(),
    },

    {
      name: "sedes",
      title: "Sedes",
      type: "array",
      validation: (rule) => rule.required(),

      of: [
        {
          title: "Sede",
          type: "object",
          name: "sede",
          validation: (rule) => rule.required(),

          fields: [
            {
              title: "Imagen Sede (jpg,png,webp) 450x338",
              name: "img",
              type: "image",
              options: {
                hotspot: true, // <-- Defaults to false
              },
              validation: (rule) => rule.required(),
            },
            {
              title: "Titulo Sede",
              name: "titulosede",

              type: "string",

              validation: (rule) => rule.required(),
            },
            {
              title: "Dirección",
              name: "direccion",
              type: "string",
              validation: (rule) => rule.required(),
            },
            {
              title: "Texto Botón Horarios",
              name: "boton",
              type: "string",
              validation: (rule) => rule.required(),
            },

            {
              name: "horarios",
              title: "Horarios",
              type: "array",
              validation: (rule) => rule.required(),

              of: [
                {
                  title: "Horario",
                  name: "horario",
                  type: "string",
                  validation: (rule) => rule.required(),
                },
              ],
            },
            {
              title: "Texto Botón Ubicación",
              name: "ubicanosboton",
              type: "string",
              validation: (rule) => rule.required(),
            },
            {
              title: "Url Ubicación Google Maps",
              name: "urlubicacion",
              type: "string",
              validation: (rule) => rule.required(),
            },
          ],
        },
      ],
    },
  ],
})
