import type { Metadata } from "next";
import { Poppins, Raleway } from "next/font/google";

// import Header from "@/components/Header/Header";
import "./globals.css";

import ThemeProvider from "@/components/ThemeProvider/ThemeProvider";
import { NextAuthProvider } from "@/components/AuthProvider/AuthProvider";
import Toast from "@/components/Toast/Toast";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/Header/site-header";
import IconWhatapp from "@/components/icon-whatsapp/icon-whatapp";
import { client } from "@/sanity/lib/client";
import { SanitySlider } from "@/config/inventory";
import { groq } from "next-sanity";
import Footer from "@/components/footer-update/footer";
import GoogleAnalytics from "@/app/(web)/catalogo/GoogleAnalytics";
import Script from "next/script";
const raleway = Raleway({
  weight: ["800"],
  subsets: ["latin"],
  style: "italic",
  display: "swap",
  // display: "swap",
});

export const metadata: Metadata = {
  title: "Fritz Sport Perú Sitio Web ofical | Zapatillas y ropa deportiva",
  description:
    "Bienvenido(a) al sitio oficial de Fritz Sport Perú. Encuentra Nuestro catalogo digital de zapatillas y ropa deportiva, creados con tecnología y diseño. ¡Conoce más!",
  openGraph: {
    title: " Fritz Sport Perú Sitio Web ofical | Zapatillas y ropa deportiva",
    description:
      "Bienvenido(a) al sitio oficial de Fritz Sport Perú. Encuentra Nuestro catalogo digital de zapatillas y ropa deportiva, creados con tecnología y diseño. ¡Conoce más!",
    url: `${process.env.URL_DOMINIO}`,
    siteName: "Fritz Sport",
    images: [
      {
        url: `${process.env.URL_DOMINIO}/ecommerce-share.jpg`,
        width: 800,
        height: 600,
        alt: `Fritz Sport share Imagen`,
      },
      {
        url: `${process.env.URL_DOMINIO}/ecommerce-share.jpg`,

        width: 1200,
        height: 630,
        alt: `Fritz Sport share Imagen`,
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const urlWhatsApp = await client.fetch<
    SanitySlider[]
  >(groq`*[_type == "home"] {
whatsapp
}`);


  const nuestrasTiendasFooter = await client.fetch(
    groq`*[_type == "nuestrastiendas"][0]`
  );

  return (
    <html lang="es">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css"
          crossOrigin="anonymous"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />

        {/* Meta Pixel Script */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '530492399885832');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=530492399885832&ev=PageView&noscript=1"
          />
        </noscript>
      </head>
      <body className={cn("min-h-screen bg-background  antialiased", raleway)}>
        <NextAuthProvider>
          <ThemeProvider>
            <Toast />
            <main className="font-normal">
              {/* <Header /> */}
              <SiteHeader />
              <GoogleAnalytics />
              {children}
              <div className="fill-black">
                <Footer tiendas={nuestrasTiendasFooter} />
              </div>
            </main>
          </ThemeProvider>
        </NextAuthProvider>
        <IconWhatapp urlWhatsApp={urlWhatsApp[0]}></IconWhatapp>
      </body>
    </html>
  );
}
