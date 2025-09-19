"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { urlForImage } from "@/sanity/lib/image";
import { TrendItem } from "@/lib/fetchHomeData";

interface TrendsClientProps {
  trends: TrendItem[];
  title: string;
  subtitle: string;
}

const TrendsClient: React.FC<TrendsClientProps> = ({ trends, title, subtitle }) => {
  return (
    <section className="py-20 ">
      <div className="  px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold  mb-4 urban-text uppercase">
            {title}
          </h2>
          <p className="text-lg  max-w-2xl mx-auto modern-text">
            {subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trends.filter(trend => trend && trend.title && trend.image).map((trend, index) => (
            <motion.div
              key={trend._id || `trend-${index}`}
              className="group relative overflow-hidden rounded-2xl  shadow-lg hover:shadow-xl transition-all duration-500"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.03 }}
            >
              <a href={trend.link} className="block">
                {/* Image */}
                <div className="relative h-96 2xl:h-[35rem] overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat group-hover:scale-110 transition-transform duration-700"
                    style={{ backgroundImage: `url(${urlForImage(trend.image).url()})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2 urban-text">{trend.title}</h3>
                    <p className="text-gray-200 mb-4 modern-text">{trend.subtitle}</p>
                    
                    {/* CTA Button */}
                    <motion.div
                      className="inline-flex items-center space-x-2 bg-white text-black px-4 py-2  font-normal text-sm group-hover:bg-gray-100 transition-colors duration-300 urban-text"
                      whileHover={{ x: 5 }}
                    >
                      <span>VER MÁS</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
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
};

export default TrendsClient; 