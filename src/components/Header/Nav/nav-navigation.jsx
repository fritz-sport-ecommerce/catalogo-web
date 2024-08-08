import { useEffect, useState } from "react";
import Link from "next/link";

import NavMenuDesktop from "./nav-menu-desktop";
import NavMenuHoverDesktop from "./nav-menu-hover-desktop";
import NavSearch from "./nav-search";
import NavTop from "./nav-top";

const dataHeader = {
  menuSubmenu: [
    {
      id: "marcas",
      titulo: "Marcas",
      url: "/productos?genero=mujer",

      infoNav: [
        {
          categoria: [
            {
              id: "1",
              title: "",
              url: "/productos?genero=mujer",
            },
            {
              id: "3",
              title: "ADIDAS",
              url: "/productos?marca=adidas",
            },
            {
              id: "5",
              title: "NIKE",
              url: "/productos?marca=nike",
            },
          ],
        },
      ],
    },
    // {
    //   id: "mujer",
    //   titulo: "Mujer",
    //   url: "/productos?genero=mujer",

    //   infoNav: [
    //     {
    //       categoria: [
    //         {
    //           id: "1",
    //           title: "Ver Todas las Zapatillas",
    //           url: "/productos?genero=mujer",
    //         },
    //         {
    //           id: "3",
    //           title: "Terrex",
    //           url: "/productos?genero=mujer&category=terrex",
    //         },
    //         {
    //           id: "5",
    //           title: "Urbano",
    //           url: "/productos?genero=mujer&category=urbano",
    //         },
    //         {
    //           id: "6",
    //           title: "Sandalias",
    //           url: "/productos?genero=mujer&category=sandalias",
    //         },
    //         {
    //           id: "7",
    //           title: "Calzado de Plataforma",
    //           url: "/productos?genero=mujer&category=plataforma",
    //         },
    //       ],
    //     },
    //     {
    //       categoria: [
    //         {
    //           id: "9",
    //           title: " Ropa",
    //           url: "/productos?genero=mujer&category=ropas",
    //         },
    //         {
    //           id: "10",
    //           title: "Polos",
    //           url: "/productos?genero=mujer&category=polos",
    //         },
    //         {
    //           id: "12",
    //           title: "Casacas",
    //           url: "/productos?genero=mujer&category=casacas",
    //         },
    //         {
    //           id: "12",
    //           title: "Poleras",
    //           url: "/productos?genero=mujer&category=poleras",
    //         },
    //         {
    //           id: "12",
    //           title: "Pantalones",
    //           url: "/productos?genero=mujer&category=pantalones",
    //         },
    //         {
    //           id: "12",
    //           title: "Buzos",
    //           url: "/productos?genero=mujer&category=buzos",
    //         },
    //       ],
    //     },
    //     {
    //       categoria: [
    //         {
    //           id: "13",
    //           title: "Accesorios",
    //           url: "/productos?tipo=accesorios&genero=mujer",
    //         },
    //         {
    //           id: "14",
    //           title: "Bolsos",
    //           url: "/productos?tipo=accesorios&genero=mujer&category=bolsos",
    //         },
    //         {
    //           id: "15",
    //           title: "Mochilas",
    //           url: "/productos?tipo=accesorios&genero=mujer&category=mochilas",
    //         },
    //         {
    //           id: "16",
    //           title: "Gorras",
    //           url: "/productos?tipo=accesorios&genero=mujer&category=gorras",
    //         },
    //       ],
    //     },
    //   ],
    // },
    {
      id: "catalogo Emprendedor",
      titulo: "Catalogo Emprendedor",
      url: "/productos?tipoproducto=web&",

      infoNav: [
        // {
        //   categoria: [
        //     {
        //       id: "1",
        //       title: "Ver Todas las Zapatillas",
        //       url: "/productos?tipoproducto=web&tipo=calzado",
        //     },
        //     {
        //       id: "3",
        //       title: "Terrex",
        //       url: "/productos?tipoproducto=web&tipo=calzado&category=terrex",
        //     },
        //     {
        //       id: "5",
        //       title: "Urbano",
        //       url: "/productos?tipoproducto=web&tipo=calzado&category=urbano",
        //     },
        //     {
        //       id: "6",
        //       title: "Sandalias",
        //       url: "/productos?tipoproducto=web&tipo=calzado&category=sandalias",
        //     },
        //     {
        //       id: "7",
        //       title: "Calzado de Plataforma",
        //       url: "/productos?tipoproducto=web&tipo=calzado&category=plataforma",
        //     },
        //   ],
        // },
        // {
        //   categoria: [
        //     {
        //       id: "9",
        //       title: " Ropa",
        //       url: "/productos?tipoproducto=web&tipo=calzado&category=ropas",
        //     },
        //     {
        //       id: "10",
        //       title: "Polos",
        //       url: "/productos?tipoproducto=web&tipo=calzado&category=polos",
        //     },
        //     {
        //       id: "12",
        //       title: "Casacas",
        //       url: "/productos?tipoproducto=web&tipo=calzado&category=casacas",
        //     },
        //     {
        //       id: "12",
        //       title: "Poleras",
        //       url: "/productos?tipoproducto=web&tipo=calzado&category=poleras",
        //     },
        //     {
        //       id: "12",
        //       title: "Pantalones",
        //       url: "/productos?tipoproducto=web&tipo=calzado&category=pantalones",
        //     },
        //     {
        //       id: "12",
        //       title: "Buzos",
        //       url: "/productos?tipoproducto=web&tipo=calzado&category=buzos",
        //     },
        //   ],
        // },
        // {
        //   categoria: [
        //     {
        //       id: "13",
        //       title: "Accesorios",
        //       url: "/productos?tipo=accesorios&genero=mujer",
        //     },
        //     {
        //       id: "14",
        //       title: "Bolsos",
        //       url: "/productos?tipo=accesorios&genero=mujer&category=bolsos",
        //     },
        //     {
        //       id: "15",
        //       title: "Mochilas",
        //       url: "/productos?tipo=accesorios&genero=mujer&category=mochilas",
        //     },
        //     {
        //       id: "16",
        //       title: "Gorras",
        //       url: "/productos?tipo=accesorios&genero=mujer&category=gorras",
        //     },
        //   ],
        // },
        {
          categoria: [
            {
              id: "13",
              title: "Adidas Temporada",
              url: "/productos?tipoproducto=web&razonsocial=fritzsport&marca=adidas",
            },
            {
              id: "14",
              title: "Adidas Liquidación",
              url: "/productos?tipoproducto=web&razonsocial=fritzduran&marca=adidas",
            },
            {
              id: "14",
              title: "Nike",
              url: "/productos?tipoproducto=web&razonsocial=fritzduran&marca=nike",
            },

          ],
        },
      ],
    },
    {
      id: "catalogo Mayorista",
      titulo: "Catalogo Mayorista",
      url: "/productos?tipoproducto=catalogo&",

      infoNav: [
        // {
        //   categoria: [
        //     {
        //       id: "1",
        //       title: "Ver Todas las Zapatillas",
        //       url: "/productos?tipoproducto=catalogo",
        //     },
        //     {
        //       id: "3",
        //       title: "Terrex",
        //       url: "/productos?tipoproducto=catalogo&category=terrex",
        //     },
        //     {
        //       id: "5",
        //       title: "Urbano",
        //       url: "/productos?tipoproducto=catalogo&category=urbano",
        //     },
        //     {
        //       id: "6",
        //       title: "Sandalias",
        //       url: "/productos?tipoproducto=catalogo&category=sandalias",
        //     },
        //     {
        //       id: "7",
        //       title: "Calzado de Plataforma",
        //       url: "/productos?tipoproducto=catalogo&category=plataforma",
        //     },
        //   ],
        // },
        // {
        //   categoria: [
        //     {
        //       id: "9",
        //       title: " Ropa",
        //       url: "/productos?tipoproducto=catalogo&category=ropas",
        //     },
        //     {
        //       id: "10",
        //       title: "Polos",
        //       url: "/productos?tipoproducto=catalogo&category=polos",
        //     },
        //     {
        //       id: "12",
        //       title: "Casacas",
        //       url: "/productos?tipoproducto=catalogo&category=casacas",
        //     },
        //     {
        //       id: "12",
        //       title: "Poleras",
        //       url: "/productos?tipoproducto=catalogo&category=poleras",
        //     },
        //     {
        //       id: "12",
        //       title: "Pantalones",
        //       url: "/productos?tipoproducto=catalogo&category=pantalones",
        //     },
        //     {
        //       id: "12",
        //       title: "Buzos",
        //       url: "/productos?tipoproducto=catalogo&category=buzos",
        //     },
        //   ],
        // },
        // {
        //   categoria: [
        //     {
        //       id: "13",
        //       title: "Accesorios",
        //       url: "/productos?tipoproducto=catalogo&tipo=accesorios",
        //     },
        //     {
        //       id: "14",
        //       title: "Bolsos",
        //       url: "/productos?tipoproducto=catalogo&tipo=accesorios&category=bolsos",
        //     },
        //     {
        //       id: "15",
        //       title: "Mochilas",
        //       url: "/productos?tipoproducto=catalogo&tipo=accesorios&category=mochilas",
        //     },
        //     {
        //       id: "16",
        //       title: "Gorras",
        //       url: "/productos?tipoproducto=catalogo&tipo=accesorios&category=gorras",
        //     },
        //   ],
        // },
        {
          categoria: [
            {
              id: "13",
              title: "Adidas Temporada",
              url: "/productos?tipoproducto=catalogo&razonsocial=fritzsport&marca=adidas",
            },
            {
              id: "14",
              title: "Adidas Liquidación",
              url: "/productos?tipoproducto=catalogo&razonsocial=fritzduran&marca=adidas",
            },
            {
              id: "14",
              title: "Nike",
              url: "/productos?tipoproducto=catalogo&razonsocial=fritzduran&marca=nike",
            },

          ],
        },
      ],
    },
    // {
    //   id: "Hombre",
    //   titulo: "Hombre",
    //   url: "/productos?genero=hombre",
    //   infoNav: [
    //     {
    //       categoria: [
    //         {
    //           id: "1",
    //           title: "Ver Todas las Zapatillas",
    //           url: "/productos?tipo=calzado&genero=hombre",
    //         },
    //         {
    //           id: "3",
    //           title: "Terrex",
    //           url: "/productos?tipo=calzado&genero=hombre&category=terrex",
    //         },
    //         {
    //           id: "5",
    //           title: "Urbano",
    //           url: "/productos?tipo=calzado&genero=hombre&category=urbano",
    //         },
    //         {
    //           id: "6",
    //           title: "Sandalias",
    //           url: "/productos?tipo=calzado&genero=hombre&category=sandalias",
    //         },
    //       ],
    //     },
    //     {
    //       categoria: [
    //         {
    //           id: "9",
    //           title: " Ropa",
    //           url: "/productos?tipo=ropa&genero=hombre",
    //         },
    //         {
    //           id: "10",
    //           title: "Polos",
    //           url: "/productos?tipo=ropa&genero=hombre&category=polos",
    //         },
    //         {
    //           id: "12",
    //           title: "Casacas",
    //           url: "/productos?tipo=ropa&genero=hombre&category=casacas",
    //         },
    //         {
    //           id: "12",
    //           title: "Poleras",
    //           url: "/productos?tipo=ropa&genero=hombre&category=poleras",
    //         },
    //         {
    //           id: "12",
    //           title: "Pantalones",
    //           url: "/productos?tipo=ropa&genero=hombre&category=pantalones",
    //         },
    //         {
    //           id: "12",
    //           title: "Buzos",
    //           url: "/productos?tipo=ropa&genero=hombre&category=buzos",
    //         },
    //       ],
    //     },
    //     {
    //       categoria: [
    //         {
    //           id: "13",
    //           title: "Accesorios",
    //           url: "/productos?tipo=accesorios&genero=hombre",
    //         },

    //         {
    //           id: "15",
    //           title: "Mochilas",
    //           url: "/productos?tipo=accesorios&genero=hombre&category=mochilas",
    //         },
    //         {
    //           id: "16",
    //           title: "Gorras",
    //           url: "/productos?tipo=accesorios&genero=hombre&category=gorras",
    //         },
    //       ],
    //     },
    //   ],
    // },

    // {
    //   id: "ninos",
    //   titulo: "Niños",
    //   url: "/productos?genero=niños",
    //   infoNav: [
    //     {
    //       categoria: [
    //         {
    //           id: "35",
    //           title: "Calzado Niños",
    //           url: "/productos?tipo=calzado&genero=niños",
    //         },
    //         {
    //           id: "36",
    //           title: "Zapatillas",
    //           url: "/productos?tipo=calzado&genero=niños",
    //         },

    //         {
    //           id: "369",
    //           title: "Sandalias",

    //           url: "/productos?tipo=calzado&genero=niños&category=sandalias",
    //         },
    //       ],
    //     },

    //     {
    //       categoria: [
    //         {
    //           id: "35",
    //           title: "Calzado Niños",
    //           url: "/productos?tipo=calzado&genero=niños",
    //         },
    //         {
    //           id: "36",
    //           title: "Zapatillas",
    //           url: "/productos?tipo=calzado&genero=niños",
    //         },
    //         {
    //           id: "39",
    //           title: "Sandalias",
    //           url: "/productos?tipo=calzado&genero=niños&category=sandalias",
    //         },
    //       ],
    //     },
    //   ],
    // },

    {
      id: "tienda",
      titulo: "Productos",
      url: "/productos",
    },
    {
      id: "Ntiendas",
      titulo: "Nuestras Tiendas",
      url: "/nuestras-tiendas",
    },
    // {
    //   id: "outlet",
    //   titulo: "SALE",
    //   url: "https://www.fritzsportoutlet.pe",
    // },
  ],
};

