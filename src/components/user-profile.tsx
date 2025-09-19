"use client";

import { useSession } from "next-auth/react";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function UserProfile() {
  const { data: session } = useSession();

  return (
    <Button size="sm" variant="ghost">
      {session?.user ? (
        <Link href={`/users/${session.user.id}`}>
          {session.user.image ? (
            <div className="w-[20px] h-[20px] rounded-full overflow-hidden">
              <Image
                src={session.user.image}
                alt={session.user.name!}
                width={20}
                height={20}
                className="scale-animation img"
              />
            </div>
          ) : (
            <FaUserCircle size={20} className="cursor-pointer" />
          )}
        </Link>
      ) : (
        <Link href="/auth">
          <FaUserCircle size={20} className="cursor-pointer" />
        </Link>
      )}
      <span className="sr-only">User profile</span>
    </Button>
  );
}