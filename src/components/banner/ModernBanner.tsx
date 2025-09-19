"use client";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";

export function ModernBanner() {
  return (
    <section className="py-8 bg-gradient-to-r from-red-600 via-red-700 to-red-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        {/* <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div> */}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Content */}
          <motion.div 
            className="text-center md:text-left mb-4 md:mb-0"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center md:justify-start mb-2">
              <Zap className="text-yellow-300 mr-2" size={24} />
              <h2 className="text-2xl md:text-3xl font-bold text-white urban-text">
                🔥 HASTA 40% OFF EN ZAPATILLAS 🔥
              </h2>
            </div>
            <p className="text-white/90 text-lg modern-text">
              Ofertas especiales en Adidas, Nike y más marcas
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.a
              href="/tienda"
              className="inline-flex items-center bg-white text-red-600 px-6 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 group urban-text"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>VER OFERTAS</span>
              <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 