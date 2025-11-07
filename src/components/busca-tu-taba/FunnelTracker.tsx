"use client";

import { useEffect, useRef } from "react";
import { track } from "@vercel/analytics";

interface FunnelTrackerProps {
  searchParams: {
    tipo?: string;
    genero?: string;
    category?: string;
    marca?: string;
    rangoPrecio?: string;
    talla?: string;
  };
  canShowProducts: boolean;
}

export default function FunnelTracker({ searchParams, canShowProducts }: FunnelTrackerProps) {
  const hasTrackedSession = useRef(false);
  const lastStepTracked = useRef<string>("");

  useEffect(() => {
    // Track inicio de sesión (solo una vez)
    if (!hasTrackedSession.current) {
      track("funnel_inicio", {
        timestamp: new Date().toISOString(),
      });
      hasTrackedSession.current = true;
    }

    // Determinar el paso actual del funnel
    const { tipo, genero, category, marca, rangoPrecio, talla } = searchParams;
    
    let currentStep = "inicio";
    let stepNumber = 0;
    const stepsCompleted: string[] = [];

    if (tipo) {
      currentStep = "tipo_seleccionado";
      stepNumber = 1;
      stepsCompleted.push("tipo");
    }
    
    if (tipo && genero) {
      currentStep = "genero_seleccionado";
      stepNumber = 2;
      stepsCompleted.push("genero");
    }
    
    if (tipo && genero && category) {
      currentStep = "categoria_seleccionada";
      stepNumber = 3;
      stepsCompleted.push("categoria");
    }
    
    if (tipo && genero && category && marca) {
      currentStep = "marca_seleccionada";
      stepNumber = 4;
      stepsCompleted.push("marca");
    }
    
    if (tipo && genero && category && marca && rangoPrecio) {
      currentStep = "precio_seleccionado";
      stepNumber = 5;
      stepsCompleted.push("precio");
    }

    // Si puede mostrar productos, el funnel está completo
    if (canShowProducts) {
      currentStep = "funnel_completado";
      stepNumber = 6;
      stepsCompleted.push("completado");
      
      // Track funnel completado (solo una vez por combinación)
      const funnelKey = `${tipo}-${genero}-${category}-${marca}-${rangoPrecio}-${talla || 'sin-talla'}`;
      if (lastStepTracked.current !== funnelKey) {
        track("funnel_completado", {
          tipo:tipo || "",
          genero:genero || "",
          categoria: category|| "",
          marca:marca || "",
          rangoPrecio:rangoPrecio || "",
          talla: talla || "sin_talla",
          pasos_completados: stepNumber,
          timestamp: new Date().toISOString(),
        });
        lastStepTracked.current = funnelKey;
      }
    } else {
      // Track paso actual (solo si cambió)
      const stepKey = `${currentStep}-${JSON.stringify(searchParams)}`;
      if (lastStepTracked.current !== stepKey && stepNumber > 0) {
        track("funnel_paso", {
          paso: currentStep,
          paso_numero: stepNumber,
          pasos_completados: stepsCompleted.join(","),
          tipo: tipo || "",
          genero: genero || "",
          categoria: category || "",
          marca: marca || "",
          rangoPrecio: rangoPrecio || "",
          talla: talla || "",
          timestamp: new Date().toISOString(),
        });
        lastStepTracked.current = stepKey;
      }
    }
  }, [searchParams, canShowProducts]);

  return null; // Este componente no renderiza nada
}
