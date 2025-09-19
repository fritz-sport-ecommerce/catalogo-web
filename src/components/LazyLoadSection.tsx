"use client";
import { useInView } from "react-intersection-observer";
import { ReactNode } from "react";

interface LazyLoadSectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number | number[];
}

export default function LazyLoadSection({ children, fallback = null, rootMargin = "0px", threshold = 0.3 }: LazyLoadSectionProps) {
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin, threshold });
  return (
    <div ref={ref}>
      {inView ? children : fallback}
    </div>
  );
} 