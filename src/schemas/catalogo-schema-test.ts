import { defineField, defineType } from "sanity";

export const catalogo = defineType({
  name: "catalogo_test",
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
    defineField({
      name: "modo_mantenimiento",
       type: 'boolean',
      title: "Modo Mantenimiento",
      // initialValue:true,
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
                  { title: "Joma", value: "joma" },
                  { title: "Kelme", value: "kelme" },
                           // { title: "Kelme", value: "kelme" },
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
      title: "slidercatalogo",
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
                  { title: "Umbro", value: "umbro" },

                  { title: "Reebok", value: "reebok" },
                  { title: "Cat", value: "cat" },
                  { title: "Fritz Sport", value: "fritzsport" },
                  { title: "Joma", value: "joma" },
                   { title: "Kelme", value: "kelme" },
                ], // <-- predefined values
              },
            },
            {
              title: "Imagen Portada Marca General (png,webp)2480x3505px ",
              name: "imgmarca",
              type: "image",
              // validation: (rule) => rule.required(),
            },
            {
              title: "Imagen Portada Temporada General (png,webp)2480x3505px ",
              name: "fritzsport",
              type: "image",
              // validation: (rule) => rule.required(),
            },
            {
              title: "Imagen Portada Liquidacón General (png,webp)2480x3505px ",
              name: "fritzduran",
              type: "image",
              // validation: (rule) => rule.required(),
            },
            // info pdf img
            {
              name: "export_pdf_info",
              title: "EXPORT PDF INFO",
              type: "object", // Cambiar de "document" a "object"
           
              fields:[
        
                {
                  title: "Imagen Fondo PDF(png,jpg) 2480px/3505px",
                  name: "imgfondo",
                  type: "image",
                  validation: (rule) => rule.required(),
                },
                {
                  title: "Imagen Fondo Precio Principal(png,jpg) 765px/75px",
                  name: "fondo_precio_principal",
                  type: "image",
                  validation: (rule) => rule.required(),
                },
                {
                  title: "Imagen Fondo Tallas(png,jpg) 752px/146px",
                  name: "fondo_tallas",
                  type: "image",
                  validation: (rule) => rule.required(),
                },
                {
                  title: "Imagen Fondo Marca(png,jpg) 416px/221px",
                  name: "fondo_marca",
                  type: "image",
                  validation: (rule) => rule.required(),
                },
                {
                  title: "Imagen Fondo Descuento(png,jpg) 617px/244px",
                  name: "fondo_descuento",
                  type: "image",
                  validation: (rule) => rule.required(),
                },
              ],
              options: {
                collapsible: true, // Permite que este campo sea colapsable para mayor organización.
                collapsed: false,  // Define si está abierto por defecto.
              },
            },
        
            {
              title: "Imagen PROMO HOMBRE General(png,webp)2480x3505px",
              name: "imgPromoHombre",
              type: "image",
              // validation: (rule) => rule.required(),
            },
            {
              title: "Imagen Portada Hombre General(png,webp)2480x3505px",
              name: "imghombre",
              type: "image",
              // validation: (rule) => rule.required(),
            },
            {
              title: "Imagen PROMO MUJER General(png,webp)2480x3505px",
              name: "imgPromoMujer",
              type: "image",
              // validation: (rule) => rule.required(),
            },
            {
              title: "Imagen Portada Mujer General(png,webp)2480x3505px",
              name: "imgmujer",
              type: "image",
              // validation: (rule) => rule.required(),
            },
            {
              title: "Imagen PROMO NIÑOS General(png,webp)2480x3505px",
              name: "imgPromoNinos",
              type: "image",
              // validation: (rule) => rule.required(),
            },
            {
              title: "Imagen Portada Niños General(png,webp)2480x3505px",
              name: "imgninos",
              type: "image",
              // validation: (rule) => rule.required(),
            },
      
            {
              title: "Imagen Portada Bebés General(png,webp)2480x3505px",
              name: "imgbebes",
              type: "image",
              validation: (rule) => rule.required(),
            },
            {
              title: "Imagen Portada Nino/Niña General(png,webp)2480x3505px",
              name: "imgninonina",
              type: "image",
              validation: (rule) => rule.required(),
            },
            {
              title: "Imagen Portada Joven General(png,webp)2480x3505px",
              name: "imgjoven",
              type: "image",
              validation: (rule) => rule.required(),
            },
            {
              title: "Imagen Portada Unisex General(png,webp)2480x3505px",
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
                      title: "Portada Categoria",
                      name: "category",
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
                          { title: "Bicicleta ", value: "bicicleta" },
                          { title: "Senderismo ", value: "senderismo" },
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
    {
      name: "catalogoclient",
      title: "Portadas Catalogo Clientes",
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
                  { title: "Adidas", value: "adidas" },
                  { title: "Umbro", label: "umbro" },

                  { title: "Nike", value: "nike" },
                  { title: "Puma", value: "puma" },
                  { title: "Reebok", value: "reebok" },
                  { title: "Cat", value: "cat" },
                  { title: "Fritz Sport", value: "fritzsport" },
                  { title: "Joma", value: "joma" },
                   { title: "Kelme", value: "kelme" },
                ], // <-- predefined values
              },
            },
            {
              title: "Imagen Portada Marca General (png,webp)2480x3505px ",
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
              title: "Imagen Portada Hombre General(png,webp)2480x3505px",
              name: "imghombre",
              type: "image",
              validation: (rule) => rule.required(),
            },
            {
              title: "Imagen Portada Mujer General(png,webp)2480x3505px",
              name: "imgmujer",
              type: "image",
              validation: (rule) => rule.required(),
            },
            {
              title: "Imagen Portada Niños General(png,webp)2480x3505px",
              name: "imgninos",
              type: "image",
              validation: (rule) => rule.required(),
            },
            {
              title: "Imagen Portada Unisex General(png,webp)2480x3505px",
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
                      title: "Portada Categoria",
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
                          { title: "Guantes", value: "guantes" },
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




    {
      name: 'cuenta',
      type: 'array',
      title: 'Cuenta',
      description: 'Lista de cuentas bancarias',
      of: [
        {
          type: 'object',
          title: 'Cuenta Bancaria',
          fields: [
            {
              name: 'bank',
              type: 'string',
              title: 'Nombre de cuenta bancaria',
              description: 'Name of the bank',
              validation: (Rule) =>
                Rule.required().error('The bank name is required.'),
            },
            {
              name: 'account',
              type: 'string',
              title: 'Numero de cuenta',
              description: 'The account number for the bank',
              validation: (rule) => rule.required(),
            },
            {
              name: 'cci',
              type: 'string',
              title: 'CCI',
              description: 'Código interbancario',
              
              validation: (rule) => rule.required(),
            },
          ],
        },
      ],
    },
    
    

  ],
});
