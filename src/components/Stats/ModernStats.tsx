"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Users, Package, Star, Truck } from "lucide-react";

const stats = [
  {
    id: 1,
    icon: Users,
    number: 50000,
    suffix: "+",
    label: "Clientes Satisfechos",
    color: "from-blue-500 to-blue-600"
  },
  {
    id: 2,
    icon: Package,
    number: 10000,
    suffix: "+",
    label: "Productos Vendidos",
    color: "from-green-500 to-green-600"
  },
  {
    id: 3,
    icon: Star,
    number: 4.9,
    suffix: "/5",
    label: "Calificación Promedio",
    color: "from-yellow-500 to-yellow-600"
  },
  {
    id: 4,
    icon: Truck,
    number: 24,
    suffix: "h",
    label: "Envío Express",
    color: "from-red-500 to-red-600"
  }
];

export function ModernStats() {
  const [counters, setCounters] = useState(stats.map(() => 0));

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Animar contadores cuando el componente es visible
          stats.forEach((stat, index) => {
            const target = stat.number;
            const duration = 2000; // 2 segundos
            const increment = target / (duration / 16); // 60fps
            let current = 0;

            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                current = target;
                clearInterval(timer);
              }
              
              setCounters(prev => {
                const newCounters = [...prev];
                newCounters[index] = Math.floor(current);
                return newCounters;
              });
            }, 16);
          });
        }
      });
    });

    const element = document.getElementById('stats-section');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="stats-section" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            NUESTROS NÚMEROS
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Más de 10 años de experiencia en el mercado deportivo peruano
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              className="text-center group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 mb-6 group-hover:scale-110 transition-transform duration-300">
                <stat.icon size={32} className="text-gray-600" />
              </div>

              {/* Number */}
              <div className="mb-2">
                <span className="text-4xl md:text-5xl font-bold text-gray-900">
                  {counters[index]}
                </span>
                <span className="text-2xl md:text-3xl font-bold text-gray-600">
                  {stat.suffix}
                </span>
              </div>

              {/* Label */}
              <p className="text-gray-600 font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 