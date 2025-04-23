import Link from "next/link";
import React, { useState, useEffect, ReactNode } from "react";
import { AiOutlineClose, AiOutlineShoppingCart } from "react-icons/ai"; // Importa los íconos

interface ReusableModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
}

const ReusableModal: React.FC<ReusableModalProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  const [showModal, setShowModal] = useState<boolean>(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setShowModal(false);
    setTimeout(() => onClose(), 300); // Asegura que la animación de salida se complete antes de cerrar.
  };

  return (
    <div
      className={`fixed inset-0 flex z-[999] items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
        showModal ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={handleClose}
    >
      <div
        className={`relative bg-white rounded-lg shadow-lg p-6 transform transition-transform duration-300 ${
          showModal ? "scale-100" : "scale-95"
        }`}
        onClick={(e) => e.stopPropagation()} // Evita cerrar el modal al hacer clic dentro de él
      >
        {/* Botón de cierre (ícono en la esquina superior izquierda) */}
        <button
          onClick={handleClose}
          className="absolute top-2 left-2 text-gray-500 hover:text-gray-800 transition-colors"
        >
          <AiOutlineClose size={24} />
        </button>

        {/* Contenido del modal */}
        <div className="text-center">
          <h2 className="text-lg font-bold mb-4 text-gray-800">
            Condiciones de Compra
          </h2>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
            {children}
          </div>
          <div className="flex justify-center 2-full">
            {/* <Link href="/catalogo">
              <button
               
                className="px-4 py-2 uppercase bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <AiOutlineShoppingCart size={18} />
                  Comprar Mas
              </button>
            
            </Link> */}
            <Link
              target="_blank"
              href="/ https://api.whatsapp.com/send/?phone=51983478551&text&type=phone_number&app_absent=0"
            >
              <button className="px-4 py-2 uppercase bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                <AiOutlineShoppingCart size={18} />
                Escríbenos
              </button>
            </Link>
          </div>
        </div>

        {/* Renderiza hijos adicionales si los hay */}
      </div>
    </div>
  );
};

export default ReusableModal;
