import { createContext, Dispatch, SetStateAction } from "react";

type RoleContextType = {
  userRole: "emprendedor" | "mayorista" | "callcenter";
  setUserRole: Dispatch<SetStateAction<"emprendedor" | "mayorista" | "callcenter">>;
};

const RoleContext = createContext<RoleContextType>({
  userRole: "emprendedor", // Valor predeterminado
  setUserRole: () => null,
});

export default RoleContext;
