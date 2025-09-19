"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/app/(web)/tienda/loading";

interface TiendaContentProps {
  children: React.ReactNode;
}

export default function TiendaContent({ children }: TiendaContentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Mostrar loading cuando cambien los parámetros de búsqueda
    setIsLoading(true);
    
    // Simular un pequeño delay para mostrar el loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchParams]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}