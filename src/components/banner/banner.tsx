import { useCallback, useState } from "react"
import Image, { type ImageProps } from "next/image"
import classNames from "classnames"

export type BannerSize = "l" | "m" | "s" | "xl" | "xs-large" | "xs-small"

export type BannerProps = {
  className?: string

  children?: React.ReactNode
}

export function Banner({
  className,

  children,
}: BannerProps) {
  return <div className={className}>{children}</div>
}
