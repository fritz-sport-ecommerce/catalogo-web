"use client";
import { motion } from "framer-motion";

const brands = [
  {
    id: 1,
    name: "ADIDAS",
    logo: "https://cdn.sanity.io/images/ibvmpbc1/production/9e5542811530ac3747416cf81319ace5662b51b7-420x640.png",
    color: "from-blue-600 to-blue-800"
  },
  {
    id: 2,
    name: "NIKE",
    logo: "https://cdn.sanity.io/images/ibvmpbc1/production/6b27ada316e008eedeb4f5aa4cf48a5782edd446-420x640.png",
    color: "from-gray-800 to-black"
  },
  {
    id: 3,
    name: "PUMA",
    logo: "https://cdn.sanity.io/images/ibvmpbc1/production/c566f60c87eaccd27240d3bbce5266f24c8eed7b-420x640.png",
    color: "from-red-600 to-red-800"
  },
  {
    id: 4,
    name: "NEW BALANCE",
    logo: "https://cdn.sanity.io/images/ibvmpbc1/production/76217c8bec8a10cf4afe730e47a2ef68319f0c0e-420x640.png",
    color: "from-gray-600 to-gray-800"
  },
  {
    id: 5,
    name: "REEBOK",
    logo: "https://cdn.sanity.io/images/ibvmpbc1/production/e88af2517f2daf0b02898baf82e3051fed1594bb-420x640.png",
    color: "from-blue-500 to-blue-700"
  }
];

export function ModernBrands() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            MARCAS DESTACADAS
          </h2>
          <p className="text-gray-600">
            Las mejores marcas deportivas en un solo lugar
          </p>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.id}
              className="text-center group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="relative w-24 h-24 mx-auto mb-4    from-gray-100 to-gray-200 rounded-lg flex items-center justify-center overflow-hidden group-hover:shadow-lg transition-all duration-300">
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                  style={{ backgroundImage: `url(${brand.logo})` }}
                />
                <span className="text-sm font-bold text-gray-700 relative z-10">
                  {brand.name}
                </span>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                {brand.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 