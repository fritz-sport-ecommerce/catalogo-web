"use client"
import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const ModalDesk = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4"
      onClick={handleOverlayClick}
    >
      <div
        className="
          
          p-0 rounded-lg shadow-lg relative 
          flex justify-center overflow-hidden overflow-y-auto

          w-full max-w-xs         /* mobile */
          sm:max-w-md             /* tablet */
          md:w-[70vw] md:max-w-none  /* desktop mediano */
          lg:w-[60vw] lg:max-w-none  /* desktop grande */
          xl:w-[50vw] xl:max-w-none  /* pantallas grandes */

          h-[70vh] sm:h-[70vh] md:h-[68vh] lg:h-[65vh] xl:h-[60vh]
        "
      >
        {children}
      </div>
    </div>
  );
};

export default ModalDesk;
