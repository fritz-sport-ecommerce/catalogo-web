"use client";

import { useEffect } from "react";

export default function SecuritecWidget() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://webchat.securitec.pe/widget-loader.js";
    script.async = true;
    script.setAttribute("data-id", "widget-securitec");
    script.setAttribute("data-token", "afeeb662-db8d-466d-ae8c-1d7cc75d78e7");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null; // No renderiza nada visible
}
