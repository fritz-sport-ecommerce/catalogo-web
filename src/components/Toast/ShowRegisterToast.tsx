"use client";

import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { signIn } from "next-auth/react";

export default function ShowRegisterToast({ show }: { show: boolean }) {
  const { toast } = useToast();

  useEffect(() => {
    if (show) {
      toast({
        title: "🎉 ¡ÚNETE A Fritz Sport!",
        description: "Obtén envío gratis desde S/500, descuentos especiales y acceso prioritario a nuevos productos.",
        action: (
          <button
            onClick={() => signIn(undefined, { callbackUrl: "/auth" })}
            className="ml-2 rounded-md bg-black text-white px-4 py-2 text-sm font-bold hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 shadow-lg border border-white"
          >
            REGISTRARME AHORA
          </button>
        ),
        duration: 8000, // 8 segundos para dar más tiempo
      });
    }
  }, [show, toast]);

  return null;
}
