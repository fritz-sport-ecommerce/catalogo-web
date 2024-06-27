"use client";

import { useEffect, useState } from "react";

import ThemeContext from "@/context/themeContext";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "react-use-cart";
const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const themeFromStorage: boolean =
    typeof localStorage !== "undefined" && localStorage.getItem("hotel-theme")
      ? JSON.parse(localStorage.getItem("hotel-theme")!)
      : false;

  const [darkTheme, setDarkTheme] = useState<boolean>(themeFromStorage);
  const [renderComponent, setRenderComponent] = useState(false);

  useEffect(() => {
    setRenderComponent(true);
  }, []);

  if (!renderComponent) return <></>;

  return (
    <ThemeContext.Provider value={{ darkTheme, setDarkTheme }}>
      <CartProvider>
        <div className={`${darkTheme ? "dark" : ""} min-h-screen`}>
          <div className="dark:text-white dark:bg-black text-[#1E1E1E]">
            <Toaster />
            {children}
          </div>
        </div>
      </CartProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
