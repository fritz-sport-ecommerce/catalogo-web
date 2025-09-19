import { defineField, defineType } from "sanity";

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
    // Interruptor para activar/desactivar el video principal
    {
      title: "Activar Video Principal",
      name: "activarVideo",
      type: "boolean",
      initialValue: false, // Por defecto está desactivado
    },
    // Campo para subir videos de escritorio
    {
      title: "Video Desktop 2880x1200",
      name: "videohomedesk",
      type: "file",
      options: {
        accept: "video/*", // Acepta solo archivos de video
      },
      hidden: ({ parent }) => !parent?.activarVideo, // Ocultar si no está activado el interruptor
      validation: (rule) =>
        rule.custom((value, context: any) => {
          if (context.parent.activarVideo && !value) {
            return "Debe subir un video para escritorio si está activado el video principal.";
          }
          return true;
        }),
    },
    {
      title: "Video Tablet 1600x1600",
      name: "videohometablet",
      type: "file",
      options: {
        accept: "video/*", // Acepta solo archivos de video
      },
      hidden: ({ parent }) => !parent?.activarVideo, // Ocultar si no está activado el interruptor
      validation: (rule) =>
        rule.custom((value, context: any) => {
          if (context.parent.activarVideo && !value) {
            return "Debe subir un video para escritorio si está activado el video principal.";
          }
          return true;
        }),
    },
    // Campo para subir videos móviles
    {
      title: "Video Mobile 720x1000",
      name: "videohomemob",
      type: "file",
      options: {
        accept: "video/*", // Acepta solo archivos de video
      },
      hidden: ({ parent }) => !parent?.activarVideo, // Ocultar si no está activado el interruptor
      validation: (rule) =>
        rule.custom((value, context: any) => {
          if (context.parent.activarVideo && !value) {
            return "Debe subir un video para móvil si está activado el video principal.";
          }
          return true;
        }),
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
              title: "Provincia",
              name: "provincia",
              type: "string",
              options: {
                list: [
                  "Amazonas",
                  "Áncash",
                  "Apurímac",
                  "Arequipa",
                  "Ayacucho",
                  "Cajamarca",
                  "Callao",
                  "Cusco",
                  "Huancavelica",
                  "Huánuco",
                  "Ica",
                  "Junín",
                  "La Libertad",
                  "Lambayeque",
                  "Lima",
                  "Loreto",
                  "Madre de Dios",
                  "Moquegua",
                  "Pasco",
                  "Piura",
                  "Puno",
                  "San Martín",
                  "Tacna",
                  "Tumbes",
                  "Ucayali",
                ],
              },
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
                      title: "Titulo Sede",
                      name: "titulosede",
                      type: "string",
                      // validation: (rule) => rule.required(),
                    },
                    {
                      title: "Provincia",
                      name: "provincia",
                      type: "string",
                      validation: (rule) => rule.required(),
                    },
                    {
                      title: "Distrito",
                      name: "distrito",
                      type: "string",
                      validation: (rule) => rule.required(),
                    },
                    {
                      title: "Video Sede 550x550",
                      name: "videosede",
                      type: "file",
                      options: {
                        accept: "video/*", // Acepta solo archivos de video
                      },
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
        },
      ],
    },
    {
      name: "sedes_mayorista",
      title: "Sedes Mayorista",
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
              title: "Provincia",
              name: "provincia",
              type: "string",
              options: {
                list: [
                  "Amazonas",
                  "Áncash",
                  "Apurímac",
                  "Arequipa",
                  "Ayacucho",
                  "Cajamarca",
                  "Callao",
                  "Cusco",
                  "Huancavelica",
                  "Huánuco",
                  "Ica",
                  "Junín",
                  "La Libertad",
                  "Lambayeque",
                  "Lima",
                  "Loreto",
                  "Madre de Dios",
                  "Moquegua",
                  "Pasco",
                  "Piura",
                  "Puno",
                  "San Martín",
                  "Tacna",
                  "Tumbes",
                  "Ucayali",
                ],
              },
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
                      title: "Titulo Sede",
                      name: "titulosede",
                      type: "string",
                      // validation: (rule) => rule.required(),
                    },
                    {
                      title: "Provincia",
                      name: "provincia",
                      type: "string",
                      validation: (rule) => rule.required(),
                    },
                    {
                      title: "Distrito",
                      name: "distrito",
                      type: "string",
                      validation: (rule) => rule.required(),
                    },
                    {
                      title: "Video Sede 550x550",
                      name: "videosede",
                      type: "file",
                      options: {
                        accept: "video/*", // Acepta solo archivos de video
                      },
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
        },
      ],
    },
  ],
});

