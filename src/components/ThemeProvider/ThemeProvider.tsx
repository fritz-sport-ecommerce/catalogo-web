"use client";

import { useEffect, useState } from "react";

import ThemeContext from "@/context/themeContext";
import RoleContext from "@/context/roleContext"; // Importa tu RoleContext
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "react-use-cart";

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const themeFromStorage: boolean =
    typeof localStorage !== "undefined" && localStorage.getItem("hotel-theme")
      ? JSON.parse(localStorage.getItem("hotel-theme")!)
      : false;

  const roleFromStorage: "emprendedor" | "mayorista" =
    typeof localStorage !== "undefined" && localStorage.getItem("user-role")
      ? (localStorage.getItem("user-role") as "emprendedor" | "mayorista")
      : "emprendedor";

  const [darkTheme, setDarkTheme] = useState<boolean>(themeFromStorage);
  const [userRole, setUserRole] = useState<"emprendedor" | "mayorista">(roleFromStorage);
  const [renderComponent, setRenderComponent] = useState(false);

  useEffect(() => {
    setRenderComponent(true);
  }, []);

  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("hotel-theme", JSON.stringify(darkTheme));
      localStorage.setItem("user-role", userRole);
    }
  }, [darkTheme, userRole]);

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
