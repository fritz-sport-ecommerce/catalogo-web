import { useEffect, useState, useRef } from 'react';

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

// Cache global para opciones - evita refetch innecesarios
const opcionesCache = new Map<string, { data: OpcionesDisponibles; total: number; timestamp: number }>();
const CACHE_TTL = 120000; // 2 minutos de cache

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
  const [error, setError] = useState<string | null>(null);
  const [retryTrigger, setRetryTrigger] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Solo buscar opciones si tenemos filtros básicos
    if (!tipo || !genero) {
      setOpciones({ marcas: [], categorias: [], rangosPrecios: [] });
      setTotalProductos(0);
      return;
    }

    // Cancelar request anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const fetchOpcionesDisponibles = async () => {
      // Generar cache key
      const cacheKey = `opciones-${tipo}-${genero}-${category || 'all'}-${marca || 'all'}`;
      const cached = opcionesCache.get(cacheKey);
      
      // Usar cache si está disponible y no ha expirado
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        console.log('✅ Opciones desde cache:', cacheKey);
        setOpciones(cached.data);
        setTotalProductos(cached.total);
        return;
      }

      setLoading(true);
      setError(null);
      
      // Crear nuevo AbortController
      abortControllerRef.current = new AbortController();
      
      try {
        const params = new URLSearchParams({
          tipo,
          genero,
          limit: '50' // Aumentado a 50 para mejor análisis de opciones
        });

        if (category) params.set('category', category);
        if (marca) params.set('marca', marca);

        const response = await fetch(`/api/busca-tu-taba/quick?${params.toString()}`, {
          signal: abortControllerRef.current.signal,
          cache: 'no-store'
        });
        
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
              { min: 0, max: 100, label: 'Hasta S/ 100', emoji: '💵' },
              { min: 100, max: 200, label: 'S/ 100 - 200', emoji: '💵' },
              { min: 200, max: 300, label: 'S/ 200 - 300', emoji: '💵' },
              { min: 300, max: 400, label: 'S/ 300 - 400', emoji: '💶' },
              { min: 400, max: 500, label: 'S/ 400 - 500', emoji: '💶' },
              { min: 500, max: 600, label: 'S/ 500 - 600', emoji: '💷' },
              { min: 600, max: 800, label: 'S/ 600 - 800', emoji: '💷' },
              { min: 800, max: 1000, label: 'S/ 800 - 1000', emoji: '💷' },
              { min: 1000, max: 999999, label: 'Más de S/ 1000', emoji: '💎' }
            ];

            rangos.forEach(rango => {
              const count = precios.filter(p => p >= rango.min && p < rango.max).length;
              if (count > 0) {
                rangosPrecios.push({ ...rango, count });
              }
            });
          }

          const result = {
            marcas: Array.from(marcasSet),
            categorias: Array.from(categoriasSet),
            rangosPrecios
          };

          // Guardar en cache
          opcionesCache.set(cacheKey, { 
            data: result, 
            total: data.total || data.products.length,
            timestamp: Date.now() 
          });

          setOpciones(result);
          setTotalProductos(data.total || data.products.length);
          console.log('✅ Opciones cargadas:', { marcas: result.marcas.length, rangos: result.rangosPrecios.length });
        } else {
          setOpciones({ marcas: [], categorias: [], rangosPrecios: [] });
          setTotalProductos(0);
        }
      } catch (error: any) {
        // Ignorar errores de abort
        if (error.name === 'AbortError') {
          console.log('⏹️ Fetch de opciones cancelado');
          return;
        }
        
        console.error('Error fetching opciones disponibles:', error);
        setOpciones({ marcas: [], categorias: [], rangosPrecios: [] });
        setTotalProductos(0);
        if (error instanceof Error) {
          if (error.message.includes('504') || error.message.includes('Gateway')) {
            setError('El servidor está sobrecargado. Intenta de nuevo.');
          } else {
            setError('Error al cargar opciones. Intenta de nuevo.');
          }
        } else {
          setError('Error inesperado. Intenta de nuevo.');
        }
      } finally {
        setLoading(false);
      }
    };

    // Debounce más corto para mejor UX
    const timeoutId = setTimeout(fetchOpcionesDisponibles, 200);
    return () => {
      clearTimeout(timeoutId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [tipo, genero, category, marca, retryTrigger]);

  const retry = () => {
    console.log('🔄 Reintentando carga de opciones...');
    setRetryTrigger(prev => prev + 1);
  };

  return { opciones, totalProductos, loading, error, retry };
}