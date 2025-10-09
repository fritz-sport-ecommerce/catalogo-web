import Script from "next/script";

interface WidgetSecuritecProps {
  /**
   * Habilita el widget también en desarrollo. Por defecto solo se carga en producción.
   */
  enabledInDev?: boolean;
}

export default function WidgetSecuritec({ enabledInDev = false }: WidgetSecuritecProps) {
  const isProd = process.env.NODE_ENV === "production";
  if (!isProd && !enabledInDev) return null;

  return (
    <Script
      id="widget-securitec"
      src="https://webchat.securitec.pe/widget-loader.js"
      strategy="afterInteractive"
      data-id="widget-securitec"
      data-token="afeeb662-db8d-466d-ae8c-1d7cc75d78e7"
    />
  );
}
