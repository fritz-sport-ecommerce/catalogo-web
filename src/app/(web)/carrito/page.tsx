import { Metadata } from "next";
import { cartMetadata } from "@/config/seo-config";
import dynamic from "next/dynamic";

const CartPageClient = dynamic(() => import("@/components/cart/CartPageClient"), { ssr: false });

export const metadata: Metadata = cartMetadata;

export default function Page() {
  return <CartPageClient />;
}
