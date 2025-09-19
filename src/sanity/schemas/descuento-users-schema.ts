import { defineField, defineType } from "sanity";

export const descuentoUsers = defineType({
  name: "descuento_users",
  title: "Descuento Users",
  type: "document",
  validation: (rule) => rule.required(),
 
  fields: [
    {
      name: "titulo_descuentos",
      title: "Título de Descuentos por Primer Registro",
      type: "string",
      initialValue: "Descuentos Por Usuario",
    },
    {
      name: "bloque_descuentos_usuario",
      title: "Descuentos por Primer Registro de Usuario",
      type: "object",
      fields: [
        {
          name: "desc_user_fz_premium",
          title: "Descuento para Usuario en Fz Premium",
          type: "number",
          initialValue: 0,
          validation: (rule) => rule.min(0).max(100),
          description: "Porcentaje de descuento para usuarios nuevos en la Tienda Fritz Sport.",
        },
        {
          name: "desc_user_fritz_sport",
          title: "Descuento para Usuario en Fritz Sport",
          type: "number",
          initialValue: 0,
          validation: (rule) => rule.min(0).max(100),
          description: "Porcentaje de descuento para usuarios nuevos en la tienda Fritz Sport.",
        },
        {
          name: "desc_user_fritz_sport_outlet",
          title: "Descuento para Usuario en Outlet Fritz Sport",
          type: "number",
          initialValue: 0,
          validation: (rule) => rule.min(0).max(100),
          description: "Porcentaje de descuento para usuarios nuevos en el Outlet Fritz Sport.",
        },
        {
          name: "activo",
          title: "Activar Descuentos",
          type: "boolean",
          initialValue: true,
          description: "Activar o desactivar los descuentos por primer registro",
        },
        {
          name: "fecha_inicio",
          title: "Fecha de Inicio",
          type: "datetime",
          description: "Fecha desde cuando aplican los descuentos",
        },
        {
          name: "fecha_fin",
          title: "Fecha de Fin",
          type: "datetime",
          description: "Fecha hasta cuando aplican los descuentos",
        },
        {
          name: "descripcion",
          title: "Descripción",
          type: "text",
          description: "Descripción adicional de los descuentos",
        },
      ],
    },
  ],
  preview: {
    select: {
      title: "titulo_descuentos",
      descFzPremium: "bloque_descuentos_usuario.desc_user_fz_premium",
      descFritzSport: "bloque_descuentos_usuario.desc_user_fritz_sport",
      descOutlet: "bloque_descuentos_usuario.desc_user_fritz_sport_outlet",
      activo: "bloque_descuentos_usuario.activo",
    },
    prepare(selection) {
      const { title, descFzPremium, descFritzSport, descOutlet, activo } = selection
      return {
        title: title || "Descuentos por Usuario",
        subtitle: `Fz Premium: ${descFzPremium || 0}% | Fritz Sport: ${descFritzSport || 0}% | Outlet: ${descOutlet || 0}% ${activo ? '(Activo)' : '(Inactivo)'}`,
      }
    },
  },
}); 