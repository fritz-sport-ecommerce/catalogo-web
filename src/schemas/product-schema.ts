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
      title: 'Género',
      name: 'genero',
      type: 'string',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: 'Hombre', value: 'hombre' },
          { title: 'Mujer', value: 'mujer' },
          { title: 'Unisex', value: 'unisex' },
          { title: 'Niños', value: 'niños' },
        ],
      },
    },

    // defineField({
    //   title: 'Subgénero',
    //   name: 'subgenero',
    //   type: 'string',
    //   options: {
    //     list: [
    //       { title: 'Hombre', value: 'hombre' },
    //       { title: 'Mujer', value: 'mujer' },
    //     ],
    //   },
    //   hidden: ({ parent }) => !parent?.genero || parent.genero !== 'unisex',
    // }),

    defineField({
      title: 'Subgénero Niños',
      name: 'subgenero_ninos',
      type: 'string',
      options: {
        list: [
          { title: 'Bebe', value: 'bebe' },
          { title: 'Niño/Niña', value: 'ninonina' },
          { title: 'Joven', value: 'joven' },

        ],
      },
      hidden: ({ parent }) => !parent?.genero || parent.genero !== 'niños',
    }),

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
          { title: "Umbro", value: "umbro" },

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
          { title: "Guantes", value: "guantes" },
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
          { title: "Adidas Top Ten", value: "top_ten" },
          { title: "Adidas Adifom Climacool", value: "adifom_climacool" },


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
          { title: "Nike Air Force l lvl 8 3 BG", value: "airforce1_lvl_8_3_bg" },

          { title: "Nike Air Max SC", value: "airmaxsc" },
          { title: "Nike Air Plus Drift", value: "airmax_plus_drift" },

          { title: "Nike Air Max 90", value: "airforcemax90" },
          { title: "Nike Air Max 1 ESS BTS", value: "airforcemax_1_ess_bts" },

          
         
          { title: "Nike Air Jordan", value: "airjordan" },
          { title: "Nike Air Jordan 1 mid", value: "airjordan_1_mid" },

          { title: "Nike Air Jordan 1 Low", value: "airjordan_1_low" },

          { title: "Nike Air Jordan 1 W LOW SE", value: "airjordan_1_w_low_se" },
          
          { title: "Nike Air Jordan 4 RM", value: "airjordan_4_rm" },
          { title: "Nike Air Jordan 6 WMNS RET", value: "airjordan_6_wmns_ret" },


          { title: "Nike WMNS Air Jordan 1 MM", value: "airjordan_wmns_1_mm" },

          { title: "Nike WMNS Air Jordan 3 MM", value: "airjordan_wmns_3_mm" },
          { title: "Nike WMNS Air Jordan 4 RM", value: "airjordan_wmns_4_wm" },

          

          { title: "Nike Dunk", value: "dunk" },
          { title: "Nike Dunk Low Prm", value: "dunk_low_prm" },
          { title: "Nike Dunk Low Retro S", value: "dunk_low_retro_s" },

          { title: "Nike Jordan MVP", value: "jordan_mvp" },
          { title: "Nike W AF1 Shadow", value: "w_af1_shadow" },
         
          { title: "Nike Jordan SPIZIKE LOW", value: "jordan_spizike_low" },
          { title: "Nike Jordan SPIZIKE LOW BG", value: "jordan_spizike_low_bg" },
          { title: "Nike Jordan 3 Retro", value: "jordan_3_retro" },
          { title: "Nike Jordan 3 Retro BG", value: "jordan_3_retro_bg" },


          { title: "Nike Jordan TATUM 2", value: "jordan_tatum_2" },


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
      name: "pricemayorista",
      title: "Precio Mayorista(*opcional)",
      type: "number",
    },
    {
      name: "priceemprendedor",
      title: "Precio Emprendedor(*opcional)",
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
    // {
    //   name: "descuento (*al no tener descuento Global aplica )",
    //   title: "Descuento Ecommerce",
    //   type: "number",
    // },
    {
      name: "descuentosobred",
      title: "Descuento Sobre Descuento (*Ingora el descuento Global)",
      type: "number",
    },
    {
      name: "popularidad",
      title: "Popularidad",
      type: "number",
    },
    
  ],
});