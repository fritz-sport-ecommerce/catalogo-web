"use client";

import { useEffect, useState } from "react";

import ThemeContext from "@/context/themeContext";
import RoleContext from "@/context/roleContext"; // Importa tu RoleContext
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "react-use-cart";
import { useSession } from "next-auth/react";

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const themeFromStorage: boolean =
    typeof localStorage !== "undefined" && localStorage.getItem("hotel-theme")
      ? JSON.parse(localStorage.getItem("hotel-theme")!)
      : false;

  const roleFromStorage: "emprendedor" | "mayorista" | "callcenter" =
    typeof localStorage !== "undefined" && localStorage.getItem("user-role")
      ? (localStorage.getItem("user-role") as
          | "emprendedor"
          | "mayorista"
          | "callcenter")
      : "emprendedor";

  const [darkTheme, setDarkTheme] = useState<boolean>(themeFromStorage);
  const [userRole, setUserRole] = useState<
    "emprendedor" | "mayorista" | "callcenter"
  >(roleFromStorage);
  const [renderComponent, setRenderComponent] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    setRenderComponent(true);
  }, []);

  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("hotel-theme", JSON.stringify(darkTheme));
      localStorage.setItem("user-role", userRole);
    }
    // Sincronizar cookie para que el middleware pueda leer el rol
    if (typeof document !== "undefined") {
      // 30 días
      const maxAge = 60 * 60 * 24 * 30;
      document.cookie = `user-role=${userRole}; path=/; max-age=${maxAge}`;
    }
  }, [darkTheme, userRole]);

  // Si la sesión tiene role (desde Sanity vía NextAuth), sincronizarlo con el contexto
  useEffect(() => {
    const roleFromSession = session?.user && (session.user as any).role;
    if (roleFromSession && ["emprendedor", "mayorista", "callcenter"].includes(roleFromSession)) {
      setUserRole(roleFromSession);
    }
  }, [session]);

  if (!renderComponent) return <></>;

  return (
    <ThemeContext.Provider value={{ darkTheme, setDarkTheme }}>
      <RoleContext.Provider value={{ userRole, setUserRole }}>
        <CartProvider>
          <div className={`${darkTheme ? "dark" : ""} min-h-screen`}>
            <div className="dark:text-white dark:bg-black text-[#1E1E1E]">
              <Toaster />
              {children}
            </div>
          </div>
        </CartProvider>
      </RoleContext.Provider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
