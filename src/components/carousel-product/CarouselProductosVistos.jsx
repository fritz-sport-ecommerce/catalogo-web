"use client";
import { useEffect, useState } from "react";
import CarouselProduct from "./carousel-product";
import { client } from "@/sanity/lib/client";
import { useGuardarProductoVisto } from "./guardarProductoVisto";

import { fetchProductosPrecios } from "@/lib/fetchProductosPrecios";

const TITULO = "¿Aún te interesa?";
const KEY = "productos_vistos";
const MESES = 2;

async function fetchProductosPorSkus(skus) {
  if (!skus.length) return [];
  const query = `*[_type == "product" && sku in ${JSON.stringify(skus)}]{
    _id,
    _createdAt,
    name,
    sku,
    images,
    imgcatalogomain,
    marca,
 linea_liquidacion,
    genero,
    descuento,
    tallas,
    tipo,
    categories,
    preciomanual,
    popularidad,
    razonsocial,
    descuentosobred,

    "slug":slug.current
  }`;
  return await client.fetch(query);
}

export default function CarouselProductosVistos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener el último SKU visto (si hay alguno)
  let ultimoSku = undefined;
  let ultimoPrecio = undefined;
  if (typeof window !== "undefined") {
    try {
      const vistos = JSON.parse(localStorage.getItem(KEY)) || [];
      if (vistos.length > 0) {
        // Ordenar por fecha descendente y tomar el más reciente
        const ordenados = [...vistos].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        ultimoSku = ordenados[0].sku;
        ultimoPrecio = ordenados[0].precio;
      }
    } catch {}
  }
  useGuardarProductoVisto(ultimoSku, ultimoPrecio);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const cargarProductos = async () => {
      try {
        setLoading(true);
        let vistos = [];
        try {
          vistos = JSON.parse(localStorage.getItem(KEY)) || [];
        } catch {}
        
        const ahora = new Date();
        // Filtrar los que no tengan más de 2 meses
        vistos = vistos.filter((p) => {
          const fecha = new Date(p.fecha);
          const diffMeses = (ahora - fecha) / (1000 * 60 * 60 * 24 * 30);
          return diffMeses <= MESES;
        });
        
        // Validar productos vistos contra la API
        let productosValidados = [];
        if (vistos.length > 0) {
          try {
            const response = await fetch("/api/valid-products", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ products: vistos, ciudad: "LIMA" }),
            });
            productosValidados = await response.json();
          } catch (e) {
            console.error("Error validando productos vistos:", e);
            productosValidados = [];
          }
        }
        // Filtrar los vistos que siguen siendo válidos
        const skusValidos = new Set(productosValidados.map(p => p.sku));
        const vistosValidos = vistos.filter(p => skusValidos.has(p.sku));
        // Actualizar localStorage si hubo cambios
        localStorage.setItem(KEY, JSON.stringify(vistosValidos));
        
        if (vistosValidos.length === 0) {
          setProductos([]);
          setLoading(false);
          return;
        }
        // Obtener los productos de Sanity para mostrar info completa
        const skus = vistosValidos.map((p) => p.sku);
        const productosSanity = await fetchProductosPorSkus(skus);
        if (productosSanity && productosSanity.length > 0) {
          // Combinar los productos con sus precios almacenados y eliminar duplicados
          const productosConPrecios = productosSanity
            .map(producto => {
              const productoVisto = vistosValidos.find(p => p.sku === producto.sku);
              return {
                ...producto,
                priceecommerce: productoVisto?.precio || producto.preciomanual
              };
            })
            // Eliminar duplicados por SKU
            .filter((producto, index, array) => 
              array.findIndex(p => p.sku === producto.sku) === index
            );
          // Verificar si necesitamos actualizar precios (opcional)
          const productosProcesados = await fetchProductosPrecios(
            productosConPrecios.map((el) => ({ sku: el?.sku })),
            "LIMA",
          );
          // Combinar los precios actualizados con los datos de Sanity
          const productosFinales = productosConPrecios.map(producto => {
            const productoActualizado = productosProcesados?.find(p => p.sku === producto.sku);
            return productoActualizado ? {
              ...producto,
              precio: productoActualizado.precio
            } : producto;
          });
          setProductos(productosFinales || []);
        } else {
          setProductos([]);
        }
      } catch (error) {
        console.error("Error al cargar productos vistos:", error);
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };

    cargarProductos();
  }, []);

  if (loading) return null;
  if (!productos.length) return null;
  
  return (
    <div className="mt-10">
      <h5 className="text-center text-2xl uppercase">{TITULO}</h5>
      <CarouselProduct products={productos} />
    </div>
  );
}