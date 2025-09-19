"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    id: "hombre",
    title: "HOMBRE",
    subtitle: "Calzado y ropa deportiva",
    image: "https://cdn.sanity.io/images/ibvmpbc1/production/9e5542811530ac3747416cf81319ace5662b51b7-420x640.png",
    color: "from-blue-600 to-blue-800",
    link: "/tienda?search=hombre"
  },
  {
    id: "mujer", 
    title: "MUJER",
    subtitle: "Estilo y comodidad",
    image: "https://cdn.sanity.io/images/ibvmpbc1/production/6b27ada316e008eedeb4f5aa4cf48a5782edd446-420x640.png",
    color: "from-pink-600 to-purple-600",
    link: "/tienda?search=mujer"
  },
  {
    id: "niños",
    title: "NIÑOS",
    subtitle: "Diversión y movimiento",
    image: "https://cdn.sanity.io/images/ibvmpbc1/production/c566f60c87eaccd27240d3bbce5266f24c8eed7b-420x640.png",
    color: "from-green-600 to-green-800",
    link: "/tienda?search=niños"
  }
];

export function ModernCategoryGrid() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight urban-text">
            EXPLORA POR GÉNERO
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto modern-text">
            Encuentra tu estilo perfecto en nuestra amplia selección de productos deportivos
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              className="group relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <a href={category.link} className="block">
                {/* Image */}
                <div className="relative h-96 overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat group-hover:scale-110 transition-transform duration-700"
                    style={{ backgroundImage: `url(${category.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <h3 className="text-3xl font-bold mb-3 urban-text">{category.title}</h3>
                    <p className="text-gray-200 mb-6 text-lg modern-text">{category.subtitle}</p>
                    
                    {/* CTA Button */}
                    <motion.div
                      className="inline-flex items-center space-x-2 bg-white text-black px-6 py-3 rounded-full font-semibold text-lg group-hover:bg-gray-100 transition-colors duration-300 urban-text"
                      whileHover={{ x: 5 }}
                    >
                      <span>EXPLORAR</span>
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </motion.div>
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 