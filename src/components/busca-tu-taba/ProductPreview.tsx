"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface ProductPreviewProps {
  filtros: {
    tipo?: string;
    genero?: string;
    marca?: string;
    category?: string;
    talla?: string;
    rangoPrecio?: string;
  };
  maxProducts?: number;
}

interface ProductoPreview {
  _id: string;
  name: string;
  sku: string;
  imgcatalogomain?: {
    asset?: {
      url: string;
    };
  };
  images?: Array<{
    asset?: {
      url: string;
    };
  }>;
  priceecommerce: number;
  marca: string;
  stock: number;
}

export default function ProductPreview({ filtros, maxProducts = 4 }: ProductPreviewProps) {
  const [productos, setProductos] = useState<ProductoPreview[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Solo mostrar preview si hay al menos tipo y género
    if (!filtros.tipo || !filtros.genero) {
      setProductos([]);
      setTotal(0);
      return;
    }

    const fetchPreview = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        Object.entries(filtros).forEach(([key, value]) => {
          if (value) params.set(key, value);
        });
        params.set('limit', String(maxProducts));

        const response = await fetch(`/api/busca-tu-taba/quick?${params.toString()}`);
        const data = await response.json();

        if (data.ok) {
          setProductos(data.products || []);
          setTotal(data.total || 0);
        } else {
          setProductos([]);
          setTotal(0);
        }
      } catch (error) {
        console.error('Error fetching product preview:', error);
        setProductos([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchPreview, 500);
    return () => clearTimeout(timeoutId);
  }, [JSON.stringify(filtros), maxProducts]);

  if (!filtros.tipo || !filtros.genero) {
    return null;
  }

  return (
    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white">
          Vista previa de productos
        </h4>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {loading ? 'Cargando...' : `${total} productos encontrados`}
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: maxProducts }).map((_, i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-32 animate-pulse"></div>
          ))}
        </div>
      ) : productos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {productos.map((producto) => {
            const imageUrl = producto.imgcatalogomain?.asset?.url || 
                           producto.images?.[0]?.asset?.url;
            
            return (
              <div key={producto._id} className="bg-white dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                <div className="aspect-square mb-2 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={producto.name}
                      width={120}
                      height={120}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-2xl">📦</span>
                    </div>
                  )}
                </div>
                <h5 className="text-xs font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1">
                  {producto.name}
                </h5>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {producto.marca}
                </p>
                <p className="text-sm font-bold text-green-600 dark:text-green-400">
                  S/ {producto.priceecommerce?.toFixed(2) || '0.00'}
                </p>
                {producto.stock > 0 && (
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    Stock: {producto.stock}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No se encontraron productos con los filtros actuales
          </p>
        </div>
      )}

      {total > maxProducts && (
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Y {total - maxProducts} productos más...
          </p>
        </div>
      )}
    </div>
  );
}