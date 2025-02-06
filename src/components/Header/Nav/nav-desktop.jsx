import { useEffect, useState } from "react";


import NavMenuDesktop from "./nav-menu-desktop";
import NavMenuHoverDesktop from "./nav-menu-hover-desktop";
import NavSearch from "./nav-search";
import NavTop from "./nav-top";
import ToggleUserRole from "@/context/cambiarRol";


const dataHeader = {
  menuSubmenu: [
    // {
    //   id: "marcas",
    //   titulo: "Marcas",
    //   url: "/tienda?genero=mujer",

    //   infoNav: [
    //     {
    //       categoria: [
    //         {
    //           id: "1",
    //           title: "",
    //           url: "/tienda?genero=mujer",
    //         },
    //         {
    //           id: "3",
    //           title: "ADIDAS",
    //           url: "/tienda?marca=adidas",
    //         },
    //         {
    //           id: "5",
    //           title: "NIKE",
    //           url: "/tienda?marca=nike",
    //         },
    //       ],
    //     },
    //   ],
    // },
    // {
    //   id: "mujer",
    //   titulo: "Mujer",
    //   url: "/tienda?genero=mujer",

    //   infoNav: [
    //     {
    //       categoria: [
    //         {
    //           id: "1",
    //           title: "Ver Todas las Zapatillas",
    //           url: "/tienda?genero=mujer",
    //         },
    //         {
    //           id: "3",
    //           title: "Terrex",
    //           url: "/tienda?genero=mujer&category=terrex",
    //         },
    //         {
    //           id: "5",
    //           title: "Urbano",
    //           url: "/tienda?genero=mujer&category=urbano",
    //         },
    //         {
    //           id: "6",
    //           title: "Sandalias",
    //           url: "/tienda?genero=mujer&category=sandalias",
    //         },
    //         {
    //           id: "7",
    //           title: "Calzado de Plataforma",
    //           url: "/tienda?genero=mujer&category=plataforma",
    //         },
    //       ],
    //     },
    //     {
    //       categoria: [
    //         {
    //           id: "9",
    //           title: " Ropa",
    //           url: "/tienda?genero=mujer&category=ropas",
    //         },
    //         {
    //           id: "10",
    //           title: "Polos",
    //           url: "/tienda?genero=mujer&category=polos",
    //         },
    //         {
    //           id: "12",
    //           title: "Casacas",
    //           url: "/tienda?genero=mujer&category=casacas",
    //         },
    //         {
    //           id: "12",
    //           title: "Poleras",
    //           url: "/tienda?genero=mujer&category=poleras",
    //         },
    //         {
    //           id: "12",
    //           title: "Pantalones",
    //           url: "/tienda?genero=mujer&category=pantalones",
    //         },
    //         {
    //           id: "12",
    //           title: "Buzos",
    //           url: "/tienda?genero=mujer&category=buzos",
    //         },
    //       ],
    //     },
    //     {
    //       categoria: [
    //         {
    //           id: "13",
    //           title: "Accesorios",
    //           url: "/tienda?tipo=accesorios&genero=mujer",
    //         },
    //         {
    //           id: "14",
    //           title: "Bolsos",
    //           url: "/tienda?tipo=accesorios&genero=mujer&category=bolsos",
    //         },
    //         {
    //           id: "15",
    //           title: "Mochilas",
    //           url: "/tienda?tipo=accesorios&genero=mujer&category=mochilas",
    //         },
    //         {
    //           id: "16",
    //           title: "Gorras",
    //           url: "/tienda?tipo=accesorios&genero=mujer&category=gorras",
    //         },
    //       ],
    //     },
    //   ],
    // },
    {
      id: "catalogo Emprendedor",
      titulo: "Emprendedor",
      url: "/tienda?tipoproducto=web&",

      infoNav: [
        // {
        //   categoria: [
        //     {
        //       id: "1",
        //       title: "Ver Todas las Zapatillas",
        //       url: "/tienda?tipoproducto=web&tipo=calzado",
        //     },
        //     {
        //       id: "3",
        //       title: "Terrex",
        //       url: "/tienda?tipoproducto=web&tipo=calzado&category=terrex",
        //     },
        //     {
        //       id: "5",
        //       title: "Urbano",
        //       url: "/tienda?tipoproducto=web&tipo=calzado&category=urbano",
        //     },
        //     {
        //       id: "6",
        //       title: "Sandalias",
        //       url: "/tienda?tipoproducto=web&tipo=calzado&category=sandalias",
        //     },
        //     {
        //       id: "7",
        //       title: "Calzado de Plataforma",
        //       url: "/tienda?tipoproducto=web&tipo=calzado&category=plataforma",
        //     },
        //   ],
        // },
        // {
        //   categoria: [
        //     {
        //       id: "9",
        //       title: " Ropa",
        //       url: "/tienda?tipoproducto=web&tipo=calzado&category=ropas",
        //     },
        //     {
        //       id: "10",
        //       title: "Polos",
        //       url: "/tienda?tipoproducto=web&tipo=calzado&category=polos",
        //     },
        //     {
        //       id: "12",
        //       title: "Casacas",
        //       url: "/tienda?tipoproducto=web&tipo=calzado&category=casacas",
        //     },
        //     {
        //       id: "12",
        //       title: "Poleras",
        //       url: "/tienda?tipoproducto=web&tipo=calzado&category=poleras",
        //     },
        //     {
        //       id: "12",
        //       title: "Pantalones",
        //       url: "/tienda?tipoproducto=web&tipo=calzado&category=pantalones",
        //     },
        //     {
        //       id: "12",
        //       title: "Buzos",
        //       url: "/tienda?tipoproducto=web&tipo=calzado&category=buzos",
        //     },
        //   ],
        // },
        // {
        //   categoria: [
        //     {
        //       id: "13",
        //       title: "Accesorios",
        //       url: "/tienda?tipo=accesorios&genero=mujer",
        //     },
        //     {
        //       id: "14",
        //       title: "Bolsos",
        //       url: "/tienda?tipo=accesorios&genero=mujer&category=bolsos",
        //     },
        //     {
        //       id: "15",
        //       title: "Mochilas",
        //       url: "/tienda?tipo=accesorios&genero=mujer&category=mochilas",
        //     },
        //     {
        //       id: "16",
        //       title: "Gorras",
        //       url: "/tienda?tipo=accesorios&genero=mujer&category=gorras",
        //     },
        //   ],
        // },
        {
          categoria: [
            {
              id: "13",
              title: "Adidas Temporada",
              url: "/tienda?tipoproducto=web&razonsocial=fritzsport&marca=adidas",
            },
            {
              id: "14",
              title: "Adidas Liquidación",
              url: "/tienda?tipoproducto=web&razonsocial=fritzduran&marca=adidas",
            },
            {
              id: "14",
              title: "Nike",
              url: "/tienda?tipoproducto=web&razonsocial=fritzduran&marca=nike",
            },

          ],
        },
      ],
    },
    {
      id: "catalogo Mayorista",
      titulo: "Mayorista",
      url: "/tienda?tipoproducto=catalogo&",

      infoNav: [
        // {
        //   categoria: [
        //     {
        //       id: "1",
        //       title: "Ver Todas las Zapatillas",
        //       url: "/tienda?tipoproducto=catalogo",
        //     },
        //     {
        //       id: "3",
        //       title: "Terrex",
        //       url: "/tienda?tipoproducto=catalogo&category=terrex",
        //     },
        //     {
        //       id: "5",
        //       title: "Urbano",
        //       url: "/tienda?tipoproducto=catalogo&category=urbano",
        //     },
        //     {
        //       id: "6",
        //       title: "Sandalias",
        //       url: "/tienda?tipoproducto=catalogo&category=sandalias",
        //     },
        //     {
        //       id: "7",
        //       title: "Calzado de Plataforma",
        //       url: "/tienda?tipoproducto=catalogo&category=plataforma",
        //     },
        //   ],
        // },
        // {
        //   categoria: [
        //     {
        //       id: "9",
        //       title: " Ropa",
        //       url: "/tienda?tipoproducto=catalogo&category=ropas",
        //     },
        //     {
        //       id: "10",
        //       title: "Polos",
        //       url: "/tienda?tipoproducto=catalogo&category=polos",
        //     },
        //     {
        //       id: "12",
        //       title: "Casacas",
        //       url: "/tienda?tipoproducto=catalogo&category=casacas",
        //     },
        //     {
        //       id: "12",
        //       title: "Poleras",
        //       url: "/tienda?tipoproducto=catalogo&category=poleras",
        //     },
        //     {
        //       id: "12",
        //       title: "Pantalones",
        //       url: "/tienda?tipoproducto=catalogo&category=pantalones",
        //     },
        //     {
        //       id: "12",
        //       title: "Buzos",
        //       url: "/tienda?tipoproducto=catalogo&category=buzos",
        //     },
        //   ],
        // },
        // {
        //   categoria: [
        //     {
        //       id: "13",
        //       title: "Accesorios",
        //       url: "/tienda?tipoproducto=catalogo&tipo=accesorios",
        //     },
        //     {
        //       id: "14",
        //       title: "Bolsos",
        //       url: "/tienda?tipoproducto=catalogo&tipo=accesorios&category=bolsos",
        //     },
        //     {
        //       id: "15",
        //       title: "Mochilas",
        //       url: "/tienda?tipoproducto=catalogo&tipo=accesorios&category=mochilas",
        //     },
        //     {
        //       id: "16",
        //       title: "Gorras",
        //       url: "/tienda?tipoproducto=catalogo&tipo=accesorios&category=gorras",
        //     },
        //   ],
        // },
        {
          categoria: [
            {
              id: "13",
              title: "Adidas Temporada",
              url: "/tienda?tipoproducto=catalogo&razonsocial=fritzsport&marca=adidas",
            },
            {
              id: "14",
              title: "Adidas Liquidación",
              url: "/tienda?tipoproducto=catalogo&razonsocial=fritzduran&marca=adidas",
            },
            {
              id: "14",
              title: "Nike",
              url: "/tienda?tipoproducto=catalogo&razonsocial=fritzduran&marca=nike",
            },

          ],
        },
      ],
    },
    // {
    //   id: "Hombre",
    //   titulo: "Hombre",
    //   url: "/tienda?genero=hombre",
    //   infoNav: [
    //     {
    //       categoria: [
    //         {
    //           id: "1",
    //           title: "Ver Todas las Zapatillas",
    //           url: "/tienda?tipo=calzado&genero=hombre",
    //         },
    //         {
    //           id: "3",
    //           title: "Terrex",
    //           url: "/tienda?tipo=calzado&genero=hombre&category=terrex",
    //         },
    //         {
    //           id: "5",
    //           title: "Urbano",
    //           url: "/tienda?tipo=calzado&genero=hombre&category=urbano",
    //         },
    //         {
    //           id: "6",
    //           title: "Sandalias",
    //           url: "/tienda?tipo=calzado&genero=hombre&category=sandalias",
    //         },
    //       ],
    //     },
    //     {
    //       categoria: [
    //         {
    //           id: "9",
    //           title: " Ropa",
    //           url: "/tienda?tipo=ropa&genero=hombre",
    //         },
    //         {
    //           id: "10",
    //           title: "Polos",
    //           url: "/tienda?tipo=ropa&genero=hombre&category=polos",
    //         },
    //         {
    //           id: "12",
    //           title: "Casacas",
    //           url: "/tienda?tipo=ropa&genero=hombre&category=casacas",
    //         },
    //         {
    //           id: "12",
    //           title: "Poleras",
    //           url: "/tienda?tipo=ropa&genero=hombre&category=poleras",
    //         },
    //         {
    //           id: "12",
    //           title: "Pantalones",
    //           url: "/tienda?tipo=ropa&genero=hombre&category=pantalones",
    //         },
    //         {
    //           id: "12",
    //           title: "Buzos",
    //           url: "/tienda?tipo=ropa&genero=hombre&category=buzos",
    //         },
    //       ],
    //     },
    //     {
    //       categoria: [
    //         {
    //           id: "13",
    //           title: "Accesorios",
    //           url: "/tienda?tipo=accesorios&genero=hombre",
    //         },

    //         {
    //           id: "15",
    //           title: "Mochilas",
    //           url: "/tienda?tipo=accesorios&genero=hombre&category=mochilas",
    //         },
    //         {
    //           id: "16",
    //           title: "Gorras",
    //           url: "/tienda?tipo=accesorios&genero=hombre&category=gorras",
    //         },
    //       ],
    //     },
    //   ],
    // },

    // {
    //   id: "ninos",
    //   titulo: "Niños",
    //   url: "/tienda?genero=niños",
    //   infoNav: [
    //     {
    //       categoria: [
    //         {
    //           id: "35",
    //           title: "Calzado Niños",
    //           url: "/tienda?tipo=calzado&genero=niños",
    //         },
    //         {
    //           id: "36",
    //           title: "Zapatillas",
    //           url: "/tienda?tipo=calzado&genero=niños",
    //         },

    //         {
    //           id: "369",
    //           title: "Sandalias",

    //           url: "/tienda?tipo=calzado&genero=niños&category=sandalias",
    //         },
    //       ],
    //     },

    //     {
    //       categoria: [
    //         {
    //           id: "35",
    //           title: "Calzado Niños",
    //           url: "/tienda?tipo=calzado&genero=niños",
    //         },
    //         {
    //           id: "36",
    //           title: "Zapatillas",
    //           url: "/tienda?tipo=calzado&genero=niños",
    //         },
    //         {
    //           id: "39",
    //           title: "Sandalias",
    //           url: "/tienda?tipo=calzado&genero=niños&category=sandalias",
    //         },
    //       ],
    //     },
    //   ],
    // },

    {
      id: "tienda",
      titulo: "Tienda",
      url: "/tienda",
    },
    {
      id: "pdf",
      titulo: "DESCARGAR CATÁLOGO ",
      url: "/pdf",
    },
    // {
    //   id: "Ntiendas",
    //   titulo: "Ubícanos",
    //   url: "/nuestras-tiendas",
    // },
    // {
    //   id: "outlet",
    //   titulo: "SALE",
    //   url: "https://www.fritzsportoutlet.pe",
    // },
  ],
};

export function NavDesktop({
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
    <div className="relative w-full">
    <ul className="flex w-full items-center justify-around ">
       
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
      <div className="hidden xl:flex pr-10">
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
    {/* <div className="absolute flex w-full justify-center items-center bg-transparent ">

        <ToggleUserRole></ToggleUserRole>
    </div> */}

    </div>
  );
}
