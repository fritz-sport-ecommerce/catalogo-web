"use client"
import React, { useState } from 'react'
import PedidosTabsUser from './user-pedidos';
import FormInfoCuenta from "./user-form-info-cuenta";
import { BsJournalBookmarkFill } from 'react-icons/bs';
import { IoIosSend } from "react-icons/io";
export default function UserMainTabs({ dataPedidos,userData}:any) {
  const [currentNav, setCurrentNav] = useState<
  "bookings" | "amount" | "ratings"
>("bookings");
  return (
<div>

<nav className="sticky z-40 top-0 px-2 w-fit mx-auto md:w-full md:px-5 py-3 mb-8 text-gray-700 border border-gray-200 rounded-none bg-gray-50 mt-7">
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

          {currentNav === "bookings" ? (
            <PedidosTabsUser dataPedidos={dataPedidos}/>
          ) : (
            <></>
          )}

          {currentNav === "amount" ? <FormInfoCuenta userData={userData} /> : <></>}
  
</div>
  )
}
