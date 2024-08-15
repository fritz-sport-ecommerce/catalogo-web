import { defineField, defineType } from "sanity";

export const catalogo = defineType({
  name: "catalogo",
  title: "Catalogo",
  type: "document",
  validation: (rule) => rule.required(),

  fields: [
    defineField({
      name: "name",
      title: "Nombre de Archivo",
      type: "string",
      validation: (rule) => rule.required(),
    }),
        {
      name: "catalogospdf",
      title: "Lista de Catalogos PDF",
      type: "array",
      of:[

        {
          title: ' PDF',
          name: 'pdf',
          type: 'file',
          fields: [
            {
              name: 'titulo',
              type: 'string',
              title: 'Titulo'
            },
            {
              name: 'mes',
              type: 'string',
              title: 'Mes'
            },
            {
              title: "Image (jpg,png,webp) 595pxx495px",
              name: "imgdw",
              type: "image",
              validation: (rule) => rule.required(),
              options: {
                hotspot: true, // <-- Defaults to false
              },
            },
            {
              title: "Marca",
              name: "marca",
              type: "string",
        
              validation: (rule) => rule.required(),
              options: {
                list: [
                  { title: "Adidas", value: "adidas" },
                  { title: "Nike", value: "nike" },
                  { title: "Puma", value: "puma" },
                  { title: "Reebok", value: "reebok" },
                  { title: "Cat", value: "cat" },
                  { title: "Fritz Sport", value: "fritzsport" },
                  { title: "joma", value: "joma" },
                ], // <-- predefined values
              },
            },
            
            // {
            //   name: 'author',
            //   type: 'reference',
            //   title: 'Author',
            //   to: {type: 'person'}
            // }
          ]
        },
      ]
    },
    {
      name: "slider",
      title: "Slider catalogo",
      type: "array",
      of: [
        {
          title: "Slider",
          type: "object",
          name: "slidercatalogo",
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
      name: "catalogo",
      title: "Portadas Catalogo",
      type: "array",
      of: [
        {
          title: "Marca",
          type: "object",
          name: "marca",
          fields: [
            {
              title: "Marca",
              name: "marca",
              type: "string",
              validation: (rule) => rule.required(),

              options: {
                list: [
                  { title: "Adidas", value: "adidas" },
                  { title: "Nike", value: "nike" },
                  { title: "Puma", value: "puma" },
                  { title: "Reebok", value: "reebok" },
                  { title: "Cat", value: "cat" },
                  { title: "Fritz Sport", value: "fritzsport" },
                  { title: "joma", value: "joma" },
                ], // <-- predefined values
              },
            },
            {
              title: "Imagen Portada Marca General(png,webp)",
              name: "imgmarca",
              type: "image",
              validation: (rule) => rule.required(),
            },
            {
              title: "Imagen Fondo Producto(png,webp) 2480pxx3505px",
              name: "imgfondo",
              type: "image",
              validation: (rule) => rule.required(),
            },
            {
              title: "Imagen Portada Hombre General(png,webp)",
              name: "imghombre",
              type: "image",
              validation: (rule) => rule.required(),
            },
            {
              title: "Imagen Portada Mujer General(png,webp)",
              name: "imgmujer",
              type: "image",
              validation: (rule) => rule.required(),
            },
            {
              title: "Imagen Portada Niños General(png,webp)",
              name: "imgninos",
              type: "image",
              validation: (rule) => rule.required(),
            },
            {
              title: "Imagen Portada Unisex General(png,webp)",
              name: "imgunisex",
              type: "image",
              validation: (rule) => rule.required(),
            },

            {
              name: "categorias",
              title: "Categorias",
              type: "array",
              of: [
                {
                  title: "Categoría",
                  type: "object",
                  name: "categoria",
                  fields: [
                    {
                      title: "Marca",
                      name: "category",
                      type: "string",
                      validation: (rule) => rule.required(),

                      options: {
                        list: [
                          { title: "Mochilas", value: "mochilas" },
                          { title: "Terrex", value: "terrex" },
                          { title: "Urbano", value: "urbano" },
                          { title: "Casacas", value: "casacas" },
                          { title: "Bolsos", value: "bolsos" },
                          { title: "Medias", value: "medias" },
                          { title: "Chimpunes", value: "chimpunes" },
                          { title: "Peloteras", value: "peloteras" },
                          { title: "Plataforma", value: "plataforma" },
                          { title: "Originals", value: "originals" },
                          { title: "Camisetas", value: "camisetas" },
                          { title: "Toma todo", value: "tomatodos" },
                          { title: "Medias", value: "medias" },
                          { title: "Buzos", value: "buzos" },
                          { title: "Escolar", value: "escolar" },
                          { title: "Pantalón", value: "pantalon" },
                          { title: "Gorras", value: "gorras" },
                          { title: "shorts", value: "shorts" },
                          { title: "Polos", value: "polos" },
                          { title: "Sandalias", value: "sandalias" },
                          { title: "Running", value: "running" },
                          { title: "Tenis", value: "tenis" },
                          { title: "Básket", value: "basquet" },
                          { title: "Training ", value: "training" },
                        ], // <-- predefined values
                      },
                    },
                    {
                      title: "Imagen Portada Categoría General(png,webp)",
                      name: "imgcategoria",
                      type: "image",
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
