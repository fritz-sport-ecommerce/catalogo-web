import type { Metadata } from "next";
import { Raleway } from "next/font/google";

import { Analytics } from "@vercel/analytics/next";

// import Header from "@/components/Header/Header";
import "./globals.css";
import Maintence from "@/components/mantenimiento/maintence";
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
import GoogleAnalytics from "@/app/(web)/GoogleAnalytics";
import InfoBanner from "@/components/banner/banner";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import CustomRegisterToast from "@/components/Toast/CustomRegisterToast";
import { SearchProvider } from "@/context/searchContext";
import { baseMetadata, homeMetadata } from "@/config/seo-config";
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
} from "@/config/structured-data";
import StructuredData from "@/components/StructuredData";
import HeaderMain from "@/components/Header/HeaderMain";
import IconTiendas from "@/components/icon-tiendas/icon-tiendas";
import { getMaintenanceMode } from "@/utils/maintence-mode-cache";

const raleway = Raleway({
  weight: ["800"],
  subsets: ["latin"],
  style: "italic",
  display: "swap",
  // display: "swap",
});
interface InfoBannerProps {
  active_banner: boolean;
  banner_top: string[];
}

export const metadata: Metadata = {
  ...baseMetadata,
  ...homeMetadata,
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const urlWhatsApp = await client.fetch<
    SanitySlider[]
  >(groq`*[_type == "home"][0] {
      whatsapp
      }`);

  const nuestrasTiendasFooter = await client.fetch(
    groq`*[_type == "nuestrastiendas"][0]`
  );
  async function fetchMaintenanceMode() {
    const data = await client.fetch(
      groq`*[_type == "catalogo"][0]{
       "modo_mantenimiento": modo_mantenimiento
    }`
    );
    return data.modo_mantenimiento || false;
  }
  const modo_mantenimiento = await getMaintenanceMode(fetchMaintenanceMode);

  const session = await getServerSession(authOptions);
  return (
    <html lang="es">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css"
          crossOrigin="anonymous"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#000000" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={cn("min-h-screen bg-background  antialiased", raleway)}>
        <StructuredData data={generateOrganizationSchema()} />
        <StructuredData data={generateWebSiteSchema()} />
        <NextAuthProvider>
          <ThemeProvider>
            <SearchProvider>
              <Toast />
              <main className="font-normal min-h-screen bg-background  antialiased">
                {/* <InfoBanner bannerTopInfo={bannerTopInfo} /> */}
                {!session && <CustomRegisterToast show={true} />}
                {/* <Header /> */}
                {!modo_mantenimiento ? <></> : <SiteHeader />}
                <GoogleAnalytics />
                {children}
                <div className="fill-black ">
                  <Footer tiendas={nuestrasTiendasFooter} />
                </div>
                {/* <Maintence/> */}
                <Analytics />
              </main>
            </SearchProvider>
          </ThemeProvider>
        </NextAuthProvider>
        <IconTiendas />
        <IconWhatapp urlWhatsApp={urlWhatsApp[0]}></IconWhatapp>
      </body>
    </html>
  );
}
