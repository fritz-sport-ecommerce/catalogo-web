"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ModalDesk from "../modal/Modal";
import { urlForImage } from "@/sanity/lib/image";
import { X } from "lucide-react";

interface PromoModalProps {
  promo?: {
    activebuttontitle?: boolean;
    imgdeskt?: any;
    urlslider?: string;
    desc?: string;
  };
  activemodal?: boolean;
}

export function PromoModal({ promo, activemodal }: PromoModalProps) {
  const [isOpen, setIsOpen] = useState(activemodal);

  // useEffect(() => {
  //   // Mostrar el modal después de 2 segundos
  //   const timer = setTimeout(() => {
  //     if (activemodal) {
  //       setIsOpen(true);
  //     }
  //   }, 2000);

  //   return () => clearTimeout(timer);
  // }, [activemodal]);

  const handleClose = () => {
    setIsOpen(false);
  };

  // Only show if activemodal is true and there is an image
  if (!activemodal || !promo?.imgdeskt) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalDesk isOpen={isOpen} onClose={handleClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative bg-white rounded-2xl p-0 max-w-2xl w-full flex items-center justify-center min-h-[300px] max-h-[80vh]"
            style={{ overflow: 'hidden' }}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
            >
              <span className="sr-only">Cerrar</span>
              <X strokeWidth={1.5} />
            </button>
            <a href={promo.urlslider || "#"} target="_blank" rel="noopener noreferrer" className="flex w-full h-full items-center justify-center">
              <img
                src={urlForImage(promo.imgdeskt).url()}
                alt={promo.desc || "Promoción Fritz Sport"}
                className="w-full h-full object-contain rounded-2xl max-h-[80vh] min-h-[300px] bg-white"
                style={{ display: 'block', objectFit: 'contain' }}
              />
            </a>
          </motion.div>
        </ModalDesk>
      )}
    </AnimatePresence>
  );
} 