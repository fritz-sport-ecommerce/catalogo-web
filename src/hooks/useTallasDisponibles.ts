import { useEffect, useState } from 'react';

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
const CACHE_TTL = 300000; // 5 minutos de cache (aumentado porque son datos estáticos)

export function useTallasDisponibles({
  tipo,
  genero,
  category
}: UseTallasDisponiblesProps) {
  const [tallasDisponibles, setTallasDisponibles] = useState<TallaDisponible[]>([]);
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null); // No se usa pero se mantiene para compatibilidad
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

    // SOLUCIÓN SIMPLIFICADA: Mostrar todas las tallas sin validación de stock
    // Esto evita el timeout del endpoint /quick
    const generarTallasEstaticas = () => {
      const tipoSeleccionado = tipo.split('.')[0];
      const generoSeleccionado = genero.split('.')[0];
      
      let tallasBase: string[] = [];
      
      if (tipoSeleccionado === 'calzado') {
        if (generoSeleccionado === 'niños') {
          // Tallas de niños
          tallasBase = ['3K', '4K', '5K', '6K', '7K', '8K', '9K', '10K', '11K', '12K', '13K'];
        } else {
          // Tallas EU para adultos
          tallasBase = [
            '36', '36.5', '37', '37.5', '38', '38.5', '39', '39.5', 
            '40', '40.5', '41', '41.5', '42', '42.5', '43', '43.5', 
            '44', '44.5', '45', '45.5', '46', '47', '48'
          ];
        }
      } else if (tipoSeleccionado === 'ropa') {
        // Tallas de ropa
        tallasBase = ['2XS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];
      }
      
      // Convertir a formato TallaDisponible (todas disponibles)
      const tallasArray: TallaDisponible[] = tallasBase.map(talla => ({
        talla,
        disponible: true, // Todas disponibles por defecto
        stock: 1 // Stock genérico
      }));
      
      return tallasArray;
    };

    // Generar cache key
    const cacheKey = `tallas-static-${tipo}-${genero}-${category}`;
    const cached = tallasCache.get(cacheKey);
    
    // Usar cache si está disponible
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('✅ Tallas estáticas desde cache:', cacheKey);
      setTallasDisponibles(cached.data);
      return;
    }

    // Generar tallas estáticas (sin API call)
    setLoading(true);
    
    // Simular pequeño delay para UX
    const timeoutId = setTimeout(() => {
      const tallasArray = generarTallasEstaticas();
      
      // Guardar en cache
      tallasCache.set(cacheKey, { data: tallasArray, timestamp: Date.now() });
      
      setTallasDisponibles(tallasArray);
      setLoading(false);
      console.log('✅ Tallas estáticas generadas:', tallasArray.length);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [tipo, genero, category, retryTrigger]);

  const retry = () => {
    console.log('🔄 Reintentando carga de tallas...');
    setRetryTrigger(prev => prev + 1);
  };

  return { tallasDisponibles, loading, error, retry };
}