"use client";

import React from "react";
import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";
import { urlForImage } from "@/sanity/lib/image";

// Optional: register a font
// Font.register({ family: 'Inter', src: '/fonts/Inter-Regular.ttf' });

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 12,
    color: '#111827',
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 8
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: '#111827'
  },
  subtitle: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 6,
    fontWeight: 700,
    marginTop: 12,
    backgroundColor: '#F9FAFB'
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingVertical: 6,
    alignItems: 'center'
  },
  // Column base with thin dividers
  colBase: { paddingHorizontal: 4, borderRightWidth: 0.5, borderRightColor: '#E5E7EB' },
  colImg: { flex: 0.7 },
  colName: { flex: 3, paddingRight: 6 },
  colSku: { flex: 1.2 },
  colTalla: { flex: 0.9 },
  colAlmacen: { flex: 2 },
  colCant: { flex: 0.8, textAlign: 'right' },
  colPrecio: { flex: 1, textAlign: 'right' },
  colSubtotal: { flex: 1, textAlign: 'right' },
  imgThumb: { width: 28, height: 28, objectFit: 'cover', borderRadius: 4 },
  footer: {
    marginTop: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB'
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 700,
    marginRight: 12
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 700
  },
  note: {
    fontSize: 9,
    color: '#6B7280',
    marginTop: 8
  }
});

type QuoteItem = {
  id: string;
  name: string;
  objectID: string; // sku
  talla?: string;
  quantity?: number;
  price: number;
  image?: any; // Sanity asset ref or URL
  almacen_seleccionado?: {
    nombre_almacen?: string;
    provincia?: string;
  } | null;
};

interface QuoteDocumentProps {
  items: QuoteItem[];
  subtotal: number;
}

export function QuoteDocument({ items, subtotal }: QuoteDocumentProps) {
  const currency = (n: number) =>
    new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(n);

  const computedRows = items.map((it) => {
    let imageUrl: string | undefined;
    try {
      if (it?.image) {
        imageUrl = urlForImage(it.image).url();
      }
    } catch (e) {
      imageUrl = undefined;
    }
    return {
      name: it.name,
      sku: it.objectID,
      talla: it.talla || '-',
      almacen: it.almacen_seleccionado
        ? `${it.almacen_seleccionado.nombre_almacen || ''} ${it.almacen_seleccionado.provincia ? '(' + it.almacen_seleccionado.provincia + ')' : ''}`.trim()
        : 'Por definir',
      cantidad: it.quantity || 1,
      precio: it.price,
      subtotal: (it.quantity || 1) * it.price,
      imageUrl,
    };
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Cotización</Text>
          <Text style={styles.subtitle}>Generada por Fritz Sport — {new Date().toLocaleString('es-PE')}</Text>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.colBase, styles.colImg]}>Img</Text>
          <Text style={[styles.colBase, styles.colName]}>Producto</Text>
          <Text style={[styles.colBase, styles.colSku]}>SKU</Text>
          <Text style={[styles.colBase, styles.colTalla]}>Talla</Text>
          <Text style={[styles.colBase, styles.colAlmacen]}>Almacén</Text>
          <Text style={[styles.colBase, styles.colCant]}>Cant.</Text>
          <Text style={[styles.colBase, styles.colPrecio]}>Precio</Text>
          <Text style={[styles.colBase, styles.colSubtotal]}>Subtotal</Text>
        </View>

        {/* Rows */}
        {computedRows.map((r, idx) => (
          <View key={idx} style={styles.row}>
            <View style={[styles.colBase, styles.colImg]}>
              {r.imageUrl ? (
                <Image src={r.imageUrl} style={styles.imgThumb} />
              ) : (
                <Text>-</Text>
              )}
            </View>
            <Text style={[styles.colBase, styles.colName]}>{r.name}</Text>
            <Text style={[styles.colBase, styles.colSku]}>{r.sku}</Text>
            <Text style={[styles.colBase, styles.colTalla]}>{r.talla}</Text>
            <Text style={[styles.colBase, styles.colAlmacen]}>{r.almacen}</Text>
            <Text style={[styles.colBase, styles.colCant]}>{r.cantidad}</Text>
            <Text style={[styles.colBase, styles.colPrecio]}>{currency(r.precio)}</Text>
            <Text style={[styles.colBase, styles.colSubtotal]}>{currency(r.subtotal)}</Text>
          </View>
        ))}

        {/* Totals */}
        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal (sin envío):</Text>
            <Text style={styles.totalValue}>{currency(subtotal)}</Text>
          </View>
          <Text style={styles.note}>
            Esta cotización no incluye costos de envío ni promociones. Los precios y disponibilidades
            están sujetos a validación al momento del despacho.
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export default QuoteDocument;
