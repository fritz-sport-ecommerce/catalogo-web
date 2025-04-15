let cache: { modo_mantenimiento: boolean; timestamp: number } | null = null;

// Tiempo de validez del cache (en milisegundos)
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutos

export async function getMaintenanceMode(fetchFunction: () => Promise<boolean>) {
  const now = Date.now();

  // Verificar si el cache es válido
  if (cache && now - cache.timestamp < CACHE_DURATION) {
    return cache.modo_mantenimiento;
  }

  // Obtener el estado de mantenimiento
  const modo_mantenimiento = await fetchFunction();

  // Guardar en cache
  cache = { modo_mantenimiento, timestamp: now };

  return modo_mantenimiento;
}
