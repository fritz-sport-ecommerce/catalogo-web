import { createContext, Dispatch, SetStateAction } from "react";

type RoleContextType = {
  userRole: "emprendedor" | "mayorista";
  setUserRole: Dispatch<SetStateAction<"emprendedor" | "mayorista">>;
};

const RoleContext = createContext<RoleContextType>({
  userRole: "emprendedor", // Valor predeterminado
  setUserRole: () => null,
});

export default RoleContext;
