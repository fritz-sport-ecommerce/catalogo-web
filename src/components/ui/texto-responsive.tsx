"use client";

import { LimitarTextoResponsive } from "@/utils/limitarTexto";

interface TextoResponsiveProps {
  children: string;
  mobileChars?: number;
  tabletChars?: number;
  desktopChars?: number;
  className?: string;
  showTooltip?: boolean;
}

export default function TextoResponsive({
  children,
  mobileChars = 18,
  tabletChars = 28,
  desktopChars = 40,
  className = "",
  showTooltip = true
}: TextoResponsiveProps) {
  if (!children) return null;

  const truncatedText = LimitarTextoResponsive(children, mobileChars, tabletChars, desktopChars);
  const isTruncated = truncatedText !== children;

  return (
    <span 
      className={className}
      title={showTooltip && isTruncated ? children : undefined}
    >
      {truncatedText}
    </span>
  );
}

// Variantes predefinidas para casos comunes
export function ProductNameText({ 
  children, 
  className = "" 
}: { 
  children: string; 
  className?: string; 
}) {
  if (!children) return null;
  
  return (
    <TextoResponsive
      mobileChars={15}
      tabletChars={25}
      desktopChars={40}
      className={className}
    >
      {children}
    </TextoResponsive>
  );
}

export function ProductDescriptionText({ 
  children, 
  className = "" 
}: { 
  children: string; 
  className?: string; 
}) {
  if (!children) return null;
  
  return (
    <TextoResponsive
      mobileChars={25}
      tabletChars={40}
      desktopChars={60}
      className={className}
    >
      {children}
    </TextoResponsive>
  );
}

export function CardTitleText({ 
  children, 
  className = "" 
}: { 
  children: string; 
  className?: string; 
}) {
  if (!children) return null;
  
  return (
    <TextoResponsive
      mobileChars={12}
      tabletChars={20}
      desktopChars={30}
      className={className}
    >
      {children}
    </TextoResponsive>
  );
}