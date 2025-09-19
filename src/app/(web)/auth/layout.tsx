import { Metadata } from "next";
import { authMetadata } from "@/config/seo-config";

export const metadata: Metadata = authMetadata;

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
