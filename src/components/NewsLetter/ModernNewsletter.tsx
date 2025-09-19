"use client";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Gift } from "lucide-react";
import { useState } from "react";

export function ModernNewsletter() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para suscribir al newsletter
    setIsSubscribed(true);
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        {/* <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div> */}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center mb-6">
              <Gift className="text-yellow-400 mr-3" size={32} />
              <span className="text-yellow-400 font-semibold text-lg">OFERTA ESPECIAL</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              ÚNETE A NUESTRA COMUNIDAD
            </h2>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Sé el primero en conocer nuestras nuevas colecciones, ofertas exclusivas y eventos especiales. 
              Recibe un <span className="text-yellow-400 font-semibold">10% de descuento</span> en tu primera compra.
            </p>

            {/* Benefits */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center text-gray-300">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                <span>Ofertas exclusivas y descuentos especiales</span>
              </div>
              <div className="flex items-center text-gray-300">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                <span>Acceso anticipado a nuevas colecciones</span>
              </div>
              <div className="flex items-center text-gray-300">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                <span>Contenido exclusivo y tips de estilo</span>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-white font-semibold mb-3">
                    TU EMAIL
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold py-4 px-6 rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 flex items-center justify-center space-x-2 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>SUSCRIBIRME</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>

                <p className="text-sm text-gray-400 text-center">
                  Al suscribirte, aceptas recibir emails promocionales. Puedes cancelar en cualquier momento.
                </p>
              </form>

              {/* Success Message */}
              {isSubscribed && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400 text-center"
                >
                  ¡Gracias por suscribirte! Revisa tu email para confirmar.
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 