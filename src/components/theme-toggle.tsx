"use client";

import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useContext } from "react";
import ThemeContext from "@/context/themeContext";
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";
import { useSession } from "next-auth/react";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  const { darkTheme, setDarkTheme } = useContext(ThemeContext);

  const { data: session } = useSession();
  return (
    <>
      <ul className=" items-center xl:ml-5 flex">
        <li className="mr-2 ml-5  xl:block hidden">
          {session?.user ? (
            <Link href={`/users/${session.user.id}`}>
              {session.user.image ? (
                <div className="w-[30px] h-[30px] rounded-full overflow-hidden">
                  <Image
                    src={session.user.image}
                    alt={session.user.name!}
                    width={30}
                    height={30}
                    className="scale-animation img"
                  />
                </div>
              ) : (
                <FaUserCircle size={22} className="cursor-pointer" />
              )}
            </Link>
          ) : (
            <Link href="/auth">
              <FaUserCircle size={22} className="cursor-pointer" />
            </Link>
          )}
        </li>
        <li className="mr-2 ml-5">
          {darkTheme ? (
            <MdOutlineLightMode
              size={22}
              className="cursor-pointer"
              onClick={() => {
                setDarkTheme(false);
                localStorage.removeItem("hotel-theme");
              }}
            />
          ) : (
            <MdDarkMode
              size={22}
              className="cursor-pointer"
              onClick={() => {
                setDarkTheme(true);
                localStorage.setItem("hotel-theme", "true");
              }}
            />
          )}
        </li>
      </ul>
    </>
  );
}
