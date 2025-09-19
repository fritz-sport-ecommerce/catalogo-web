"use client";

import { useState } from "react";
import { Mail, Gift, Star } from "lucide-react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    // Simular suscripción (aquí integrarías con tu servicio de email)
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail("");
    }, 1000);
  };

  if (isSubscribed) {
    return (
      <section className="bg-gradient-to-r from-green-500 to-green-600 text-white py-16">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white text-green-600 rounded-full mb-6">
            <Gift size={32} />
          </div>
          <h2 className="text-3xl font-bold mb-4">¡Bienvenido a la familia!</h2>
          <p className="text-xl mb-6">
            Te hemos enviado un código de descuento del 10% a tu email
          </p>
          <div className="bg-white bg-opacity-20 backdrop-blur-sm inline-block px-6 py-3 rounded-lg">
            <span className="font-mono text-2xl font-bold">WELCOME10</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
      <div className="container mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white text-blue-600 rounded-full mb-6">
          <Mail size={32} />
        </div>

        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Únete a nuestra comunidad
        </h2>

        <p className="text-xl mb-2">Recibe ofertas exclusivas y novedades</p>

        <div className="flex items-center justify-center space-x-4 mb-8">
          <div className="flex items-center">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="ml-2 text-sm">4.8/5 (2,341 reseñas)</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tu email aquí..."
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Suscribiendo..." : "Suscribirse"}
            </button>
          </div>
        </form>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-center space-x-2">
            <Gift className="w-5 h-5" />
            <span className="text-sm">10% descuento de bienvenida</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Mail className="w-5 h-5" />
            <span className="text-sm">Ofertas exclusivas</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Star className="w-5 h-5" />
            <span className="text-sm">Acceso anticipado</span>
          </div>
        </div>

        <p className="mt-6 text-sm opacity-90">
          Más de 50,000 suscriptores ya disfrutan de nuestras ofertas exclusivas
        </p>
      </div>
    </section>
  );
}
