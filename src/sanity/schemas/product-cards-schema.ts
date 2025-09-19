import { defineField, defineType } from "sanity"

export const productCards = defineType({
  name: "productCards",
  title: "Product Cards",
  type: "document",
  validation: (rule) => rule.required(),

  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      initialValue: "Product Cards Section",
    }),
    {
      name: "cards",
      title: "Product Cards",
      type: "array",
      of: [
        {
          title: "Product Card",
          type: "object",
          name: "productCard",
          fields: [
            {
              title: "ID",
              name: "id",
              type: "number",
              validation: (rule) => rule.required(),
            },
            {
              title: "Image",
              name: "image",
              type: "image",
              validation: (rule) => rule.required(),
              options: {
                hotspot: true,
              },
            },
            {
              title: "Alt Text",
              name: "alt",
              type: "string",
              validation: (rule) => rule.required(),
            },
            {
              title: "Title",
              name: "title",
              type: "string",
              validation: (rule) => rule.required(),
            },
            {
              title: "Subtitle",
              name: "subtitle",
              type: "string",
              description: "Optional subtitle (e.g., 'THE NEXT GENERATION OF SMART GLASSES')",
            },
            {
              title: "Description",
              name: "description",
              type: "text",
              description: "Product description",
            },
            {
              title: "Button Text",
              name: "buttonText",
              type: "string",
              validation: (rule) => rule.required(),
              initialValue: "Comprar",
            },
            {
              title: "Link",
              name: "link",
              type: "string",
              validation: (rule) => rule.required(),
              description: "URL or search query (e.g., '/tienda?search=louis+vuitton')",
            },
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "subtitle",
              media: "image",
            },
            prepare(selection) {
              const { title, subtitle, media } = selection
              return {
                title: title || "Product Card",
                subtitle: subtitle || "No subtitle",
                media: media,
              }
            },
          },
        },
      ],
      validation: (rule) => rule.required().min(1).max(10),
    },
    {
      title: "Active",
      name: "active",
      type: "boolean",
      initialValue: true,
      description: "Enable or disable this product cards section",
    },
    {
      title: "Order",
      name: "order",
      type: "number",
      initialValue: 1,
      description: "Order of display (lower numbers appear first)",
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "cards",
      media: "cards.0.image",
    },
    prepare(selection) {
      const { title, subtitle } = selection
      const cardCount = subtitle?.length || 0
      return {
        title: title || "Product Cards",
        subtitle: `${cardCount} card${cardCount !== 1 ? "s" : ""}`,
        media: selection.media,
      }
    },
  },
}) 