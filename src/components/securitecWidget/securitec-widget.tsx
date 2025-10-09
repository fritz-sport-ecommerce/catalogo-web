"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";

export default function SecuritecWidget() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Evitar carga doble
    if (document.getElementById("securitec-marker")) return;

    // 1️⃣ Creamos el script marcador con los data attributes
    const marker = document.createElement("script");
    marker.id = "securitec-marker";
    marker.setAttribute("data-id", "widget-securitec");
    marker.setAttribute("data-token", "afeeb662-db8d-466d-ae8c-1d7cc75d78e7");
    document.body.appendChild(marker);

    // 2️⃣ Insertamos el script loader
    const loader = document.createElement("script");
    loader.src = "https://webchat.securitec.pe/widget-loader.js";
    loader.async = true;
    loader.onload = () => {
      console.log("✅ Widget de Securitec ejecutado correctamente");
      setReady(true);
    };
    loader.onerror = () => console.error("❌ Error al cargar widget-loader.js");
    document.body.appendChild(loader);

    return () => {
      document.body.removeChild(loader);
      document.body.removeChild(marker);
    };
  }, []);

  // 3️⃣ Indicador visual (solo para saber si cargó)
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-full shadow-lg transition-all duration-300 ${
          ready
            ? "bg-green-600 text-white"
            : "bg-gray-400 text-white animate-pulse"
        }`}
      >
        <MessageCircle className="w-5 h-5" />
        {/* <span className="text-sm font-medium">
          {ready ? "Chat listo" : "Cargando..."}
        </span> */}
      </div>
    </div>
  );
}
