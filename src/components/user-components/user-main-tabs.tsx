"use client"
import React, { useEffect, useState } from 'react'
import PedidosTabsUser from './user-pedidos';
import FormInfoCuenta from "./user-form-info-cuenta";
import { BsJournalBookmarkFill } from 'react-icons/bs';
import { IoIosSend } from "react-icons/io";
import { useSession } from "next-auth/react";
export default function UserMainTabs({ dataPedidos,userData}:any) {
  const { data: session } = useSession();
  const [roleLS, setRoleLS] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      try { setRoleLS(localStorage.getItem("rol")); } catch {}
    }
  }, []);

  const isCallcenter = (session as any)?.user?.role === "callcenter" || roleLS === "callcenter";

  const [currentNav, setCurrentNav] = useState<
  "bookings" | "amount" | "ratings"
>("bookings");

  useEffect(() => {
    if (!isCallcenter && currentNav === "bookings") {
      setCurrentNav("amount");
    }
  }, [isCallcenter, currentNav]);
  return (
<div>

<nav className=" px-2 w-fit mx-auto md:w-full md:px-5 py-3 mb-8 text-gray-700 border border-gray-200 rounded-none bg-gray-50 mt-7">
            {isCallcenter && (
              <ol
                className={`${
                  currentNav === "bookings" ? "text-blue-600" : "text-gray-700"
                } inline-flex mr-1 md:mr-5 items-center space-x-1 md:space-x-3`}
              >
                <li
                  onClick={() => setCurrentNav("bookings")}
                  className="inline-flex items-center cursor-pointer"
                >
                  <BsJournalBookmarkFill />
                  <a className="inline-flex items-center mx-1 md:mx-3 text-xs md:text-sm font-medium">
                    Compras
                  </a>
                </li>
              </ol>
            )}
            <ol
              className={`${
                currentNav === "amount" ? "text-blue-600" : "text-gray-700"
              } inline-flex mr-1 md:mr-5 items-center space-x-1 md:space-x-3 border-l-[1px] border-black`}
            >
              <li
                onClick={() => setCurrentNav("amount")}
                className="inline-flex items-center cursor-pointer "
              >
                <IoIosSend />

                <a className="inline-flex items-center mx-1 md:mx-3 text-xs md:text-sm font-medium">
                  Datos de Usuario
                </a>
              </li>
            </ol>
          </nav>

          {isCallcenter && currentNav === "bookings" ? (
            <PedidosTabsUser dataPedidos={dataPedidos}/>
          ) : (
            <></>
          )}

          {currentNav === "amount" ? <FormInfoCuenta userData={userData} /> : <></>}
  
</div>
  )
}
