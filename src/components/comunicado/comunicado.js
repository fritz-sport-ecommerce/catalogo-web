"use client"
import { urlForImage } from '@/sanity/lib/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Modal  = ({ModalHome}) => {
  
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalActivoStudio, setModalActivoStudio] = useState(ModalHome.activemodal)
  
  // Variable para activar o desactivar el uso de localStorage
  const useLocalStorage = false;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (useLocalStorage) {
        const hasVisited = localStorage.getItem('hasVisited');
        if (!hasVisited) {
          setIsModalOpen(true);
          localStorage.setItem('hasVisited', 'true');
        }
      } else {
        setIsModalOpen(true); // Muestra el modal si no se usa localStorage
      }
    }
  }, [useLocalStorage]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative">
     
      {/* Modal */}
      {isModalOpen && modalActivoStudio && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
              className={`bg-white rounded-lg p-[2px] w-11/12 md:w-1/3 transform transition-transform duration-300 ${
                isModalOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
              }`}
            >

              <button
                className="absolute top-2 z-10 flex justify-center w-10 items-center rounded-full right-2 text-xl font-bold bg-white "
                onClick={closeModal}
              >
         <svg  viewBox="0 0 24 24"  fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5" stroke="#666666" stroke-width="1.5" strokeLinecap="round"></path> <path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" stroke="#666666" stroke-width="1.5" strokeLinecap="round"></path> </g></svg>
              </button>
          <Link className='w-full' href={ModalHome.promo.activeurl ? ModalHome.promo?.urlslider :"#"}>
<div>
                {/* <h2 className="text-2xl font-bold mb-4">¡Promoción Especial!</h2> */}
           
              <img
                src={urlForImage(ModalHome?.promo.imgdeskt?.asset?._ref).url()} // Cambia esta ruta por tu imagen
                alt={ModalHome?.promo?.desk}
                className="w-full h-auto rounded"
              />
              {/* <button
                onClick={closeModal}
                className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Cerrar
              </button> */}
</div>
          </Link>

            </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