export function NavNavigation({
  children,
  setActiveSearchDesk,
  activeSearchDesk,
}) {
  const [activeHoverNavDesktop, setActiveHoverNavDesktop] = useState();

  // desktop nav
  const [hoverMenu, setHoverMenu] = useState(dataHeader.menuSubmenu[0].infoNav);
  const [andler, setAndler] = useState(false);
  useEffect(() => {
    if (!andler) {
      setActiveHoverNavDesktop(undefined);
    }
  }, [andler]);

  const handleHover = (index) => {
    setActiveHoverNavDesktop(index);

    setAndler(true);
    setHoverMenu(dataHeader.menuSubmenu[index].infoNav);
  };

  return (
    <ul className="flex w-full items-center justify-around">
      <div>{children}</div>
      <div className=" grid grid-flow-col items-center gap-x-10 2xl:gap-x-16">
        <NavMenuDesktop
          handleHover={handleHover}
          setAndler={setAndler}
          dataHeader={dataHeader}
          activeHoverNavDesktop={activeHoverNavDesktop}
        />
      </div>
      <div className="xl:hidden">
        <NavTop>
          <NavSearch />
        </NavTop>
      </div>
      <div className="hidden xl:flex">
        <NavTop
          setActiveSearchDesk={setActiveSearchDesk}
          activeSearchDesk={activeSearchDesk}
        >
          <NavSearch />
        </NavTop>
      </div>
      <NavMenuHoverDesktop
        andler={andler}
        setAndler={setAndler}
        hoverMenu={hoverMenu}
      />
    </ul>
  );
}
