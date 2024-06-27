import { defineField } from "sanity";

const user = {
  name: "user",
  title: "user",
  type: "document",
  fields: [
    defineField({
      name: "isAdmin",
      title: "Is Admin",
      type: "boolean",
      description: "Check if the user is admin",
      initialValue: false,
      validation: (Rule) => Rule.required(),
      //   readOnly: true,
      //   hidden: true,
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "Name of the user",
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "url",
    }),
    defineField({
      name: "password",
      type: "string",
      hidden: true,
    }),
    defineField({
      title: "Intereses Sku",
      name: "intereses",
      type: "array",
      of: [{ type: "string" }],
    }),

    defineField({
      name: "email",
      type: "string",
      title: "Email",
    }),

    defineField({
      name: "apellidos",
      type: "string",
      title: "Apellido",
    }),

    defineField({
      name: "telefono",
      type: "string",
      title: "Telefono",
    }),
    defineField({
      name: "documento",
      type: "string",
      title: "Documento",
    }),
    defineField({
      name: "direccion",
      type: "string",
      title: "direccion",
    }),
    defineField({
      name: "infadi",
      type: "string",
      title: "Información Addicional",
    }),
    defineField({
      name: "factura",
      type: "string",
      title: "Factura",
    }),
    defineField({
      name: "departamento",
      type: "string",
      title: "Departamento",
    }),
    defineField({
      name: "provincia",
      type: "string",
      title: "Provincia",
    }),
    defineField({
      name: "distrito",
      type: "string",
      title: "Distrito",
    }),
    defineField({
      name: "emailVerified",
      type: "datetime",
      hidden: true,
    }),
    defineField({
      name: "about",
      title: "About",
      type: "text",
      description: "A brief dsecription about the user",
    }),
  ],
};

export default user;
