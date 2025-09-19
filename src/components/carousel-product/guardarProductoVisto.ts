import { useEffect } from "react";

export function guardarProductoVisto(sku: string, precio: number) {
  if (typeof window === "undefined") return;
  const key = "productos_vistos";
  let productos: { sku: string; fecha: string; precio: number }[] = [];
  try {
    const raw = localStorage.getItem(key);
    productos = raw ? JSON.parse(raw) : [];
  } catch {}
  const ahora = new Date().toISOString();
  const idx = productos.findIndex((p: { sku: string }) => p.sku === sku);
  if (idx > -1) {
    productos[idx].fecha = ahora;
    productos[idx].precio = precio; // Actualiza el precio si el producto ya existe
  } else {
    productos.push({ sku, fecha: ahora, precio });
  }
  localStorage.setItem(key, JSON.stringify(productos));
}

export function useGuardarProductoVisto(sku?: string, precio?: number) {
  useEffect(() => {
    if (sku && precio !== undefined) {
      guardarProductoVisto(sku, precio);
    }
  }, [sku, precio]);
}