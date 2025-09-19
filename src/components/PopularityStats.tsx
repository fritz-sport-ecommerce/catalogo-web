"use client";

import { useEffect, useState } from "react";

interface PopularityStats {
  totalProducts: number;
  productsWithPopularity: number;
  averagePopularity: number;
  maxPopularity: number;
  minPopularity: number;
}

interface Product {
  _id: string;
  name: string;
  sku: string;
  popularidad: number;
  slug: string;
}

interface PopularityData {
  products: Product[];
  stats: PopularityStats;
}

export default function PopularityStats() {
  const [data, setData] = useState<PopularityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log('Fetching popularity stats...');
        const response = await fetch('/api/popularity-stats?limit=5');
        console.log('Response status:', response.status);
        
        if (response.ok) {
          const result = await response.json();
          console.log('Response data:', result);
          setData(result.data);
        } else {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          setError(`Error al cargar estadísticas: ${errorData.error || 'Error desconocido'}`);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Estadísticas de Popularidad</h2>
        <p>Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Estadísticas de Popularidad</h2>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Estadísticas de Popularidad</h2>
        <p>No hay datos disponibles</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Estadísticas de Popularidad</h2>
      
      {/* Estadísticas generales */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{data.stats.totalProducts}</div>
          <div className="text-sm text-gray-600">Total Productos</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{data.stats.productsWithPopularity}</div>
          <div className="text-sm text-gray-600">Con Popularidad</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{data.stats.averagePopularity?.toFixed(1) || 0}</div>
          <div className="text-sm text-gray-600">Promedio</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{data.stats.maxPopularity || 0}</div>
          <div className="text-sm text-gray-600">Máxima</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{data.stats.minPopularity || 0}</div>
          <div className="text-sm text-gray-600">Mínima</div>
        </div>
      </div>

      {/* Top productos */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Top 5 Productos Más Populares</h3>
        <div className="space-y-2">
          {data.products.map((product, index) => (
            <div key={product._id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center space-x-3">
                <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-gray-600">SKU: {product.sku}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">{product.popularidad}</div>
                <div className="text-xs text-gray-500">puntos</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 