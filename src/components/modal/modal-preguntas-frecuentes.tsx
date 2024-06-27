"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Book, CircleX } from "lucide-react";
export interface AuxProps {
  children: React.ReactNode;
}
export default function ModalPreguntasFrecuentes({ children }: AuxProps) {
  const [activeModal, setActiveModal] = useState(false);

  return (
    <div>
      <Button
        onClick={() => setActiveModal(!activeModal)}
        className="z-header bg-transparent hover:bg-transparent sticky-0 fixed bottom-6 left-0 z-10 flex items-center justify-center xl:bottom-[0px] xl:left-16 "
        rel="noreferrer"
      >
        <div className=" relative mb-[6vh] mr-1 flex items-center justify-center  h-[50px] cursor-pointer   rounded-r-full    pl-1 md:w-10">
          <span className="absolute h-[30px] w-[30px] animate-ping rounded-full bg-black  dark:bg-white xl:h-[50px] xl:w-[50px]"></span>
          <div>
            <Book className="h-8 w-8 stroke-[#9D9D9D]" />
          </div>
          <span className=" text-[10px] text-[#9D9D9D] bg-black dark:bg-white px-1 rounded-md py-1 xl:block xl:text-xs">
            Preguntas <br /> Frecuentes
          </span>
        </div>
      </Button>
      <div
        // onClick={() => setActiveModal(!activeModal)}
        className={` ${
          activeModal ? "fixed" : "hidden"
        } top-[0px] left-0  bg-black/80 dark:bg-black/80 h-full w-[100vw] z-[999] flex justify-center items-center`}
      >
        <div className="flex justify-start items-end bg-black  top-0">
          <Button
            onClick={() => setActiveModal(!activeModal)}
            className="absolute  xl:top-[0px] top-0 p-2 border-none bg-transparent hover:bg-transparent text-white dark:text-white  right-0 z-[999]"
          >
            <CircleX className="fill-black" />
          </Button>
          {children}
        </div>
      </div>
    </div>
  );
}
