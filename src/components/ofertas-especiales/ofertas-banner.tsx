"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface OfertasBannerProps {
  titulo?: string;
  subtitulo?: string;
  descuento?: string;
  tiempoLimite?: Date;
  urlDestino?: string;
}

export default function OfertasBanner({
  titulo = "¡OFERTA ESPECIAL!",
  subtitulo = "Hasta 50% OFF en productos seleccionados",
  descuento = "50%",
  tiempoLimite,
  urlDestino = "/outlet"
}: OfertasBannerProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (!tiempoLimite) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = tiempoLimite.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [tiempoLimite]);

  return (
    <section className="relative bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white py-16 my-16 overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 border-2 border-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 border-2 border-white rounded-full"></div>
      </div>

      <div className="container mx-auto text-center relative z-10">
        {/* Badge de descuento grande */}
        <div className="inline-flex items-center justify-center w-24 h-24 bg-yellow-400 text-red-600 rounded-full text-2xl font-black mb-6 animate-pulse">
          -{descuento}
        </div>

        <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
          {titulo}
        </h2>
        
        <p className="text-xl md:text-2xl mb-8 font-medium">
          {subtitulo}
        </p>

        {/* Contador de tiempo si se proporciona */}
        {tiempoLimite && (
          <div className="flex justify-center space-x-4 mb-8">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-3 rounded-lg">
              <div className="text-3xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
              <div className="text-sm uppercase tracking-wide">Horas</div>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-3 rounded-lg">
              <div className="text-3xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
              <div className="text-sm uppercase tracking-wide">Min</div>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-3 rounded-lg">
              <div className="text-3xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
              <div className="text-sm uppercase tracking-wide">Seg</div>
            </div>
          </div>
        )}

        {/* Call to action */}
        <Link 
          href={urlDestino}
          className="inline-flex items-center bg-white text-red-600 font-bold py-4 px-8 rounded-full text-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          COMPRAR AHORA
          <svg className="ml-2 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>

        {/* Texto adicional */}
        <p className="mt-6 text-sm opacity-90">
          *Oferta válida por tiempo limitado. Aplican términos y condiciones.
        </p>
      </div>
    </section>
  );
}