"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

interface IpApiResponse {
  region?: string;
  region_name?: string;
  city?: string;
}

export default function DetectProvinciaAnalytics(): null {
  useEffect(() => {
    const detectProvince = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        if (!response.ok) throw new Error("Error al obtener IP");

        const data: IpApiResponse = await response.json();
        const provincia = data.city || data.region_name || data.region || "Desconocido";

        // Verificar que 'va' está definida antes de usarla
        if (typeof window !== "undefined" && typeof window.va === "function") {
          window.va("event", { key: "provincias", provincia });
        }

        track("ProvinciaDetectada", { provincia });
        console.log("Provincia detectada:", provincia);
      } catch (error) {
        console.error("Error detectando provincia:", error);
      }
    };

    detectProvince();
  }, []);

  return null;
}
