"use client";

import { LimitarTextoResponsive } from "@/utils/limitarTexto";

interface ResponsiveTextProps {
  text: string;
  mobileChars?: number;
  tabletChars?: number;
  desktopChars?: number;
  className?: string;
  showTooltip?: boolean;
}

export default function ResponsiveText({
  text,
  mobileChars = 18,
  tabletChars = 28,
  desktopChars = 40,
  className = "",
  showTooltip = true
}: ResponsiveTextProps) {
  const truncatedText = LimitarTextoResponsive(text, mobileChars, tabletChars, desktopChars);
  const isTruncated = truncatedText !== text;

  return (
    <span 
      className={className}
      title={showTooltip && isTruncated ? text : undefined}
    >
      {truncatedText}
    </span>
  );
}

// Variantes predefinidas para casos comunes
export function ProductNameText({ text, className = "" }: { text: string; className?: string }) {
  return (
    <ResponsiveText
      text={text}
      mobileChars={15}
      tabletChars={25}
      desktopChars={40}
      className={className}
    />
  );
}

export function ProductDescriptionText({ text, className = "" }: { text: string; className?: string }) {
  return (
    <ResponsiveText
      text={text}
      mobileChars={25}
      tabletChars={40}
      desktopChars={60}
      className={className}
    />
  );
}

export function CardTitleText({ text, className = "" }: { text: string; className?: string }) {
  return (
    <ResponsiveText
      text={text}
      mobileChars={12}
      tabletChars={20}
      desktopChars={30}
      className={className}
    />
  );
}