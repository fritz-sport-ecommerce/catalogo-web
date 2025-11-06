import React from 'react';

interface SkeletonLoaderProps {
  type: 'grid' | 'list' | 'cards' | 'tallas' | 'precios';
  count?: number;
  className?: string;
}

export default function SkeletonLoader({ type, count = 6, className = '' }: SkeletonLoaderProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'grid':
        return (
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'tallas':
        return (
          <div className={`grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'precios':
        return (
          <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'cards':
        return (
          <div className={`grid grid-cols-2 gap-4 md:gap-5 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="rounded-xl bg-black border-2 border-gray-200 dark:border-gray-700 px-5 py-5 md:px-6 md:py-6">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'list':
      default:
        return (
          <div className={`space-y-4 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="relative">
      {renderSkeleton()}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
    </div>
  );
}

// Componente específico para el estado de carga con mensaje
interface LoadingStateProps {
  message: string;
  type?: 'grid' | 'list' | 'cards' | 'tallas' | 'precios';
  count?: number;
  icon?: string;
}

export function LoadingState({ message, type = 'grid', count = 6, icon = '✨' }: LoadingStateProps) {
  return (
    <div className="text-center py-8">
      <SkeletonLoader type={type} count={count} />
      <div className="mt-6 flex items-center justify-center gap-2">
        <span className="text-2xl animate-bounce">{icon}</span>
        <p className="text-gray-500 dark:text-gray-400 font-medium">{message}</p>
      </div>
    </div>
  );
}