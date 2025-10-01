import { defineField } from "sanity";

const user = {
  name: "user",
  title: "User",
  type: "document",
  fields: [
    // Rol obligatorio
    defineField({
      name: "role",
      title: "Rol",
      type: "string",
      description: "Rol del usuario",
      options: {
        list: [
          { title: "Vendedor Mayorista", value: "mayorista" },
          { title: "Call Center", value: "callcenter" },
          { title: "Vendedor Emprendedor", value: "emprendedor" },
          { title: "Admin", value: "admin" },
          { title: "Usuario", value: "user" }, // default
        ],
        layout: "radio",
      },
      initialValue: "user",
      validation: (Rule) => Rule.required(),
    }),

    // Flags
    defineField({
      name: "isAdmin",
      title: "Is Admin",
      type: "boolean",
      description: "Check if the user is admin",
      initialValue: false,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "newuser",
      type: "boolean",
      title: "Nuevo usuario",
      initialValue: true,
    }),

    // Datos personales básicos
    defineField({
      name: "name",
      title: "Nombres y Apellidos",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "apellidos",
      type: "string",
      title: "Apellidos",
    }),
    defineField({
      name: "documento",
      type: "string",
      title: "N° DNI",
    }),
    defineField({
      name: "fechaNacimiento",
      type: "date",
      title: "Fecha de Nacimiento",
    }),
    defineField({
      name: "telefono",
      type: "string",
      title: "N° Celular",
    }),
    defineField({
      name: "email",
      type: "string",
      title: "Email",
    }),

    // Imagen de perfil
    defineField({
      name: "image",
      title: "Imagen del Usuario",
      type: "url",
    }),

    // 🔽 Razón social como select
    defineField({
      name: "razonSocial",
      title: "Razón Social (Vendedor)",
      type: "string",
      options: {
        list: [
          { title: "Fritz Sport", value: "fritz_sport" },
          { title: "Fritz Durand", value: "fritz_durand" },
          { title: "Alexander Skate", value: "alexander" },
        ],
        layout: "dropdown",
      },
    }),

    // 🔽 Sede con lista predefinida
    defineField({
      name: "sede",
      title: "Sede",
      type: "string",
      options: {
        list: [
          { title: "Huánuco", value: "huanuco" },
          { title: "Iquitos", value: "iquitos" },
          { title: "Grau", value: "grau" },
          { title: "Los Olivos", value: "losolivos" },
          { title: "Tumbes", value: "tumbes" },
        ],
        layout: "dropdown",
      },
    }),

    defineField({
      name: "fechaIngreso",
      type: "date",
      title: "Fecha de Ingreso",
    }),
    defineField({
      name: "area",
      type: "string",
      title: "Área",
    }),
    defineField({
      name: "cargo",
      type: "string",
      title: "Cargo",
    }),

    // Datos de ubicación
    defineField({
      name: "direccion",
      type: "string",
      title: "Dirección",
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

    // Información extra
    defineField({
      name: "infadi",
      type: "string",
      title: "Información Adicional",
    }),
    defineField({
      name: "factura",
      type: "string",
      title: "Factura",
    }),
    defineField({
      title: "Intereses Sku",
      name: "intereses",
      type: "array",
      of: [{ type: "string" }],
    }),

    // Metadata interna
    defineField({
      name: "password",
      type: "string",
      hidden: true,
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
      description: "Breve descripción del usuario",
    }),
    // Códigos de verificación temporales simultáneos (cada uno vence en 15 min)
    defineField({
      name: "verificationCodes",
      title: "Códigos de verificación",
      type: "array",
      hidden: true,
      of: [
        {
          type: "object",
          name: "vendorVerification",
          fields: [
            { name: "code", title: "Código", type: "string" },
            { name: "expiresAt", title: "Expira el", type: "datetime" },
          ],
        },
      ],
    }),
  ],
  initialValue: {
    newuser: true,
    role: "user",
  },
};

export default user;