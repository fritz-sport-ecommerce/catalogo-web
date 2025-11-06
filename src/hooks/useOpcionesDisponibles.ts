import { useEffect, useState } from 'react';

interface OpcionesDisponibles {
  marcas: string[];
  categorias: string[];
  rangosPrecios: { min: number; max: number; count: number; label: string; emoji: string }[];
}

interface UseOpcionesDisponiblesProps {
  tipo?: string;
  genero?: string;
  category?: string;
  marca?: string;
}

export function useOpcionesDisponibles({
  tipo,
  genero,
  category,
  marca
}: UseOpcionesDisponiblesProps) {
  const [opciones, setOpciones] = useState<OpcionesDisponibles>({
    marcas: [],
    categorias: [],
    rangosPrecios: []
  });
  const [totalProductos, setTotalProductos] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Solo buscar opciones si tenemos filtros básicos
    if (!tipo || !genero) {
      setOpciones({ marcas: [], categorias: [], rangosPrecios: [] });
      setTotalProductos(0);
      return;
    }

    const fetchOpcionesDisponibles = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          tipo,
          genero,
          limit: '150' // Obtener más productos para analizar opciones
        });

        if (category) params.set('category', category);
        if (marca) params.set('marca', marca);

        const response = await fetch(`/api/busca-tu-taba/quick?${params.toString()}`);
        const data = await response.json();

        if (data.ok && data.products) {
          // Analizar marcas disponibles
          const marcasSet = new Set<string>();
          const categoriasSet = new Set<string>();
          const precios: number[] = [];

          data.products.forEach((producto: any) => {
            if (producto.marca) {
              marcasSet.add(producto.marca.toLowerCase());
            }
            if (producto.categories && Array.isArray(producto.categories)) {
              producto.categories.forEach((cat: string) => categoriasSet.add(cat));
            }
            if (producto.priceecommerce && producto.priceecommerce > 0) {
              precios.push(producto.priceecommerce);
            }
          });

          // Calcular rangos de precios con más detalle
          const rangosPrecios: { min: number; max: number; count: number; label: string; emoji: string }[] = [];
          if (precios.length > 0) {
            precios.sort((a, b) => a - b);
            const min = precios[0];
            const max = precios[precios.length - 1];
            
            // Crear rangos dinámicos
            const rangos = [
              { min: 0, max: 100, label: 'S/ 0 - 100', emoji: '💵' },
              { min: 0, max: 200, label: 'S/ 0 - 200', emoji: '💵' },
              { min: 200, max: 400, label: 'S/ 200 - 400', emoji: '💵' },
              { min: 400, max: 600, label: 'S/ 400 - 600', emoji: '💶' },
              { min: 600, max: 800, label: 'S/ 600 - 800', emoji: '💶' },
              { min: 800, max: 1000, label: 'S/ 800 - 1000', emoji: '💷' },
              { min: 1000, max: Math.max(max, 1500), label: 'S/ 1000+', emoji: '💎' }
            ];

            rangos.forEach(rango => {
              const count = precios.filter(p => p >= rango.min && p <= rango.max).length;
              if (count > 0) {
                rangosPrecios.push({ ...rango, count });
              }
            });
          }

          setOpciones({
            marcas: Array.from(marcasSet),
            categorias: Array.from(categoriasSet),
            rangosPrecios
          });
          setTotalProductos(data.total || data.products.length);
        } else {
          setOpciones({ marcas: [], categorias: [], rangosPrecios: [] });
          setTotalProductos(0);
        }
      } catch (error) {
        console.error('Error fetching opciones disponibles:', error);
        setOpciones({ marcas: [], categorias: [], rangosPrecios: [] });
        setTotalProductos(0);
      } finally {
        setLoading(false);
      }
    };

    // Debounce para evitar muchas requests
    const timeoutId = setTimeout(fetchOpcionesDisponibles, 300);
    return () => clearTimeout(timeoutId);
  }, [tipo, genero, category, marca]);

  return { opciones, totalProductos, loading };
}