"use client";

import { useState, useEffect } from "react";

export default function OutletCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 30,
    seconds: 45
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const difference = tomorrow.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    // Calcular inmediatamente
    calculateTimeLeft();
    
    // Actualizar cada segundo
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg mb-6 text-center">
      <div className="text-sm font-medium mb-2">
        ⏰ Estas ofertas cambian en:
      </div>
      <div className="flex justify-center space-x-4">
        <div className="bg-white bg-opacity-20 backdrop-blur-sm px-3 py-2 rounded-lg min-w-[60px]">
          <div className="text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
          <div className="text-xs uppercase">Horas</div>
        </div>
        <div className="bg-white bg-opacity-20 backdrop-blur-sm px-3 py-2 rounded-lg min-w-[60px]">
          <div className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
          <div className="text-xs uppercase">Min</div>
        </div>
        <div className="bg-white bg-opacity-20 backdrop-blur-sm px-3 py-2 rounded-lg min-w-[60px]">
          <div className="text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
          <div className="text-xs uppercase">Seg</div>
        </div>
      </div>
      <div className="text-xs mt-2 opacity-90">
        Mañana tendremos productos diferentes con nuevos descuentos
      </div>
    </div>
  );
}