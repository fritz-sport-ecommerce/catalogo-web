"use client";

import { FaSignOutAlt } from "react-icons/fa";
import { signOut } from "next-auth/react";
export default function LogoutButton() {
 



  return (
    <div className="flex justify-center w-full my-5">
        <div className="flex items-center ">
        <p className="mr-2">Cerrar sesión</p>
        <FaSignOutAlt
          className="text-3xl cursor-pointer"
          onClick={() => signOut({ callbackUrl: "/" })}
        />
      </div>

    </div>
  );
}
