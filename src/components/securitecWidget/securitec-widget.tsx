"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";

export default function SecuritecWidget() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Verificar si ya existe
    if (document.getElementById("widget-securitec")) return;

    const script = document.createElement("script");
    script.id = "widget-securitec";
    script.src = "https://webchat.securitec.pe/widget-loader.js";
    script.async = true;
    script.defer = true;
    script.setAttribute("data-token", "afeeb662-db8d-466d-ae8c-1d7cc75d78e7");

    script.onload = () => {
      console.log("✅ Widget de Securitec cargado correctamente");
      setLoaded(true);
    };
// 
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-full shadow-lg transition-all duration-300 ${
          loaded
            ? "bg-green-600 text-white"
            : "bg-gray-400 text-white animate-pulse"
        }`}
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-sm font-medium">
          {loaded ? "Chat listo" : "Cargando..."}
        </span>
      </div>
    </div>
  );
}
