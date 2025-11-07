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
        // Usar endpoint de opciones (más ligero que /quick)
        const params = new URLSearchParams({
          tipo,
          genero
        });

        if (category) params.set('category', category);
        if (marca) params.set('marca', marca);

        const response = await fetch(`/api/busca-tu-taba/opciones?${params.toString()}`, {
          signal: abortControllerRef.current.signal,
          cache: 'no-store'
        });
        
        const data = await response.json();

        if (data.ok && data.opciones) {
          // Usar marcas y categorías del endpoint
          const marcasDisponibles = data.opciones.marcas || [];
          const categoriasDisponibles = data.opciones.categorias || [];
          
          // RANGOS DE PRECIOS ESTÁTICOS - Mostrar todos los rangos comunes
          // El filtrado real se hará en el endpoint principal
          const rangosPrecios = [
            { min: 0, max: 100, label: 'Hasta S/ 100', emoji: '💵', count: 1 },
            { min: 100, max: 200, label: 'S/ 100 - 200', emoji: '💵', count: 1 },
            { min: 200, max: 300, label: 'S/ 200 - 300', emoji: '💵', count: 1 },
            { min: 300, max: 400, label: 'S/ 300 - 400', emoji: '💶', count: 1 },
            { min: 400, max: 500, label: 'S/ 400 - 500', emoji: '💶', count: 1 },
            { min: 500, max: 600, label: 'S/ 500 - 600', emoji: '💷', count: 1 },
            { min: 600, max: 800, label: 'S/ 600 - 800', emoji: '💷', count: 1 },
            { min: 800, max: 1000, label: 'S/ 800 - 1000', emoji: '💷', count: 1 },
            { min: 1000, max: 999999, label: 'Más de S/ 1000', emoji: '💎', count: 1 }
          ];

          const result = {
            marcas: marcasDisponibles,
            categorias: categoriasDisponibles,
            rangosPrecios // Todos los rangos disponibles
          };

          // Guardar en cache
          opcionesCache.set(cacheKey, { 
            data: result, 
            total: data.totalProductos || 0,
            timestamp: Date.now() 
          });

          setOpciones(result);
          setTotalProductos(data.totalProductos || 0);
          console.log('✅ Opciones cargadas:', { 
            marcas: result.marcas.length, 
            categorias: result.categorias.length,
            rangos: result.rangosPrecios.length 
          });
        } else {
          // Fallback: mostrar rangos estáticos aunque falle el endpoint
          const rangosPrecios = [
            { min: 0, max: 100, label: 'Hasta S/ 100', emoji: '💵', count: 1 },
            { min: 100, max: 200, label: 'S/ 100 - 200', emoji: '💵', count: 1 },
            { min: 200, max: 300, label: 'S/ 200 - 300', emoji: '💵', count: 1 },
            { min: 300, max: 400, label: 'S/ 300 - 400', emoji: '💶', count: 1 },
            { min: 400, max: 500, label: 'S/ 400 - 500', emoji: '💶', count: 1 },
            { min: 500, max: 600, label: 'S/ 500 - 600', emoji: '💷', count: 1 },
            { min: 600, max: 800, label: 'S/ 600 - 800', emoji: '💷', count: 1 },
            { min: 800, max: 1000, label: 'S/ 800 - 1000', emoji: '💷', count: 1 },
            { min: 1000, max: 999999, label: 'Más de S/ 1000', emoji: '💎', count: 1 }
          ];
          
          setOpciones({ 
            marcas: [], 
            categorias: [], 
            rangosPrecios 
          });
          setTotalProductos(0);
        }
      } catch (error: any) {
        // Ignorar errores de abort
        if (error.name === 'AbortError') {
          console.log('⏹️ Fetch de opciones cancelado');
          return;
        }
        
        console.error('Error fetching opciones disponibles:', error);
        
        // Fallback: mostrar rangos estáticos en caso de error
        const rangosPrecios = [
          { min: 0, max: 100, label: 'Hasta S/ 100', emoji: '💵', count: 1 },
          { min: 100, max: 200, label: 'S/ 100 - 200', emoji: '💵', count: 1 },
          { min: 200, max: 300, label: 'S/ 200 - 300', emoji: '💵', count: 1 },
          { min: 300, max: 400, label: 'S/ 300 - 400', emoji: '💶', count: 1 },
          { min: 400, max: 500, label: 'S/ 400 - 500', emoji: '💶', count: 1 },
          { min: 500, max: 600, label: 'S/ 500 - 600', emoji: '💷', count: 1 },
          { min: 600, max: 800, label: 'S/ 600 - 800', emoji: '💷', count: 1 },
          { min: 800, max: 1000, label: 'S/ 800 - 1000', emoji: '💷', count: 1 },
          { min: 1000, max: 999999, label: 'Más de S/ 1000', emoji: '💎', count: 1 }
        ];
        
        setOpciones({ 
          marcas: [], 
          categorias: [], 
          rangosPrecios 
        });
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