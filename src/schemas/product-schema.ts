import { defineField, defineType } from "sanity";
import CustomNameInput from "./custom/custom-name";
import CustomSkuInput from "./custom/custom-sku";
import CustomDateInput from "./custom/custom-data";
import CategorySelect from "./custom/custom-categories";

export const product = defineType({
  name: "product",
  title: "Products",
  type: "document",
  validation: (rule) => rule.required(),

  fields: [
    // Nuevo campo para estado activo/inactivo del producto
    defineField({
      name: "activo",
      title: "Producto Activo",
      type: "boolean",
      description: "Indica si el producto está activo y visible en el sitio",
      initialValue: true,
      hidden: ({ parent }) => parent?.empresa == undefined,
    }),

    {
      name: "linea_liquidacion",
      title: "Producto en Linea o Liquidacion",
      type: "string",
      initialValue: "liquidacion",
      options: {
        list: [
          { title: "Línea", value: "linea" },
          { title: "Liquidación", value: "liquidacion" },
        ],
        layout: "radio",
      },
    },

    defineField({
      name: "name",
      title: "Name",
      type: "string",

      components: {
        input: CustomNameInput, // Vincula el componente personalizado
      },
    }),

    {
      name: "slug",
      title: "slug",
      type: "slug",
      options: {
        source: "name",
      },
      // validation: (rule) => rule.required(),
    },
    {
      name: "sku",
      title: "SKU",
      type: "string",
      components: {
        input: CustomSkuInput, // Vincula el componente personalizado
      },

      validation: (Rule) =>
        Rule.custom((value) => {
          if (typeof value === "string") {
            // Verificar que el valor sea una cadena
            // Eliminar los espacios al principio y al final
            const trimmedValue = value.trim();

            // Verificar si el valor contiene espacios en medio
            if (/\s/.test(trimmedValue)) {
              return "No se permiten espacios en el medio.";
            }

            // Verificar si el valor original tiene espacios al principio o al final
            if (value !== trimmedValue) {
              return "Sin espacios iniciales o finales";
            }
          } else if (value) {
            // Si el valor no es una cadena pero tiene algún valor, retornar error
            return "Invalid value";
          }

          return true;
        }),
    },
    {
      title: "Empresa",
      name: "empresa",
      type: "string",
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: "Fritz Sport", value: "fritz_sport" },
          { title: "Fz Premium", value: "fz_premium" },
        ],
      },
    },

    {
      title: "Marca",
      name: "marca",
      type: "string",
      hidden: ({ parent }) => parent?.empresa == undefined,

      validation: (rule) => rule.required(),
      options: {
        list: [
          { title: "Adidas", value: "adidas" },
          { title: "Nike", value: "nike" },
          { title: "Puma", value: "puma" },
          { title: "Under Armour", value: "under-armour" },

          { title: "Umbro", value: "umbro" },
          { title: "Hurley", value: "hurley" },
          { title: "Lotto", value: "lotto" },
          { title: "Reebok", value: "reebok" },
          { title: "Cat", value: "cat" },
          { title: "Fritz Sport", value: "fritzsport" },
          { title: "joma", value: "joma" },
          { title: "Kelme", value: "kelme" },
        ], // <-- predefined values
      },
    },
    {
      title: "Colecciones",
      name: "colecciones",
      type: "string",
      hidden: true,
      validation: (Rule) => Rule.required(),

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
          {
            title: "Nike Air Force l lvl 8 3 BG",
            value: "airforce1_lvl_8_3_bg",
          },

          { title: "Nike Air Max SC", value: "airmaxsc" },
          { title: "Nike Air Plus Drift", value: "airmax_plus_drift" },

          { title: "Nike Air Max 90", value: "airforcemax90" },
          { title: "Nike Air Max 1 ESS BTS", value: "airforcemax_1_ess_bts" },

          { title: "Nike Air Jordan", value: "airjordan" },
          { title: "Nike Air Jordan 1 mid", value: "airjordan_1_mid" },

          { title: "Nike Air Jordan 1 Low", value: "airjordan_1_low" },

          {
            title: "Nike Air Jordan 1 W LOW SE",
            value: "airjordan_1_w_low_se",
          },

          { title: "Nike Air Jordan 4 RM", value: "airjordan_4_rm" },
          {
            title: "Nike Air Jordan 6 WMNS RET",
            value: "airjordan_6_wmns_ret",
          },

          { title: "Nike WMNS Air Jordan 1 MM", value: "airjordan_wmns_1_mm" },

          { title: "Nike WMNS Air Jordan 3 MM", value: "airjordan_wmns_3_mm" },
          { title: "Nike WMNS Air Jordan 4 RM", value: "airjordan_wmns_4_wm" },

          { title: "Nike Dunk", value: "dunk" },
          { title: "Nike Dunk Low Prm", value: "dunk_low_prm" },
          { title: "Nike Dunk Low Retro S", value: "dunk_low_retro_s" },

          { title: "Nike Jordan MVP", value: "jordan_mvp" },
          { title: "Nike W AF1 Shadow", value: "w_af1_shadow" },

          { title: "Nike Jordan SPIZIKE LOW", value: "jordan_spizike_low" },
          {
            title: "Nike Jordan SPIZIKE LOW BG",
            value: "jordan_spizike_low_bg",
          },
          { title: "Nike Jordan 3 Retro", value: "jordan_3_retro" },
          { title: "Nike Jordan 3 Retro BG", value: "jordan_3_retro_bg" },

          { title: "Nike Jordan TATUM 2", value: "jordan_tatum_2" },
        ], // <-- predefined values
      },
    },
    {
      title: "Género",
      name: "genero",
      type: "string",
      hidden: ({ parent }) => parent?.empresa == undefined,
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: "Hombre", value: "hombre" },
          { title: "Mujer", value: "mujer" },
          { title: "Unisex", value: "unisex" },
          { title: "Niños", value: "niños" },
        ],
      },
    },
    defineField({
      name: "ninos_talla_grande",
      title: "Niños talla pequeña",
      type: "boolean",
      description: "este producto también aparecerá en Mujer",
      initialValue: false,
      hidden: ({ parent }) => parent?.genero != "niños",
    }),
    defineField({
      title: "Subgénero Niños",
      name: "subgenero_ninos",
      type: "string",
      options: {
        list: [
          { title: "Bebe", value: "bebe" },
          { title: "Niño/Niña", value: "ninonina" },
          { title: "Joven", value: "joven" },
        ],
      },
      hidden: ({ parent }) =>
        !parent?.genero ||
        parent.genero !== "niños" ||
        parent?.empresa == undefined,
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
      title: "Categoría",
      name: "categories",
      type: "string",
      components: {
        input: CategorySelect,
      },
      validation: (rule) => rule.required(),
    },

    {
      title: "selección",
      name: "seleccion",
      type: "string",
      hidden: ({ parent }) => parent?.categories != "camisetas",

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
      title: "Description",
      name: "description",
      type: "text",
      validation: (rule) => rule.required(),
      hidden: ({ parent }) => parent?.empresa == undefined,
    },

    {
      hidden: true,

      title: "Detalles",
      name: "detalles",
      type: "array",
      of: [{ type: "string" }],
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

    {
      hidden: ({ parent }) => parent?.empresa == undefined,

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
      // validation: (rule) => rule.required(),
      hidden: true,
    },
    {
      hidden: ({ parent }) => parent?.empresa == undefined,

      name: "images",
      title: "Images Ecommerce (jpg,png,webp) 2000x2000",
      type: "array",
      of: [{ type: "image" }],
      validation: (rule) => rule.required(),
    },

    {
      name: "color",
      title: "Color",
      type: "string",
      hidden: true,

      validation: (rule) => rule.required(),
    },
    {
      name: "tallas",
      title: "Tallas Ecommerce",
      type: "array",
      hidden: true,

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
    defineField({
      name: "precio_manual",
      title: "Precio manual",
      type: "boolean",
      description: "Indica si el precio sera manual",
      initialValue: true,
      hidden: ({ parent }) => parent?.empresa == undefined,
    }),
    {
      hidden: ({ parent }) =>
        !parent?.precio_manual || parent?.empresa == undefined,
      name: "tallascatalogo",
      title: "Tallas Catalogo",
      type: "string",
      validation: (rule) => rule.required(),
    },

    {
      hidden: ({ parent }) =>
        !parent?.precio_manual || parent?.empresa == undefined,

      name: "priceecommerce",
      title: "Precio Retail",
      type: "number",

      validation: (rule) => rule.required(),
    },
    {
      hidden: ({ parent }) =>
        !parent?.precio_manual || parent?.empresa == undefined,

      name: "pricemayorista",
      title: "Precio Mayorista",
      type: "number",
      validation: (rule) => rule.required(),
    },
    {
      hidden: ({ parent }) =>
        !parent?.precio_manual || parent?.empresa == undefined,
      name: "priceemprendedor",
      title: "Precio Emprendedor",
      type: "number",
      validation: (rule) => rule.required(),
    },
    {
      hidden: true,

      name: "preciomanual",
      title: "Precio Manual (Ignora por completo el descuento global)",
      type: "number",
    },

    {
      name: "precio_interesport",
      title: "Precio Interesport",
      type: "number",
    },
    {
      name: "tipo_precio_interesport",
      title: "Tipo Precio Interesport",
      type: "string",
      initialValue: "linea",
      options: {
        list: [
          { title: "Línea", value: "linea" },
          { title: "Liquidación", value: "liquidacion" },
        ],
        layout: "radio",
      },
    },

    {
      name: "precio_hiperatos",
      title: "Precio Hiperatos",
      type: "number",
    },
    {
      name: "tipo_precio_hiperatos",
      title: "Tipo Precio Hiperatos",
      type: "string",
      initialValue: "linea",
      options: {
        list: [
          { title: "Línea", value: "linea" },
          { title: "Liquidación", value: "liquidacion" },
        ],
        layout: "radio",
      },
    },

    {
      name: "precio_full_deport",
      title: "Precio Full Deport",
      type: "number",
    },
    {
      name: "tipo_precio_full_deport",
      title: "Tipo Precio Full Deport",
      type: "string",
      initialValue: "linea",
      options: {
        list: [
          { title: "Línea", value: "linea" },
          { title: "Liquidación", value: "liquidacion" },
        ],
        layout: "radio",
      },
    },

    {
      name: "precio_yolu",
      title: "Precio Yolu",
      type: "number",
    },
    {
      name: "tipo_precio_yolu",
      title: "Tipo Precio Yolu",
      type: "string",
      initialValue: "linea",
      options: {
        list: [
          { title: "Línea", value: "linea" },
          { title: "Liquidación", value: "liquidacion" },
        ],
        layout: "radio",
      },
    },

    {
      hidden: true,

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
      initialValue: async () => "fritzsport", // Asignar 'ropa' si no tiene valor
    },
    {
      hidden: true,

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
      hidden: ({ parent }) => parent?.empresa == undefined,

      name: "descuentosobred",
      title: "Descuento Sobre Descuento (*Ingora el descuento Global)",
      type: "number",
    },
    {
      name: "popularidad",
      title: "Popularidad",
      type: "number",
      hidden: ({ parent }) => parent?.empresa == undefined,
    },
    {
      name: "cantidadVendidos",
      title: "Cantidad Vendidos",
      type: "number",
      description: "Número total de unidades vendidas de este producto",
      initialValue: 0,
      hidden: ({ parent }) => parent?.empresa == undefined,
    },
    {
      hidden: true,
      name: "stock",
      title: "Stock General",
      type: "number",
    },
    defineField({
      name: "fechaIngreso",
      title: "Fecha de Ingreso (aparece pero con la fecha de ingreso)",
      type: "datetime",
      components: {
        input: CustomDateInput, // Vincula el componente personalizado
      },
      hidden: ({ parent }) => parent?.empresa == undefined,
    }),
    defineField({
      name: "fecha_cuando_aparece",
      title: "Fecha disponible (fecha en la que estara disponible el producto)",
      type: "datetime",
      components: {
        input: CustomDateInput, // Vincula el componente personalizado
      },
      hidden: ({ parent }) => parent?.empresa == undefined,
    }),

    defineField({
      name: "esNuevo",
      title: "Mostrar como Nuevo",
      type: "boolean",
      description:
        "Marca esta casilla si quieres que el producto aparezca como NUEVO",
      initialValue: false,
      hidden: ({ parent }) => parent?.empresa == undefined,
    }),
    defineField({
      name: "fechaNuevo",
      title: "Fecha hasta cuando es Nuevo",
      type: "date",
      description:
        "Selecciona hasta qué fecha el producto debe mostrarse como nuevo (opcional)",
      hidden: ({ parent }) => !parent?.esNuevo || parent?.empresa == undefined,
    }),
  ],
  initialValue: {
    mujer_talla_pequena: false,
    activo: true,
    esNuevo: false,
    precio_manual: false,
  },
});
