"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { CircleX } from "lucide-react";
export interface AuxProps {
  children: React.ReactNode;
}
export default function ModalHorarios({ children }: AuxProps) {
  const [activeModal, setActiveModal] = useState(false);

  return (
    <div>
      <button
        className=" bg-black p-5 py-2 capitalize  dark:bg-white "
        onClick={() => setActiveModal(!activeModal)}
      >
        Ver Horarios
      </button>

      <div
        onClick={() => setActiveModal(!activeModal)}
        className={` ${
          activeModal ? "fixed" : "hidden"
        } 2xl:top-[88px]  lg:top-[50] top-[70px] left-0  bg-white/80 dark:bg-blue-gray-900/80 h-full w-[100vw] z-[999] flex justify-center items-center`}
      >
        <div className="flex justify-start items-end bg-black  top-0">
          <Button
            onClick={() => setActiveModal(!activeModal)}
            className="absolute  xl:top-[0px] top-0 p-2 border-none bg-transparent hover:bg-transparent text-white dark:text-white  left-0 z-[999]"
          >
            <CircleX />
          </Button>
          {children}
        </div>
      </div>
    </div>
  );
}
