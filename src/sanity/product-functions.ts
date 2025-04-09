// Importamos la librería para trabajar con fechas (puedes usar Date directamente si prefieres)
export function isNewProduct(createdAt: string): boolean {
    const creationDate = new Date(createdAt);
    const currentDate = new Date();
    
    // Definimos el límite de novedad en milisegundos (30 días)
    const newLimit = 30 * 24 * 60 * 60 * 1000; 
  
    // Comparamos la diferencia
    return (currentDate.getTime() - creationDate.getTime()) <= newLimit;
  }