// hooks/useLocalStorageRole.ts
"use client";

import { useEffect } from "react";
import { useCart } from "react-use-cart";

export const useLocalStorageRole = (setRole: (role: string | null) => void) => {
  const { emptyCart } = useCart();

  // Obtiene el rol del localStorage
  const getLocalStorageRole = (): string | null => {
    return typeof window !== "undefined" ? localStorage.getItem("rol") : null;
  };

  // Establece el rol inicialmente
  const role = getLocalStorageRole();
  setRole(role);

  // Maneja los cambios en el localStorage
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === "rol") {
      setRole(event.newValue);
      emptyCart(); // Limpiar el carrito cuando "rol" cambia
    }
  };

  // Agrega el listener al cargar el componente
  useEffect(() => {
    window.addEventListener("storage", handleStorageChange);

    // Limpia el listener al desmontar
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
};
