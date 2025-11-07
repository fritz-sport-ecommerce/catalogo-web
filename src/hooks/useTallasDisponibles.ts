import { useEffect, useState } from 'react';
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

    const fetchTallasDisponibles = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          tipo,
          genero,
          category,
          limit: '20' // Reducido de 100 a 20 para evitar timeout
        });
        
        // Agregar parámetros opcionales solo si están definidos
        if (marca) params.set('marca', marca);
        if (rangoPrecio) params.set('rangoPrecio', rangoPrecio);

        const response = await fetch(`/api/busca-tu-taba/quick?${params.toString()}`);
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

          setTallasDisponibles(tallasArray);
        } else {
          setTallasDisponibles([]);
        }
      } catch (error) {
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

    // Debounce para evitar muchas requests
    const timeoutId = setTimeout(fetchTallasDisponibles, 500);
    return () => clearTimeout(timeoutId);
  }, [tipo, genero, category, marca, rangoPrecio, retryTrigger]);

  const retry = () => {
    console.log('🔄 Reintentando carga de tallas...');
    setRetryTrigger(prev => prev + 1);
  };

  return { tallasDisponibles, loading, error, retry };
}