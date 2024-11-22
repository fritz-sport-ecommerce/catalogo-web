"use client";
import React, { useContext } from "react";
import RoleContext from "@/context/roleContext";
import { useCart } from "react-use-cart";

const ToggleUserRole: React.FC = () => {
  const { userRole, setUserRole } = useContext(RoleContext);
  const { emptyCart } = useCart();

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRole = event.target.value;
    if (selectedRole === "emprendedor" || selectedRole === "mayorista") {
      setUserRole(selectedRole);
      emptyCart();
    } else {
      console.error("Rol no válido:", selectedRole);
    }
  };

  return (
    <div className="flex xl:w-3/6 z-[999]  w-full justify-around">
      <div className="flex px-2 py-1 justify-center gap-x-2 items-center uppercase dark:border-white border-black text-black dark:text-white bg-white dark:bg-black rounded-sm">
        <p className="text-xs xl:text-xs 2xl:text-sm">COMPRAR COMO:</p>
        <select
          value={userRole}
          onChange={handleRoleChange}
          className="dark:bg-black bg-white text-black dark:text-white border border-red-500 dark:border-red-500 rounded p-1 xl:p-2 focus:outline-none focus:ring-2 focus:ring-white"
        >
          <option value="mayorista">Mayorista</option>
          <option value="emprendedor">Emprendedor</option>
        </select>
      </div>
    </div>
  );
};

export default ToggleUserRole;
