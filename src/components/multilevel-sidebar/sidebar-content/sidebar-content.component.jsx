import React, { Fragment } from "react";
import Link from "next/link";
import classNames from "classnames";

import "../stile-sidebar-menu.css";
import { Heart, User } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";

const SidebarContent = (props) => {
  const {
    sidebarProps,
    headerContent,
    options,
    children,
    handleTabClick,
    onToggle,
  } = props;
  const { data: session } = useSession();
  return (
    <div {...sidebarProps}>
      <div className="sidebar-main-content sidebar-parent  bg-white text-lg font-semibold dark:bg-black">
        {headerContent}
        <div className="sidebar-body ">
          <ul>
            {options.map((list, index) => {
              return (
                <Fragment key={index}>
                  {list.to && !list.children && !list.disabled ? (
                    <Link href={list.to}>
                      <li
                        className={classNames({
                          disabled: list.disabled,
                        })}
                        onClick={() => handleTabClick(list)}
                      >
                        <button
                          onClick={() => onToggle(false)}
                          className="flex-align-start h-full"
                        >
                          {list.icon && list.icon}
                          <span
                            className={`${
                              list.title === "OUTLET" && "text-red-500"
                            }`}
                          >
                            {list.title}
                          </span>
                        </button>
                        {children && list.children && <AngleRight />}
                      </li>
                    </Link>
                  ) : (
                    <li
                      className={classNames({ disabled: list.disabled })}
                      onClick={() => handleTabClick(list)}
                    >
                      <span className="flex-align-center">
                        {list.icon && list.icon}
                        <span>{list.title}</span>
                      </span>
                      {children && list.children && <AngleRight />}
                    </li>
                  )}
                  {children && children(list)}
                </Fragment>
              );
            })}

            {/* <a href={"https://www.fritzsportoutlet.pe/"}>
              <li>
                <button className="flex-align-start ml-2 h-full text-[#FF8500]">
                  OUTLET
                </button>
              </li>
            </a> */}
          </ul>
        </div>
        {/* session */}
        <div className="flex w-full justify-center  absolute bottom-7">
          <div className="flex">
            {session?.user ? (
              <div className="flex flex-col items-center justify-center gap-y-6">
                <Link href={`/users/${session.user.id}`}>
                  {session.user.image ? (
                    <div className="flex">
                      <div className="w-[30px] h-[30px] rounded-full overflow-hidden">
                        <Image
                          src={session.user.image}
                          alt={session.user.name}
                          width={30}
                          height={30}
                          className="scale-animation img"
                        />
                      </div>
                      <div className="ml-2">{session.user.name}</div>
                    </div>
                  ) : (
                    <FaUserCircle size={22} className="cursor-pointer" />
                  )}
                </Link>
                <Link href="/follows">
                  <div className="flex items-center">
                    <Heart className={`w-5 h-5 xl:h-auto xl:w-auto `} />

                    <div className="ml-2">Favoritos</div>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-y-6">
                <Link href="/follows">
                  <div className="flex items-center">
                    <Heart className={`w-5 h-5 xl:h-auto xl:w-auto `} />

                    <div className="ml-2">Favoritos</div>
                  </div>
                </Link>
                <Link href="/auth">
                  <div className="flex">
                    <User className="h-6 w-6" />
                    <div className="ml-2">Mi Cuenta</div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarContent;

const AngleRight = (props) => (
  <svg
    width="12px"
    height="12px"
    viewBox="0 0 8 13"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <title>Icono</title>
    <desc>Created with Sketch.</desc>
    <g
      id="Symbols"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <g id="Icon/Arrow/Right/Gray" fill="#898989">
        <g id="icon/Arrow/Right/Gray">
          <polygon
            id="Icon"
            points="0 11.4725 4.94466937 6.5 0 1.5275 1.52226721 0 8 6.5 1.52226721 13"
          ></polygon>
        </g>
      </g>
    </g>
  </svg>
);

const AngleLeft = (props) => (
  <svg
    version="1.1"
    id="Capa_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    width="10px"
    height="10px"
    viewBox="0 0 548.797 548.797"
    xmlSpace="preserve"
  >
    <g>
      <g>
        <path
          d="M476.249,20.818c-13.855-21.23-42.283-27.203-63.525-13.354l-304.904,199.01c-27.185,16.01-42.742,40.692-42.742,67.92
			c0,27.228,15.557,51.903,42.742,67.926l304.904,199.004c7.748,5.056,16.445,7.473,25.049,7.473
			c14.982,0,29.682-7.332,38.477-20.814c13.861-21.229,7.883-49.67-13.348-63.525L171.705,274.395l291.196-190.05
			C484.131,70.488,490.104,42.049,476.249,20.818z"
        />
      </g>
    </g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
    <g></g>
  </svg>
);
