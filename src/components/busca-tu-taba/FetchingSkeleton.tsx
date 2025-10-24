'use client';

import { useEffect, useState } from 'react';

interface FetchingSkeletonProps {
  progress?: number;
}

export default function FetchingSkeleton({ 
  progress = 0
}: FetchingSkeletonProps) {
  const [displayProgress, setDisplayProgress] = useState(0);

  // Animar el progreso visual suavemente
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayProgress((prev) => {
        const target = Math.max(0, Math.min(100, progress));
        const diff = target - prev;
        if (Math.abs(diff) < 0.5) return target;
        const next = prev + diff * 0.15;
        return Math.max(0, Math.min(100, next));
      });
    }, 50);

    return () => clearInterval(interval);
  }, [progress]);

  // Mensajes amigables según el progreso
  const getMessage = () => {
    const pct = Math.max(0, Math.min(100, displayProgress));
    if (pct < 20) {
      return '🔍 Conectando con el catálogo...';
    } else if (pct < 40) {
      return '📦 Cargando productos disponibles...';
    } else if (pct < 60) {
      return '💰 Obteniendo precios actualizados...';
    } else if (pct < 80) {
      return '📏 Verificando stock y tallas...';
    } else if (pct < 95) {
      return '✨ Organizando tu selección...';
    } else if (pct < 100) {
      return '🎉 ¡Ya casi está todo listo!';
    } else {
      return '✅ ¡Listo! Mostrando productos...';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="max-w-md w-full space-y-6">
        {/* Animated loader */}
        <div className="relative">
          <div className="mx-auto w-24 h-24 relative">
            {/* Outer spinning ring */}
            <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-black dark:border-t-white rounded-full animate-spin"></div>
            
            {/* Inner pulsing circle con porcentaje */}
            <div className="absolute inset-3 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-black dark:text-white">
                {Math.round(Math.max(0, Math.min(100, displayProgress)))}%
              </span>
            </div>
          </div>
        </div>

        {/* Loading text - Mensajes amigables */}
        <div className="text-center space-y-3">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-relaxed">
            {getMessage()}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {displayProgress < 100 ? 'Esto solo tomará un momento...' : '¡Completado!'}
          </p>
        </div>

        {/* Progress bar - Con porcentaje real */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span className="font-medium">
              {Math.max(0, Math.min(100, displayProgress)) < 100 ? 'Cargando...' : '¡Completado!'}
            </span>
            <span className="font-bold">{Math.round(Math.max(0, Math.min(100, displayProgress)))}%</span>
          </div>
          
          {/* Barra de progreso con ancho dinámico */}
          <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-black via-gray-700 to-black dark:from-white dark:via-gray-300 dark:to-white rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.max(0, Math.min(100, displayProgress))}%` }}
            >
            </div>
          </div>
          
          <p className="text-center text-xs text-gray-500 dark:text-gray-400 italic">
            {Math.max(0, Math.min(100, displayProgress)) < 100 ? 'Gracias por tu paciencia 💙' : '¡Todo listo! 🎉'}
          </p>
        </div>

        {/* Info cards con estados dinámicos */}
        <div className="grid grid-cols-3 gap-3 pt-4">
          <div className={`text-center p-3 rounded-lg transition-all ${
            Math.max(0, Math.min(100, displayProgress)) >= 60 
              ? 'bg-blue-100 dark:bg-blue-900/50 border-2 border-blue-200 dark:border-blue-700' 
              : 'bg-gray-50 dark:bg-gray-800'
          }`}>
            <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
              Math.max(0, Math.min(100, displayProgress)) >= 60
                ? 'bg-blue-200 dark:bg-blue-800'
                : 'bg-blue-100 dark:bg-blue-900/30'
            }`}>
              {Math.max(0, Math.min(100, displayProgress)) >= 60 ? (
                <span className="text-blue-600 dark:text-blue-400 text-sm">✓</span>
              ) : (
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Precios</p>
          </div>
          
          <div className={`text-center p-3 rounded-lg transition-all ${
            Math.max(0, Math.min(100, displayProgress)) >= 80 
              ? 'bg-green-100 dark:bg-green-900/50 border-2 border-green-200 dark:border-green-700' 
              : 'bg-gray-50 dark:bg-gray-800'
          }`}>
            <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
              Math.max(0, Math.min(100, displayProgress)) >= 80
                ? 'bg-green-200 dark:bg-green-800'
                : 'bg-green-100 dark:bg-green-900/30'
            }`}>
              {Math.max(0, Math.min(100, displayProgress)) >= 80 ? (
                <span className="text-green-600 dark:text-green-400 text-sm">✓</span>
              ) : (
                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Tallas</p>
          </div>
          
          <div className={`text-center p-3 rounded-lg transition-all ${
            Math.max(0, Math.min(100, displayProgress)) >= 95 
              ? 'bg-purple-100 dark:bg-purple-900/50 border-2 border-purple-200 dark:border-purple-700' 
              : 'bg-gray-50 dark:bg-gray-800'
          }`}>
            <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
              Math.max(0, Math.min(100, displayProgress)) >= 95
                ? 'bg-purple-200 dark:bg-purple-800'
                : 'bg-purple-100 dark:bg-purple-900/30'
            }`}>
              {Math.max(0, Math.min(100, displayProgress)) >= 95 ? (
                <span className="text-purple-600 dark:text-purple-400 text-sm">✓</span>
              ) : (
                <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
              )}
            </div>
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Stock</p>
          </div>
        </div>
      </div>
    </div>
  );
}
