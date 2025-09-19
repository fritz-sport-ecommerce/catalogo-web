import { defineField, defineType } from "sanity";

export const home = defineType({
  name: "home",
  title: "Home Fritz Sport",
  type: "document",
  validation: (rule) => rule.required(),

  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      initialValue: "Home Page",
    }),
    defineField({
      name: "modo_mantenimiento",
       type: 'boolean',
      title: "Modo Mantenimiento",
      // initialValue:true,
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
      title: "Image Desktop (jpg,png,webp) 2100x900",
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
              title: "description image",
              name: "tituloimg",
              type: "string",
              validation: (rule) => rule.required(),
            },
            // {
            //   title: "Subtitulo",
            //   name: "subtitulo",
            //   type: "string",
            //   validation: (rule) => rule.required(),
            // },
            // {
            //   title: "Activar Botón con titulo",
            //   name: "activebuttontitle",
            //   type: "boolean",
            //   initialValue: false,
            //   validation: (rule) => rule.required(),
            // },
            // {
            //   title: "Btntext",
            //   name: "btntext",
            //   type: "string",
            //   validation: (rule) => rule.required(),
            // },
            // {
            //   title: "Link",
            //   name: "link",
            //   type: "string",
            //   validation: (rule) => rule.required(),
            // },
            // {
            //   title: "Image PNG 2000x2000",
            //   name: "img2",
            //   type: "image",
            // },
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
      title: "Banner Home",
      type: "object",
      name: "bannerhome",
      fields: [
        // {
        //   title: "Activar Promo",
        //   name: "activebuttontitle",
        //   type: "boolean",
        //   initialValue: true,
        //   validation: (rule) => rule.required(),
        // },
        {
          title: "Image Desktop(jpg,png) 1920x720",
          name: "imgdeskt",
          type: "image",
          validation: (rule) => rule.required(),
          options: {
            hotspot: true, // <-- Defaults to false
          },
        },
        {
          title: "Image Mobil(jpg,png) 614x777",
          name: "imgmob",
          type: "image",
          validation: (rule) => rule.required(),
          options: {
            hotspot: true, // <-- Defaults to false
          },
        },
        {
          title: "Descripción Imagen",
          name: "desc",
          type: "string",
          validation: (rule) => rule.required(),
        },
        {
          title: "titulo",
          name: "titulo",
          type: "string",
          validation: (rule) => rule.required(),
        },
        {
          title: "description",
          name: "description",
          type: "string",
          validation: (rule) => rule.required(),
        },
        {
          title: "btn text",
          name: "btntext",
          type: "string",
          validation: (rule) => rule.required(),
        },
        {
          title: "Url",
          name: "urlbtn",
          type: "string",
          validation: (rule) => rule.required(),
        },
      ],
    },
    defineField({
      name: "activemodal",
       type: 'boolean',
      title: "Activar Modal",
      
    }),
    {
      title: "Promo Home",
      type: "object",
      name: "promo",
      
      fields: [
        {
          title: "Image(jpg,png,webp) 640x640",
          name: "imgdeskt",
          type: "image",
          validation: (rule) => rule.required(),
          options: {
            hotspot: true, // <-- Defaults to false
          },
        },
        defineField({
          name: "activeurl",
           type: 'boolean',
          title: "Activar Enlace de Imagen",
          
        }),
        {
          title: "Url",
          name: "urlslider",
          type: "string",
          validation: (rule) => rule.required(),
           hidden: ({ parent }) => !parent?.activeurl,

        },
        {
          title: "Descripción Imagen",
          name: "desc",
          type: "string",
          validation: (rule) => rule.required(),
        },
      ],
      hidden: ({ parent }) => !parent?.activemodal,

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
    {
      title: "Product Cards",
      name: "product_cards",
      type: "object",
      fields: [
        {
          name: "active",
          title: "Activar Product Cards",
          type: "boolean",
          initialValue: true,
          description: "Activar o desactivar la sección de product cards",
        },
        {
          name: "cards",
          title: "Tarjetas de Productos",
          type: "array",
          of: [
            {
              title: "Product Card",
              type: "object",
              name: "productCard",
              fields: [
                {
                  title: "Image",
                  name: "image",
                  type: "image",
                  validation: (rule) => rule.required(),
                  options: {
                    hotspot: true,
                  },
                },
                {
                  title: "Alt Text",
                  name: "alt",
                  type: "string",
                  validation: (rule) => rule.required(),
                },
                {
                  title: "Title",
                  name: "title",
                  type: "string",
                  validation: (rule) => rule.required(),
                },
                {
                  title: "Subtitle",
                  name: "subtitle",
                  type: "string",
                  description: "Optional subtitle (e.g., 'THE NEXT GENERATION OF SMART GLASSES')",
                },
                {
                  title: "Description",
                  name: "description",
                  type: "text",
                  description: "Product description",
                },
                {
                  title: "Button Text",
                  name: "buttonText",
                  type: "string",
                  validation: (rule) => rule.required(),
                  initialValue: "Comprar",
                },
                {
                  title: "Link",
                  name: "link",
                  type: "string",
                  validation: (rule) => rule.required(),
                  description: "URL or search query (e.g., '/tienda?search=louis+vuitton')",
                },
              ],
              preview: {
                select: {
                  title: "title",
                  subtitle: "subtitle",
                  media: "image",
                },
                prepare(selection) {
                  const { title, subtitle, media } = selection
                  return {
                    title: title || "Product Card",
                    subtitle: subtitle || "No subtitle",
                    media: media,
                  }
                },
              },
            },
          ],
          validation: (rule) => rule.required().min(1).max(10),
        },
      ],
    },
    {
      title: "Brands & Categories",
      name: "brands_categories",
      type: "object",
      fields: [
        {
          name: "active",
          title: "Activar Brands & Categories",
          type: "boolean",
          initialValue: true,
          description: "Activar o desactivar la sección de marcas y categorías",
        },
        {
          name: "title",
          title: "Título de la Sección",
          type: "string",
          initialValue: "COMPRA LO ÚLTIMO DE SNEAKERS Y STREETWEAR EN PERÚ",
          description: "Título principal de la sección",
        },
        {
          name: "brands",
          title: "Marcas",
          type: "array",
          of: [
            {
              title: "Marca",
              type: "object",
              name: "brand",
              fields: [
                {
                  title: "Nombre",
                  name: "name",
                  type: "string",
                  validation: (rule) => rule.required(),
                },
                {
                  title: "Logo",
                  name: "logo",
                  type: "image",
                  validation: (rule) => rule.required(),
                  options: {
                    hotspot: true,
                  },
                  description: "Logo de la marca (formato recomendado: PNG con fondo transparente)",
                },
                {
                  title: "Link",
                  name: "link",
                  type: "string",
                  validation: (rule) => rule.required(),
                  description: "URL personalizada para la marca (ej: /tienda?search=nike, /categoria/zapatillas)",
                },
                {
                  title: "Color de Fondo",
                  name: "background",
                  type: "string",
                  initialValue: "bg-white",
                  description: "Clase CSS para el color de fondo (ej: bg-red-600, bg-white)",
                },
              ],
              preview: {
                select: {
                  title: "name",
                  media: "logo",
                },
                prepare(selection) {
                  const { title, media } = selection
                  return {
                    title: title || "Marca",
                    media: media,
                  }
                },
              },
            },
          ],
          validation: (rule) => rule.required().min(1).max(20),
        },
        {
          name: "categories",
          title: "Categorías",
          type: "array",
          of: [
            {
              title: "Categoría",
              type: "object",
              name: "category",
              fields: [
                {
                  title: "Nombre",
                  name: "name",
                  type: "string",
                  validation: (rule) => rule.required(),
                },
                {
                  title: "Imagen",
                  name: "image",
                  type: "image",
                  validation: (rule) => rule.required(),
                  options: {
                    hotspot: true,
                  },
                  description: "Imagen de la categoría (formato recomendado: cuadrado)",
                },
                {
                  title: "Link",
                  name: "link",
                  type: "string",
                  validation: (rule) => rule.required(),
                  description: "URL personalizada para la categoría (ej: /tienda?search=zapatillas, /categoria/novedades)",
                },
                {
                  title: "Color de Fondo",
                  name: "background",
                  type: "string",
                  initialValue: "bg-gray-900",
                  description: "Clase CSS para el color de fondo (ej: bg-gray-900, bg-amber-900)",
                },
              ],
              preview: {
                select: {
                  title: "name",
                  media: "image",
                },
                prepare(selection) {
                  const { title, media } = selection
                  return {
                    title: title || "Categoría",
                    media: media,
                  }
                },
              },
            },
          ],
          validation: (rule) => rule.required().min(1).max(20),
        },
      ],
    },
    {
      title: "Trends",
      name: "trends",
      type: "object",
      fields: [
        {
          name: "active",
          title: "Activar Trends",
          type: "boolean",
          initialValue: true,
          description: "Activar o desactivar la sección de trends",
        },
        {
          name: "title",
          title: "Título Principal",
          type: "string",
          initialValue: "TRENDS",
          description: "Título principal de la sección",
        },
        {
          name: "subtitle",
          title: "Subtítulo",
          type: "string",
          initialValue: "Descubre las tendencias más populares en deportes",
          description: "Subtítulo descriptivo de la sección",
        },
        {
          name: "trends_items",
          title: "Items de Trends",
          type: "array",
          of: [
            {
              title: "Trend Item",
              type: "object",
              name: "trendItem",
              fields: [
                {
                  title: "Título",
                  name: "title",
                  type: "string",
                  validation: (rule) => rule.required(),
                  description: "Título del trend (ej: RUNNING, TRAINING)",
                },
                {
                  title: "Subtítulo",
                  name: "subtitle",
                  type: "string",
                  validation: (rule) => rule.required(),
                  description: "Descripción corta del trend",
                },
                {
                  title: "Imagen",
                  name: "image",
                  type: "image",
                  validation: (rule) => rule.required(),
                  options: {
                    hotspot: true,
                  },
                  description: "Imagen de fondo del trend (formato recomendado: 800x600)",
                },
                {
                  title: "Link",
                  name: "link",
                  type: "string",
                  validation: (rule) => rule.required(),
                  description: "URL del trend (ej: /tienda?search=running)",
                },
              ],
              preview: {
                select: {
                  title: "title",
                  subtitle: "subtitle",
                  media: "image",
                },
                prepare(selection) {
                  const { title, subtitle, media } = selection
                  return {
                    title: title || "Trend Item",
                    subtitle: subtitle || "No subtitle",
                    media: media,
                  }
                },
              },
            },
          ],
          validation: (rule) => rule.required().min(1).max(8),
        },
      ],
    },
  ],
  initialValue: {
    activemodal: false,
    modo_mantenimiento: false

  }

});
