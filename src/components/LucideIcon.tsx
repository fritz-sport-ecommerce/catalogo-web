"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import type { LucideProps } from "lucide-react";

// Deriva los nombres válidos de los exports de lucide-react
export type LucideIconName = keyof typeof LucideIcons;

export interface LucideIconProps extends Omit<LucideProps, "ref"> {
  name: LucideIconName;
  title?: string;
}

/**
 * Componente generico para renderizar íconos de lucide-react por nombre.
 * Uso: <LucideIcon name="ShoppingCart" className="h-5 w-5" />
 */
export function LucideIcon({ name, title, ...props }: LucideIconProps) {
  const Icon = LucideIcons[name] as React.ComponentType<LucideProps> | undefined;

  if (!Icon) return null;

  return (
    <span aria-hidden={!title} role={title ? "img" : undefined} title={title}>
      <Icon aria-label={title} {...props} />
    </span>
  );
}

export default LucideIcon;
