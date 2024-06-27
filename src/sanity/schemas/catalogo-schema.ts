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
              title: "Imagen Header Catalogo(png,webp)",
              name: "imgheader",
              type: "image",
              validation: (rule) => rule.required(),
            },
            {
              title: "Imagen Footer Catalogo(png,webp)",
              name: "imgfooter",
              type: "image",
              validation: (rule) => rule.required(),
            },
            {
              title: "Imagen Price Catalogo(png,webp) 155pxx65px",
              name: "imgprice",
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
                          { title: "Plataforma", value: "plataforma" },
                          { title: "Originals", value: "originals" },
                          { title: "Camisetas", value: "camisetas" },
                          { title: "Toma todo", value: "tomatodos" },

                          { title: "Buzos", value: "buzos" },
                          { title: "Escolar", value: "escolar" },
                          { title: "Pantalón", value: "pantalon" },
                          { title: "Gorras", value: "gorras" },
                          { title: "shorts", value: "shorts" },
                          { title: "Polos", value: "polos" },
                          { title: "Sandalias", value: "sandalias" },
                          { title: "Running", value: "running" },
                          { title: "Poleras", value: "poleras" },
                          { title: "Básquet", value: "basquet" },
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
