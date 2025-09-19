// import { Heart } from "lucide-react";
// import React from "react";
// import { Button } from "../ui/button";

// export default function LoveFollowNavigation() {
//   return (
//     <Button className=" z-10 hover:bg-blue-gray-600 p-0 bg-transparent  xl:px-2 px-1 py-[1px]">
//       <Heart className="w-5 h-5 xl:h-5 xl:w-5 text-black dark:text-white " />
//     </Button>
//   );
// }

"use client";
import React, { useEffect, useState } from "react";

import { CircleX, Heart, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { SanitySlider } from "@/config/inventory";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { ItemsFollow } from "./items-follow";
import { CartItemsEmpty } from "../cart-items-empty";
import { CartItemsFollows } from "../cart-items-follows";

export function LoveFollowNavigation() {
  const { data: session } = useSession();
  const [followsCount, setFollowsCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      setLoading(true);
      client
        .fetch(
          groq`*[_type == "user" && _id == $userId][0] {
            intereses
          }`,
          { userId: session.user.id }
        )
        .then((user) => {
          if (user?.intereses) {
            setFollowsCount(user.intereses.length);
          } else {
            setFollowsCount(0);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching follows count:", error);
          setLoading(false);
        });
    } else {
      setFollowsCount(0);
    }
  }, [session?.user?.id]);

  if (!session?.user?.id) {
    return (
      <Link href="/auth">
        <Button className="z-10 hover:bg-gray-100 dark:hover:bg-gray-800 p-0 bg-transparent xl:px-2 px-1 py-[1px] relative">
          <Heart className="w-5 h-5 xl:h-5 xl:w-5 text-black dark:text-white hover:text-red-500 transition-colors duration-200" />
          <span className="sr-only">Favoritos</span>
        </Button>
      </Link>
    );
  }

  return (
    <Link href="/follows">
      <Button className="z-10 hover:bg-gray-100 dark:hover:bg-gray-800 p-0 bg-transparent xl:px-2 px-1 py-[1px] relative">
        <Heart className="w-5 h-5 xl:h-5 xl:w-5 text-black dark:text-white hover:text-red-500 transition-colors duration-200" />
        {followsCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {followsCount}
          </span>
        )}
        <span className="sr-only">Favoritos</span>
      </Button>
    </Link>
  );
}

// import React from "react";

// export default function LoveFollowNavigation() {
//   return <div>love-follow-navigation</div>;
// }
