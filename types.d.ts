// types.d.ts
import type { NextRequest } from "next/server";

declare module "next/server" {
  interface NextRequest {
    geo?: {
      city?: string;
      country?: string;
      region?: string;
      latitude?: string;
      longitude?: string;
    };
  }
}
