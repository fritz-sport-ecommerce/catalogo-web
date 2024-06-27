import mongoose, { Schema, models } from "mongoose"

const PagoCompletadoSchema = new Schema(
  {
    id_payer: {
      type: String,
      required: [true, "tipo id_payer es necesaria"],
      trim: true,
    },
    id_mercado_pago: {
      type: String,
      required: [true, "tipo id_mercado_pago es necesaria"],
      trim: true,
    },

    pedido: {
      type: Boolean,
      required: [true, "tipo pedido es necesaria"],
      trim: true,
    },
    pedido_pagado: {
      type: Boolean,
      required: [true, "tipo pagado es necesaria"],
      trim: true,
    },
    pedido_por_entregar: {
      type: Boolean,
      required: [true, "tipo pedido_por_entregar es necesaria"],
      trim: true,
    },
    pedido_devuelto: {
      type: Boolean,
      required: [true, "tipo pedido_devuelto es necesaria"],
      trim: true,
    },
    pedido_entregado: {
      type: Boolean,
      required: [true, "tipo pedido_entregado es necesaria"],
      trim: true,
    },

    nombres: {
      type: String,
      required: [true, "tipo es nombres"],
      trim: true,
    },
    apellidos: {
      type: String,
      required: [true, "tipo es apellidos"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "tipo necesaria email"],
      trim: true,
    },
    documento: {
      type: String,
      required: [true, "tipo necesaria documento"],
      trim: true,
    },
    telefono: {
      type: String,
      required: [true, "tipo necesaria teléfono"],
      trim: true,
    },
    distrito: {
      type: String,
      required: [true, "tipo necesaria distrito"],
      trim: true,
    },
    provincia: {
      type: String,
      required: [true, "tipo necesaria provincia"],
      trim: true,
    },
    direccion: {
      type: String,
      required: [true, "tipo direccion es necesaria"],
      trim: true,
    },
    comprobante: {
      type: String,
      required: [true, "tipo comprobante es necesaria"],
      trim: true,
    },
    ruc: {
      type: String,
      trim: true,
    },
    cart_total: {
      type: Number,
      required: [true, "tipo necesaria cart_total"],
      trim: true,
    },
    info_adicional: {
      type: String,
      required: [true, "tipo necesaria info_adicional"],
      trim: true,
    },

    productos: [
      {
        id: {
          type: String,
          required: [true, "tipo necesaria id"],
          required: "Description field is required",
        },
        category_id: {
          type: String,
          required: [true, "tipo necesaria category_id"],
          required: "isCorrect field is required",
        },
        description: {
          type: String,
          required: [true, "tipo necesaria description"],
          required: "isCorrect field is required",
        },
        title: {
          type: String,
          required: [true, "tipo necesaria title"],
          required: "isCorrect field is required",
        },
        picture_url: {
          type: String,
          required: [true, "tipo necesaria picture_url"],
          required: "isCorrect field is required",
        },
        quantity: {
          type: Number,
          required: [true, "tipo necesaria quantity"],
          required: "isCorrect field is required",
        },
        unit_price: {
          type: Number,
          required: [true, "tipo necesaria unit_price"],
          required: "isCorrect field is required",
        },
      },
    ],
  },

  { timestamps: true }
)

const PagoCompletado =
  models.pagos_fritzsport ||
  mongoose.model("pagos_fritzsport", PagoCompletadoSchema)
export default PagoCompletado
