import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Products",
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
      validation: (Rule) =>
        Rule.custom((name: any) => {
          if (name.startsWith(" ") || name.substr(-1) === " ") {
            return "No trailing space";
          }

          return true;
        }),
    },
    {
      title: "Description",
      name: "description",
      type: "text",
      validation: (rule) => rule.required(),
    },

    {
      title: "Detalles",
      name: "detalles",
      type: "array",
      of: [{ type: "string" }],
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
                { title: "Kelme", value: "kelme" },
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
      title: "selección",
      name: "seleccion",
      type: "string",

      options: {
        list: [
          { title: "Perú", value: "peru" },
          { title: "Argentina", value: "argentina" },
          { title: "Brasil", value: "brasil" },
          { title: "EEUU", value: "eeuu" },
          { title: "Uruguay", value: "uruguay" },
          { title: "Colombia", value: "colombia" },
          { title: "Chile", value: "chile" },
          { title: "Bolivia", value: "bolivia" },
          { title: "Ecuador", value: "ecuador" },
          { title: "España", value: "espana" },
        ], // <-- predefined values
      },
    },
    {
      title: "Categoría",
      name: "categories",
      type: "string",

      validation: (rule) => rule.required(),
      options: {
        list: [
          { title: "Mochilas", value: "mochilas" },
          { title: "Urbano", value: "urbano" },
          { title: "Casacas", value: "casacas" },
          { title: "Bolsos", value: "bolsos" },
          { title: "Medias", value: "medias" },
          { title: "Chimpunes", value: "chimpunes" },
          { title: "Plataforma", value: "plataforma" },
          { title: "Pelotas ", value: "pelotas" },
          { title: "Terrex", value: "terrex" },
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
          { title: "Básket", value: "basquet" },
          { title: "Training ", value: "training" },
        ], // <-- predefined values
      },
    },
    {
      title: "Colecciones",
      name: "colecciones",
      type: "string",

      options: {
        list: [
          { title: "Adidas Superstar", value: "superstar" },
          { title: "Adidas Rivalry", value: "rivalry" },
          { title: "Adidas Forum", value: "forum" },
          { title: "Adidas Stan Smith", value: "stansmith" },
          { title: "Adidas Samba", value: "samba" },
          { title: "Adidas Gazelle", value: "gazelle" },
          { title: "Adidas Campus", value: "campus" },
          { title: "Adidas Rivalry", value: "rivalry" },
          { title: "Adidas Spezial", value: "spezial" },
          { title: "Adidas Adi2000", value: "adi2000" },
          { title: "Adidas Adilette", value: "adilette" },
          { title: "Adidas Falcon", value: "falcon" },
          { title: "Adidas Adimatic", value: "adimatic" },
          { title: "Adidas Adicolor", value: "adicolor" },
          { title: "Adidas For Her", value: "forher" },
          { title: "Adidas Adventure", value: "adventure" },
          { title: "Adidas Ozweego ", value: "ozweego" },
          { title: "Adidas INJECTION PACK ", value: "injectionpack" },
          { title: "Adidas GRAPHICS ", value: "graphics" },
          { title: "Adidas TREFOIL ESSENTIALS ", value: "trefoilessentials" },
          { title: "Nike Air Max Excee", value: "airmaxexcee" },
          { title: "Nike Air Force 1", value: "airforce1" },
          { title: "Nike Air Max SC", value: "airmaxsc" },
          { title: "Nike Air Max 90", value: "airforcemax90" },
          { title: "Nike Air Jordan", value: "airjordan" },
          { title: "Nike Dunk", value: "dunk" },
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
      title: "Precio Retail (Ecommerce - Catalogo)",
      type: "number",
      validation: (rule) => rule.required(),
    },
    {
      name: "preciomanual",
      title: "Precio Manual (Ignora por completo el descuento global)",
      type: "number",
    },
    {
      name: "stock",
      title: "Stock Total - ( '0' no parece en el catalogo)",
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
    },
    {
      name: "popularidad",
      title: "Popularidad",
      type: "number",
    },
  ],
});
