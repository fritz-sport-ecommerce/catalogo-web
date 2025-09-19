"use client";
import { motion } from "framer-motion";
import { Star, Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";

// Mock data - en producción esto vendría de tu API
const featuredProducts = [
  {
    id: 1,
    name: "Adidas Samba OG",
    price: 299.90,
    originalPrice: 399.90,
    image: "https://cdn.sanity.io/images/ibvmpbc1/production/9e5542811530ac3747416cf81319ace5662b51b7-420x640.png",
    rating: 4.8,
    reviews: 124,
    isNew: true,
    isHot: false
  },
  {
    id: 2,
    name: "Nike Air Force 1",
    price: 349.90,
    originalPrice: 449.90,
    image: "https://cdn.sanity.io/images/ibvmpbc1/production/6b27ada316e008eedeb4f5aa4cf48a5782edd446-420x640.png",
    rating: 4.9,
    reviews: 89,
    isNew: false,
    isHot: true
  },
  {
    id: 3,
    name: "Adidas Superstar",
    price: 279.90,
    originalPrice: 379.90,
    image: "https://cdn.sanity.io/images/ibvmpbc1/production/c566f60c87eaccd27240d3bbce5266f24c8eed7b-420x640.png",
    rating: 4.7,
    reviews: 156,
    isNew: true,
    isHot: false
  },
  {
    id: 4,
    name: "Nike Dunk Low",
    price: 399.90,
    originalPrice: 499.90,
    image: "https://cdn.sanity.io/images/ibvmpbc1/production/76217c8bec8a10cf4afe730e47a2ef68319f0c0e-420x640.png",
    rating: 4.6,
    reviews: 203,
    isNew: false,
    isHot: true
  }
];

export function ModernFeaturedProducts() {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            PRODUCTOS DESTACADOS
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Los productos más populares y mejor valorados por nuestra comunidad
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onHoverStart={() => setHoveredProduct(product.id)}
              onHoverEnd={() => setHoveredProduct(null)}
            >
              {/* Product Image */}
              <div className="relative h-80 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat group-hover:scale-110 transition-transform duration-700"
                  style={{ backgroundImage: `url(${product.image})` }}
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNew && (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      NUEVO
                    </span>
                  )}
                  {product.isHot && (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      HOT
                    </span>
                  )}
                </div>

                {/* Wishlist Button */}
                <motion.button
                  className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart size={20} className="text-gray-600" />
                </motion.button>

                {/* Quick Add Button */}
                <motion.div
                  className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
                    hoveredProduct === product.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <button className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors duration-300 flex items-center space-x-2">
                    <ShoppingBag size={18} />
                    <span>AGREGAR</span>
                  </button>
                </motion.div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-black transition-colors">
                  {product.name}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        className={`${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-gray-900">S/ {product.price}</span>
                  <span className="text-lg text-gray-400 line-through">S/ {product.originalPrice}</span>
                  <span className="text-sm text-green-600 font-semibold">
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <button className="bg-black text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-800 transition-colors duration-300">
            VER TODOS LOS PRODUCTOS
          </button>
        </motion.div>
      </div>
    </section>
  );
} 