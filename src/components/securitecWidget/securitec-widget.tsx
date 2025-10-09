"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";

export default function SecuritecWidget() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://webchat.securitec.pe/widget-loader.js";
    script.async = true;
    script.setAttribute("data-id", "widget-securitec");
    script.setAttribute("data-token", "afeeb662-db8d-466d-ae8c-1d7cc75d78e7");

    script.onload = () => {
      console.log("✅ Widget de Securitec cargado correctamente");
      setLoaded(true);
    };

    script.onerror = (err) => {
      console.error("❌ Error al cargar el widget de Securitec", err);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 flex items-center gap-2 z-50">
      {loaded ? (
        <div className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-full shadow-lg">
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">Chat listo</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 bg-gray-400 text-white px-3 py-2 rounded-full shadow-lg">
          <MessageCircle className="w-5 h-5 animate-pulse" />
          <span className="text-sm font-medium">Cargando...</span>
        </div>
      )}
    </div>
  );
}
