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
    <div className="fixed inset-0  z-50 flex items-center justify-center bg-black bg-opacity-50 "
    onClick={handleOverlayClick}
    >
      <div className="dark:bg-gray-800 bg-white p-0 rounded-lg shadow-lg relative w-full max-w-4xl flex justify-center overflow-y-auto h-[65vh] ">
   
        {children}
      </div>
    </div>
  );
};

export default ModalDesk;