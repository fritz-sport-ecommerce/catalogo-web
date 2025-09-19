import { Metadata } from "next";
import { successMetadata } from "@/config/seo-config";

export const metadata: Metadata = successMetadata;

export default function ExitoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
