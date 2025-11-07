import { useEffect, useState, useRef } from 'react';
import convertUSSizeToEuropean from '@/utils/convertir-talla-usa-eu';

interface TallaDisponible {
  talla: string;
  disponible: boolean;
  stock: number;
}

interface UseTallasDisponiblesProps {
  tipo?: string;
  genero?: string;
  category?: string;
  marca?: string;
  rangoPrecio?: string;
}

// Cache global para tallas - evita refetch innecesarios
const tallasCache = new Map<string, { data: TallaDisponible[]; timestamp: number }>();
const CACHE_TTL = 120000; // 2 minutos de cache

export function useTallasDisponibles({
  tipo,
  genero,
  category,
  marca,
  rangoPrecio
}: UseTallasDisponiblesProps) {
  const [tallasDisponibles, setTallasDisponibles] = useState<TallaDisponible[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryTrigger, setRetryTrigger] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Solo buscar tallas si tenemos los filtros básicos mínimos
    if (!tipo || !genero || !category) {
      setTallasDisponibles([]);
      return;
    }

    // Solo para calzado y ropa
    const tipoRequiereTalla = tipo.split('.').some(t => t === 'calzado' || t === 'ropa');
    if (!tipoRequiereTalla) {
      setTallasDisponibles([]);
      return;
    }

    // Cancelar request anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const fetchTallasDisponibles = async () => {
      // Generar cache key (sin marca ni precio para cache más amplio)
      const cacheKey = `tallas-${tipo}-${genero}-${category}`;
      const cached = tallasCache.get(cacheKey);
      
      // Usar cache si está disponible y no ha expirado
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        console.log('✅ Tallas desde cache:', cacheKey);
        setTallasDisponibles(cached.data);
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
          category,
          limit: '30' // Aumentado a 30 para mejor cobertura de tallas
        });
        
        // NO incluir marca ni precio en la búsqueda de tallas
        // Esto permite cache más efectivo y resultados más amplios

        const response = await fetch(`/api/busca-tu-taba/quick?${params.toString()}`, {
          signal: abortControllerRef.current.signal,
          cache: 'no-store'
        });
        
        const data = await response.json();

        if (data.ok && data.products) {
          // Analizar las tallas disponibles de los productos
          const tallasMap = new Map<string, { disponible: boolean; stock: number }>();

          data.products.forEach((producto: any) => {
            if (producto.tallas && Array.isArray(producto.tallas)) {
              // Convertir tallas de USA a EU
              const tallasConvertidas = convertUSSizeToEuropean(
                producto.tallas,
                producto.genero || genero || 'unisex',
                producto.marca || 'ADIDAS',
                producto.subgenero,
                'calzado'
              );

              // Si es un array de objetos convertidos
              if (Array.isArray(tallasConvertidas)) {
                tallasConvertidas.forEach((tallaObj: any) => {
                  const tallaEU = String(tallaObj.talla || tallaObj);
                  const stock = tallaObj.stock || 0;
                  
                  if (tallasMap.has(tallaEU)) {
                    const existing = tallasMap.get(tallaEU)!;
                    tallasMap.set(tallaEU, {
                      disponible: existing.disponible || stock > 0,
                      stock: existing.stock + stock
                    });
                  } else {
                    tallasMap.set(tallaEU, {
                      disponible: stock > 0,
                      stock
                    });
                  }
                });
              }
            }
          });

          // Convertir a array
          const tallasArray: TallaDisponible[] = Array.from(tallasMap.entries()).map(([talla, info]) => ({
            talla,
            disponible: info.disponible,
            stock: info.stock
          }));

          // Guardar en cache
          tallasCache.set(cacheKey, { data: tallasArray, timestamp: Date.now() });
          
          setTallasDisponibles(tallasArray);
          console.log('✅ Tallas cargadas:', tallasArray.length);
        } else {
          setTallasDisponibles([]);
        }
      } catch (error: any) {
        // Ignorar errores de abort
        if (error.name === 'AbortError') {
          console.log('⏹️ Fetch de tallas cancelado');
          return;
        }
        
        console.error('Error fetching tallas disponibles:', error);
        setTallasDisponibles([]);
        if (error instanceof Error) {
          if (error.message.includes('504') || error.message.includes('Gateway')) {
            setError('El servidor está sobrecargado. Intenta de nuevo.');
          } else {
            setError('Error al cargar tallas. Intenta de nuevo.');
          }
        } else {
          setError('Error inesperado. Intenta de nuevo.');
        }
      } finally {
        setLoading(false);
      }
    };

    // Debounce más corto para mejor UX
    const timeoutId = setTimeout(fetchTallasDisponibles, 300);
    return () => {
      clearTimeout(timeoutId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [tipo, genero, category, retryTrigger]); // Removido marca y rangoPrecio de dependencias

  const retry = () => {
    console.log('🔄 Reintentando carga de tallas...');
    setRetryTrigger(prev => prev + 1);
  };

  return { tallasDisponibles, loading, error, retry };
}