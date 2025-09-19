"use client";

import { useState } from "react";
import { Package, MapPin, ChevronDown, ChevronUp, Warehouse } from "lucide-react";

interface AlmacenInfo {
  codigo_almacen: string;
  nombre_almacen: string;
  almacen_tabla: string;
  provincia: string;
}

interface Producto {
  name: string;
  sku: string;
  talla: string;
  cantidad: number;
  unit_price: number;
  picture_url: string;
  almacen_info?: AlmacenInfo;
}

interface Props {
  productos: Producto[];
  pedidoId: string;
}

export default function PedidoAlmacenInfo({ productos, pedidoId }: Props) {
  const [mostrarDetalles, setMostrarDetalles] = useState(false);

  // Agrupar productos por almacén
  const productosPorAlmacen = productos.reduce((acc, producto) => {
    const almacenKey = producto.almacen_info?.codigo_almacen || 'sin_almacen';
    const almacenNombre = producto.almacen_info?.nombre_almacen || 'Sin información de almacén';
    const provincia = producto.almacen_info?.provincia || 'Desconocida';
    
    if (!acc[almacenKey]) {
      acc[almacenKey] = {
        nombre: almacenNombre,
        provincia: provincia,
        productos: []
      };
    }
    
    acc[almacenKey].productos.push(producto);
    return acc;
  }, {} as Record<string, { nombre: string; provincia: string; productos: Producto[] }>);

  const almacenes = Object.keys(productosPorAlmacen);
  const totalProductos = productos.length;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Warehouse className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Información de Picking - Pedido #{pedidoId.slice(-8)}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {totalProductos} productos en {almacenes.length} almacén{almacenes.length !== 1 ? 'es' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={() => setMostrarDetalles(!mostrarDetalles)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            {mostrarDetalles ? 'Ocultar' : 'Ver'} detalles
            {mostrarDetalles ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Resumen por almacén */}
      <div className="p-4">
        <div className="grid gap-3">
          {almacenes.map((almacenKey) => {
            const almacenData = productosPorAlmacen[almacenKey];
            const cantidadTotal = almacenData.productos.reduce((sum, p) => sum + p.cantidad, 0);
            
            return (
              <div key={almacenKey} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="font-medium text-gray-800 dark:text-white">
                      {almacenData.nombre}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {almacenData.provincia}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-800 dark:text-white">
                    {cantidadTotal} unidades
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {almacenData.productos.length} productos
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detalles expandibles */}
      {mostrarDetalles && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          {almacenes.map((almacenKey) => {
            const almacenData = productosPorAlmacen[almacenKey];
            
            return (
              <div key={almacenKey} className="p-4 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <h4 className="font-semibold text-gray-800 dark:text-white">
                    {almacenData.nombre} - {almacenData.provincia}
                  </h4>
                </div>
                
                <div className="space-y-2">
                  {almacenData.productos.map((producto, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                      <img 
                        src={producto.picture_url} 
                        alt={producto.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-800 dark:text-white truncate">
                          {producto.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          SKU: {producto.sku} | Talla: {producto.talla}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-800 dark:text-white">
                          x{producto.cantidad}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          S/{producto.unit_price}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer con instrucciones */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-2">
          <div className="flex items-center justify-center w-5 h-5 bg-blue-100 dark:bg-blue-900 rounded-full flex-shrink-0 mt-0.5">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">!</span>
          </div>
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <div className="font-medium mb-1">Instrucciones de Picking:</div>
            <ul className="space-y-1 text-xs">
              <li>• Recoger productos de cada almacén según la lista</li>
              <li>• Verificar SKU y talla antes de empacar</li>
              <li>• Marcar como completado una vez recogidos todos los productos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}