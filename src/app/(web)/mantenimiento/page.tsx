import Maintence from '@/components/mantenimiento/maintence'
import React from 'react'
import { Metadata } from "next";
import { maintenanceMetadata } from "@/config/seo-config";

export const metadata: Metadata = maintenanceMetadata;

export default function page() {
  return (
    <Maintence/>
  )
}
