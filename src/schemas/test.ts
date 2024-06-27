import { defineField, defineType } from "sanity";

export const test = defineType({
  name: "test",
  title: "test",
  type: "document",
  validation: (rule) => rule.required(),

  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),

    {
      name: "slug",
      title: "slug",
      type: "slug",
      options: {
        source: "name",
      },
      validation: (rule) => rule.required(),
    },
    {
      name: "sku",
      title: "sku",
      type: "string",

      validation: (Rule) => Rule.unique(),
    },
    {
      title: "Description",
      name: "description",
      type: "text",
      validation: (rule) => rule.required(),
    },

    {
      title: "Genero",
      name: "genero",
      type: "string",

      validation: (rule) => rule.required(),
      options: {
        list: [
          { title: "Hombre", value: "hombre" },
          { title: "Mujer", value: "mujer" },
          { title: "Niños", value: "niños" },
          { title: "Unisex", value: "unisex" },
        ], // <-- predefined values
      },
    },
    {
      title: "Tipo",
      name: "tipo",
      type: "string",

      validation: (rule) => rule.required(),
      options: {
        list: [
          { title: "Calzado", value: "calzado" },
          { title: "Ropa", value: "ropa" },
          { title: "Accesorios", value: "accesorios" },
        ], // <-- predefined values
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
    {
      title: "Imagen Principal Catalogo(png,webp)",
      name: "imgcatalogomain",
      type: "image",
      validation: (rule) => rule.required(),
    },
    {
      name: "imagescatalogo",
      title: "Images Catalogo (jpg,png,webp)",
      type: "array",
      of: [{ type: "image" }],
      validation: (rule) => rule.required(),
    },
    {
      name: "images",
      title: "Images Ecommerce (jpg,png,webp) 2000x2000",
      type: "array",
      of: [{ type: "image" }],
      validation: (rule) => rule.required(),
    },

    {
      title: "Categoría",
      name: "categories",
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
          { title: "Shorts", value: "shorts" },
          { title: "Polos", value: "polos" },
          { title: "Sandalias", value: "sandalias" },
          { title: "Running", value: "running" },
          { title: "Poleras", value: "poleras" },
          { title: "Tenis", value: "tenis" },
          { title: "Training ", value: "training" },
        ], // <-- predefined values
      },
    },
    {
      name: "color",
      title: "Color",
      type: "string",

      validation: (rule) => rule.required(),
    },
    {
      name: "tallas",
      title: "Tallas Ecommerce",
      type: "array",

      validation: (rule) => rule.required(),
      of: [
        defineField({
          title: "Tallas y Stock",
          type: "object",
          name: "Tallas y Stock ",
          validation: (rule) => rule.required(),

          fields: [
            {
              title: "Talla",
              name: "talla",
              type: "string",
            },
            {
              title: "Stock",
              name: "stock",
              type: "number",
            },
          ],
        }),
      ],
    },

    {
      name: "tallascatalogo",
      title: "Tallas Catalogo",
      type: "string",

      validation: (rule) => rule.required(),
    },

    {
      name: "priceecommerce",
      title: "Precio Ecommerce",
      type: "number",
      validation: (rule) => rule.required(),
    },
    {
      name: "pricemayorista",
      title: "Precio Mayorista",
      type: "number",
      validation: (rule) => rule.required(),
    },
    {
      name: "priceemprendedor",
      title: "Precio Emprendedor",
      type: "number",
      validation: (rule) => rule.required(),
    },
    {
      name: "preciotest",
      title: "test price",
      type: "number",
      validation: (rule) => rule.required(),
    },
    {
      name: "stock",
      title: "Stock Total",
      type: "number",
      validation: (rule) => rule.required(),
    },
    {
      title: "Razon Social",
      name: "razonsocial",
      type: "string",
      validation: (rule) => rule.required(),
      options: {
        list: [
          { title: "Fritz Sport", value: "fritzsport" },
          { title: "Fritz Duran", value: "fritzduran" },
          { title: "Alexander Skate", value: "alexanderskate" },
        ], // <-- predefined values
      },
      initialValue: {
        fritzsport: false,
      },
    },
    {
      title: "Tipo de Producto",
      name: "tipoproducto",
      type: "string",
      validation: (rule) => rule.required(),
      options: {
        list: [
          { title: "Catalogo", value: "catalogo" },
          { title: "Web", value: "web" },
        ], // <-- predefined values
      },
      initialValue: {
        catalogo: false,
      },
    },

    {
      name: "descuento",
      title: "Descuento Ecommerce",
      type: "number",
      validation: (rule) => rule.required(),
    },
  ],
});
