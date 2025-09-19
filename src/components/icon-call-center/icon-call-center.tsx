"use client";

import Link from "next/link";

interface Props {
  phoneNumber: string;
}

export default function IconCallCenter({ phoneNumber }: Props) {
  return (
    <Link
      href={`tel:${phoneNumber}`}
      target="_blank"
      className="z-header sticky-0 fixed bottom-28 left-4 z-[999] xl:bottom-[140px] xl:left-16"
      rel="noreferrer"
    >
      <div className="relative mb-[6vh] mr-1 flex h-[50px] cursor-pointer items-center justify-end rounded-r-full pl-1 md:w-10">
        <span className="absolute h-[30px] w-[30px] animate-ping rounded-full bg-blue-600 dark:bg-blue-400 xl:h-[50px] xl:w-[50px]"></span>
        <div className="flex flex-col items-center justify-center xl:h-[50px] xl:w-[50px] xl:justify-start">
          {/* Icono de persona de call center */}
          <div className="relative z-20 h-[30px] w-[30px] xl:h-[50px] xl:w-[50px]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-full w-full"
            >
              {/* Círculo de fondo con gradiente */}
              <defs>
                <linearGradient id="callCenterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#3B82F6', stopOpacity: 1}} />
                  <stop offset="100%" style={{stopColor: '#1D4ED8', stopOpacity: 1}} />
                </linearGradient>
              </defs>
              
              {/* Círculo de fondo */}
              <circle cx="12" cy="12" r="11" fill="white" stroke="url(#callCenterGradient)" strokeWidth="1.5" />
              
              {/* Cabeza de la persona */}
              <circle cx="12" cy="9" r="2.5" fill="url(#callCenterGradient)" />
              
              {/* Cuerpo */}
              <path
                d="M7 19c0-2.5 2.5-5 5-5s5 2.5 5 5"
                stroke="url(#callCenterGradient)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              
              {/* Auricular estilizado */}
              <path
                d="M19 7.5c0-1.2-1.2-2.5-2.5-2.5s-2.5 1.3-2.5 2.5"
                stroke="url(#callCenterGradient)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              
              {/* Micrófono mejorado */}
              <rect x="16.5" y="5.5" width="1.5" height="3.5" rx="0.75" fill="url(#callCenterGradient)" />
              <circle cx="17.25" cy="10" r="0.8" fill="url(#callCenterGradient)" />
              
              {/* Líneas de ondas de sonido */}
              <path
                d="M20 8.5c0.5 0 1 0.2 1 0.5s-0.5 0.5-1 0.5"
                stroke="url(#callCenterGradient)"
                strokeWidth="1"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M21 9c0.3 0 0.6 0.1 0.6 0.3s-0.3 0.3-0.6 0.3"
                stroke="url(#callCenterGradient)"
                strokeWidth="1"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="hidden text-blue-600 xl:block xl:text-sm font-semibold">
            Call Center
          </span>
        </div>
      </div>
    </Link>
  );
} 