import React, { useEffect, useState } from "react";
import { ShoppingBag, User, Heart } from "lucide-react";
import { useCart } from "react-use-cart";
import Link from "next/link";
import { useSession } from "next-auth/react";

const HeaderActions = () => {
  const { items } = useCart();
  const { data: session } = useSession();
  const [roleLS, setRoleLS] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        setRoleLS(localStorage.getItem("rol"));
      } catch {}
    }
  }, []);

  const isCallcenter = (session as any)?.user?.role === "callcenter" || roleLS === "callcenter";
  return (
    <div className="flex items-center gap-4">
      <Link href="/carrito" className={`relative ${!isCallcenter ? "lg:hidden" : ""}`}>
        <ShoppingBag size={22} />
        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {items.length}
        </span>
      </Link>
      <Link href="/follows" className={`${!isCallcenter ? "lg:hidden" : ""}`}>
        <Heart size={22} />
      </Link>
      <Link href="/auth">
        <User size={22} />
      </Link>
    </div>
  );
};

export default HeaderActions;