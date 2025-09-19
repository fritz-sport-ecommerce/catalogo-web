"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function CustomRegisterToast({ show }: { show: boolean }) {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Solo mostrar en la página principal (/) y si show es true
    if (show && pathname === "/") {
      // Verificar si ya se mostró el toast anteriormente
      const hasShownToast = localStorage.getItem("fz_premium_toast_shown");
      
      if (!hasShownToast) {
        // Pequeño delay para que aparezca después de que la página cargue
        const timer = setTimeout(() => {
          setIsVisible(true);
          // Marcar como mostrado en localStorage
          localStorage.setItem("fz_premium_toast_shown", "true");
        }, 2000);

        return () => clearTimeout(timer);
      }
    } else {
      // Ocultar el toast si no estamos en la página principal
      setIsVisible(false);
    }
  }, [show, pathname]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleRegister = () => {
    router.push("/auth");
    setIsVisible(false);
  };

  if (!isVisible) return null;
//llevar cambios
  return (
    <div className="fixed top-4 right-4 z-[9999] animate-in slide-in-from-top-full duration-500">
      <div className="bg-gradient-to-r from-black/90 to-gray-900/90 backdrop-blur-sm text-white p-6 rounded-lg shadow-2xl border-2 border-white/80 max-w-sm w-full">
        {/* Header con botón de cerrar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <h3 className="font-bold text-lg">🎉 ¡ÚNETE A Fritz Sport!</h3>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-300 transition-colors p-1 hover:bg-white/10 rounded-full"
          >
            <X className="h-4 w-4 sm:h-4 sm:w-4 xl:h-5 xl:w-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="space-y-3">
          <p className="text-sm font-medium">
            ¡Obtén beneficios exclusivos!
          </p>
          
          <div className="space-y-2 text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Envío gratis desde S/500</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Descuentos especiales</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Acceso prioritario a nuevos productos</span>
            </div>
          </div>

          {/* Botón de acción */}
          <button
            onClick={handleRegister}
            className="w-full bg-white/90 text-black font-bold py-3 px-4 rounded-md hover:bg-white transition-all duration-200 transform hover:scale-105 shadow-lg border-2 border-transparent hover:border-black"
          >
            REGISTRARME AHORA
          </button>

          {/* Texto adicional */}
          <p className="text-xs text-gray-300 text-center">
            ¡Solo toma 30 segundos!
          </p>
        </div>

        {/* Indicador de tiempo */}
        <div className="mt-4 w-full bg-gray-700/80 rounded-full h-1">
          <div className="bg-white/80 h-1 rounded-full animate-pulse" style={{ width: '100%' }}></div>
        </div>
      </div>
    </div>
  );
} 