import { useEffect, useState, useContext, useMemo } from "react";

import NavMenuDesktop from "./nav-menu-desktop";
import NavMenuHoverDesktop from "./nav-menu-hover-desktop";
import NavSearch from "./nav-search";
import NavTop from "./nav-top";
import ToggleUserRole from "@/context/cambiarRol";
import RoleContext from "@/context/roleContext";
import { useSession } from "next-auth/react";

const dataHeader = {
  menuSubmenu: [
    {
      id: "mujer",
      titulo: "Mujer",
      url: "/tienda?genero=mujer",

      infoNav: [
        {
          categoria: [
            {
              id: "1",
              title: "Ver Todas las Zapatillas",
              url: "/tienda?genero=mujer&tipo=calzado",
            },
            // {
            //   id: "3",
            //   title: "Terrex",
            //   url: "/tienda?genero=mujer&category=terrex",
            // },
        
            {
              id: "6",
              title: "Sandalias",
              url: "/tienda?genero=mujer&category=sandalias",
            },
            {
              id: "7",
              title: "Calzado de Plataforma",
              url: "/tienda?genero=mujer&category=plataforma",
            },
          ],
        },
        {
          categoria: [
            {
              id: "9",
              title: " Ropa",
              url: "/tienda?genero=mujer&category=ropa",
            },
            {
              id: "10",
              title: "Polos",
              url: "/tienda?genero=mujer&category=polo",
            },
            {
              id: "12",
              title: "Casacas",
              url: "/tienda?genero=mujer&category=casaca",
            },
            {
              id: "12",
              title: "Poleras",
              url: "/tienda?genero=mujer&category=polera",
            },
            {
              id: "12",
              title: "Pantalones",
              url: "/tienda?genero=mujer&category=pantalon",
            },
            {
              id: "12",
              title: "Buzos",
              url: "/tienda?genero=mujer&category=buzo",
            },
          ],
        },
        {
          categoria: [
            {
              id: "13",
              title: "Accesorios",
              url: "/tienda?tipo=accesorios&genero=mujer",
            },
            {
              id: "14",
              title: "Bolsos",
              url: "/tienda?tipo=accesorios&genero=mujer&category=bolso",
            },
            {
              id: "15",
              title: "Mochilas",
              url: "/tienda?tipo=accesorios&genero=mujer&category=mochila",
            },
            {
              id: "16",
              title: "Gorras",
              url: "/tienda?tipo=accesorios&genero=mujer&category=gorra",
            },
          ],
        },
      ],
    },
    {
      id: "Hombre",
      titulo: "Hombre",
      url: "/tienda?genero=hombre",
      infoNav: [
        {
          categoria: [
            {
              id: "1",
              title: "Ver Todas las Zapatillas",
              url: "/tienda?genero=hombre&tipo=calzado",
            },
    
            // {
            //   id: "5",
            //   title: "Urbano",
            //   url: "/tienda?tipo=calzado&genero=hombre&category=urbano",
            // },
            {
              id: "6",
              title: "Sandalias",
              url: "/tienda?tipo=calzado&genero=hombre&category=sandalia",
            },
          ],
        },
        {
          categoria: [
            {
              id: "9",
              title: " Ropa",
              url: "/tienda?tipo=ropa&genero=hombre",
            },
            {
              id: "10",
              title: "Polos",
              url: "/tienda?tipo=ropa&genero=hombre&category=polo",
            },
            {
              id: "12",
              title: "Casacas",
              url: "/tienda?tipo=ropa&genero=hombre&category=casaca",
            },
            {
              id: "12",
              title: "Poleras",
              url: "/tienda?tipo=ropa&genero=hombre&category=polera",
            },
            {
              id: "12",
              title: "Pantalones",
              url: "/tienda?tipo=ropa&genero=hombre&category=pantalon",
            },
            {
              id: "12",
              title: "Buzos",
              url: "/tienda?tipo=ropa&genero=hombre&category=buzo",
            },
          ],
        },
        {
          categoria: [
            {
              id: "13",
              title: "Accesorios",
              url: "/tienda?tipo=accesorios&genero=hombre",
            },

            {
              id: "15",
              title: "Mochilas",
              url: "/tienda?tipo=accesorios&genero=hombre&category=mochila",
            },
            {
              id: "16",
              title: "Gorras",
              url: "/tienda?tipo=accesorios&genero=hombre&category=gorra",
            },
          ],
        },
      ],
    },

    {
      id: "ninos",
      titulo: "Niños",
      url: "/tienda?genero=niños",
      infoNav: [
        {
          categoria: [
            {
              id: "35",
              title: "Calzado Niño",
              url: "/tienda?tipo=calzado&genero=niños",
            },
            {
              id: "36",
              title: "Zapatillas",
              url: "/tienda?tipo=calzado&genero=niño&category=zapatilla",
            },

            {
              id: "369",
              title: "Sandalias",

              url: "/tienda?tipo=calzado&genero=niño&category=sandalia",
            },
          ],
        },

        {
          categoria: [
            {
              id: "35",
              title: "Calzado Niña",
              url: "/tienda?tipo=calzado&genero=niña",
            },
            {
              id: "36",
              title: "Zapatillas",
              url: "/tienda?tipo=calzado&genero=niña&category=zapatilla",
            },
            {
              id: "39",
              title: "Sandalias",
              url: "/tienda?tipo=calzado&genero=niña&category=sandalia",
            },
          ],
        },
      ],
    },
    // {
    //   id: "tienda",
    //   titulo: "Tienda",
    //   url: "/tienda",
    //   infoNav: [
    //     {
    //       categoria: [
    //         {
    //           id: "35",
    //           title: "Fritz Sport",
    //           url: "/tienda?marca=fritzsport",
    //         },
    //         // {
    //         //   id: "35",
    //         //   title: "Fritz Gato",
    //         //   url: "/tienda?search=zapatillas%20fritz",
    //         // },


    //         // {
    //         //   id: "35",
    //         //   title: "Fritz Peloteras",
    //         //   url: "/tienda?search=peloteras%20fritz",
    //         // },
    //       ],
      
    //     },
    //     {
    //       categoria: [
    //         {
    //           id: "35",
    //           title: "Adidas linea",
    //           url: "/tienda?razonsocial=fritzsport&tipoproducto=catalogo&marca=adidas",
    //         },
    //         {
    //           id: "35",
    //           title: "Adidas linea Mujer",
    //           url: "/tienda?razonsocial=fritzsport&tipoproducto=catalogo&marca=adidas&genero=mujer",
    //         },

    //         {
    //           id: "35",
    //           title: "Adidas linea Hombre",
    //           url: "/tienda?razonsocial=fritzsport&tipoproducto=catalogo&marca=adidas&genero=hombre",
    //         },
    //         {
    //           id: "35",
    //           title: "Adidas linea Niños",
    //           url: "/tienda?razonsocial=fritzsport&tipoproducto=catalogo&marca=adidas&genero=niños",
    //         },
    //       ],
      
    //     },
    //     {
    //       categoria: [
    //         {
    //           id: "35",
    //           title: "Adidas liquidación",
    //           url: "/tienda?razonsocial=fritzduran&tipoproducto=catalogo&marca=adidas",
    //         },
    //         {
    //           id: "35",
    //           title: "Adidas liquidación Mujer",
    //           url: "/tienda?razonsocial=fritzduran&tipoproducto=catalogo&marca=adidas&genero=mujer",
    //         },

    //         {
    //           id: "35",
    //           title: "Adidas liquidación Hombre",
    //           url: "/tienda?razonsocial=fritzduran&tipoproducto=catalogo&marca=adidas&genero=hombre",
    //         },
    //         {
    //           id: "35",
    //           title: "Adidas liquidación Niños",
    //           url: "/tienda?razonsocial=fritzduran&tipoproducto=catalogo&marca=adidas&genero=niños",
    //         },
    //       ],
      
    //     },

    //     {
    //       categoria: [
    //         {
    //           id: "35",
    //           title: "Nike linea",
    //           url: "/tienda?razonsocial=fritzsport&tipoproducto=catalogo&marca=nike",
    //         },
    //         {
    //           id: "35",
    //           title: "Nike linea Mujer",
    //           url: "/tienda?razonsocial=fritzsport&tipoproducto=catalogo&marca=nike&genero=mujer",
    //         },

    //         {
    //           id: "35",
    //           title: "Nike linea Hombre",
    //           url: "/tienda?razonsocial=fritzsport&tipoproducto=catalogo&marca=nike&genero=hombre",
    //         },
    //         {
    //           id: "35",
    //           title: "Nike linea Niños",
    //           url: "/tienda?razonsocial=fritzsport&tipoproducto=catalogo&marca=nike&genero=niños",
    //         },
    //       ],
    //     },
    //     {
    //       categoria: [
    //         {
    //           id: "35",
    //           title: "Reebok linea",
    //           url: "/tienda?razonsocial=fritzduran&tipoproducto=catalogo&marca=reebok",
    //         },
    //         {
    //           id: "35",
    //           title: "Reebok linea Mujer",
    //           url: "/tienda?razonsocial=fritzduran&tipoproducto=catalogo&marca=reebok&genero=mujer",
    //         },

    //         {
    //           id: "35",
    //           title: "Reebok linea Hombre",
    //           url: "/tienda?razonsocial=fritzduran&tipoproducto=catalogo&marca=reebok&genero=hombre",
    //         },
    //         {
    //           id: "35",
    //           title: "Reebok linea Niños",
    //           url: "/tienda?razonsocial=fritzduran&tipoproducto=catalogo&marca=reebok&genero=niños",
    //         },
    //       ],
    //     },
    //     {
    //       categoria: [
    //         {
    //           id: "35",
    //           title: "Accesorios",
    //           url: "/tienda?tipoproducto=catalogo&tipo=accesorios",
    //         },
    //         {
    //           id: "35",
    //           title: "Ropa",
    //           url: "/tienda?tipoproducto=catalogo&tipo=ropa",

    //         },

    //         {
    //           id: "35",
    //           title: "Ropa Hombre",
    //           url: "/tienda?tipoproducto=catalogo&tipo=ropa&genero=hombre",

    //         },
    //         {
    //           id: "35",
    //           title: "Ropa Mujer",
    //           url: "/tienda?tipoproducto=catalogo&tipo=ropa&genero=mujer",

    //         },
    //         {
    //           id: "35",
    //           title: "Ropa Niños",
    //           url: "/tienda?tipoproducto=catalogo&tipo=ropa&genero=niños",

    //         },
            
    //       ],
    //     },
    //   ],
    // },
    // {
    //   id: "tienda-Mayorista",
    //   titulo: "Tienda Mayorista",
    //   url: "/tienda-mayorista",
    //   infoNav: [
    //     {
    //       categoria: [
    //         {
    //           id: "35",
    //           title: "Fritz Sport",
    //           url: "/tienda-mayorista?tipoproducto=catalogo&marca=fritzsport",
    //         },
    //         // {
    //         //   id: "35",
    //         //   title: "Fritz Gato",
    //         //   url: "/tienda-mayorista?search=zapatillas%20fritz",
    //         // },


    //         // {
    //         //   id: "35",
    //         //   title: "Fritz Peloteras",
    //         //   url: "/tienda-mayorista?search=peloteras%20fritz",
    //         // },
    //       ],
      
    //     },
    //     {
    //       categoria: [
    //         {
    //           id: "35",
    //           title: "Adidas linea",
    //           url: "/tienda-mayorista?razonsocial=fritzsport&tipoproducto=catalogo&marca=adidas",
    //         },
    //         {
    //           id: "35",
    //           title: "Adidas linea Mujer",
    //           url: "/tienda-mayorista?razonsocial=fritzsport&tipoproducto=catalogo&marca=adidas&genero=mujer",
    //         },

    //         {
    //           id: "35",
    //           title: "Adidas linea Hombre",
    //           url: "/tienda-mayorista?razonsocial=fritzsport&tipoproducto=catalogo&marca=adidas&genero=hombre",
    //         },
    //         {
    //           id: "35",
    //           title: "Adidas linea Niños",
    //           url: "/tienda-mayorista?razonsocial=fritzsport&tipoproducto=catalogo&marca=adidas&genero=niños",
    //         },
    //       ],
      
    //     },
    //     {
    //       categoria: [
    //         {
    //           id: "35",
    //           title: "Adidas liquidación",
    //           url: "/tienda-mayorista?razonsocial=fritzduran&tipoproducto=catalogo&marca=adidas",
    //         },
    //         {
    //           id: "35",
    //           title: "Adidas liquidación Mujer",
    //           url: "/tienda-mayorista?razonsocial=fritzduran&tipoproducto=catalogo&marca=adidas&genero=mujer",
    //         },

    //         {
    //           id: "35",
    //           title: "Adidas liquidación Hombre",
    //           url: "/tienda-mayorista?razonsocial=fritzduran&tipoproducto=catalogo&marca=adidas&genero=hombre",
    //         },
    //         {
    //           id: "35",
    //           title: "Adidas liquidación Niños",
    //           url: "/tienda-mayorista?razonsocial=fritzduran&tipoproducto=catalogo&marca=adidas&genero=niños",
    //         },
    //       ],
      
    //     },

    //     {
    //       categoria: [
    //         {
    //           id: "35",
    //           title: "Nike linea",
    //           url: "/tienda-mayorista?razonsocial=fritzsport&tipoproducto=catalogo&marca=nike",
    //         },
    //         {
    //           id: "35",
    //           title: "Nike linea Mujer",
    //           url: "/tienda-mayorista?razonsocial=fritzsport&tipoproducto=catalogo&marca=nike&genero=mujer",
    //         },

    //         {
    //           id: "35",
    //           title: "Nike linea Hombre",
    //           url: "/tienda-mayorista?razonsocial=fritzsport&tipoproducto=catalogo&marca=nike&genero=hombre",
    //         },
    //         {
    //           id: "35",
    //           title: "Nike linea Niños",
    //           url: "/tienda-mayorista?razonsocial=fritzsport&tipoproducto=catalogo&marca=nike&genero=niños",
    //         },
    //       ],
    //     },
    //     {
    //       categoria: [
    //         {
    //           id: "35",
    //           title: "Reebok linea",
    //           url: "/tienda-mayorista?razonsocial=fritzduran&tipoproducto=catalogo&marca=reebok",
    //         },
    //         {
    //           id: "35",
    //           title: "Reebok linea Mujer",
    //           url: "/tienda-mayorista?razonsocial=fritzduran&tipoproducto=catalogo&marca=reebok&genero=mujer",
    //         },

    //         {
    //           id: "35",
    //           title: "Reebok linea Hombre",
    //           url: "/tienda-mayorista?razonsocial=fritzduran&tipoproducto=catalogo&marca=reebok&genero=hombre",
    //         },
    //         {
    //           id: "35",
    //           title: "Reebok linea Niños",
    //           url: "/tienda-mayorista?razonsocial=fritzduran&tipoproducto=catalogo&marca=reebok&genero=niños",
    //         },
    //       ],
    //     },
    //     {
    //       categoria: [
    //         {
    //           id: "35",
    //           title: "Accesorios",
    //           url: "/tienda-mayorista?tipoproducto=catalogo&tipo=accesorios",
    //         },
    //         {
    //           id: "35",
    //           title: "Ropa",
    //           url: "/tienda-mayorista?tipoproducto=catalogo&tipo=ropa",

    //         },

    //         {
    //           id: "35",
    //           title: "Ropa Hombre",
    //           url: "/tienda-mayorista?tipoproducto=catalogo&tipo=ropa&genero=hombre",

    //         },
    //         {
    //           id: "35",
    //           title: "Ropa Mujer",
    //           url: "/tienda-mayorista?tipoproducto=catalogo&tipo=ropa&genero=mujer",

    //         },
    //         {
    //           id: "35",
    //           title: "Ropa Niños",
    //           url: "/tienda-mayorista?tipoproducto=catalogo&tipo=ropa&genero=niños",

    //         },
            
    //       ],
    //     },
    //   ],
    // },
  
    // {
    //   id: "colections",
    //   titulo: "colecciones",
    //   url: "/tienda",
    //   infoNav: [
    //     // { label: "Adidas Superstar", value: "superstar" },
    //     // { label: "Adidas Forum", value: "forum" },
    //     // { label: "Adidas Stan Smith", value: "stansmith" },
    //     // { label: "Adidas Samba", value: "samba" },
    //     // { label: "Adidas Gazelle", value: "gazelle" },
    //     // { label: "Adidas Campus", value: "campus" },

    //     {
    //       categoria: [
    //         {
    //           id: "1",
    //           title: "Adidas",
    //           url: "/tienda?marca=adidas",
    //         },
    //         {
    //           id: "3",
    //           title: " Superstar",
    //           url: "/tienda?search=superstar",
    //         },
    //         {
    //           id: "5",
    //           title: "Forum",
    //           url: "/tienda?search=forum",
    //         },
    //         {
    //           id: "6",
    //           title: " Stan Smith",
    //           url: "/tienda?search=stan-smith",
    //         },
    //         {
    //           id: "6",
    //           title: " Samba",
    //           url: "/tienda?search=samba",
    //         },
    //         {
    //           id: "6",
    //           title: " Gazelle",
    //           url: "/tienda?search=gazelle",
    //         },
    //         {
    //           id: "6",
    //           title: " Campus",
    //           url: "/tienda?search=campus",
    //         },
    //       ],
    //     },
    //     {
    //       categoria: [
    //         {
    //           id: "1",
    //           title: "Nike",
    //           url: "/tienda?marca=nike",
    //         },
    //         {
    //           id: "3",
    //           title: "Air Force 1",
    //           url: "/tienda?search=air-force",
    //         },
    //         {
    //           id: "4",
    //           title: "Air Max Excee",
    //           url: "/tienda?search=air-max-excee",
    //         },
    //         {
    //           id: "6",
    //           title: "Air Max 90",
    //           url: "/tienda?search=air-force-max",
    //         },
    //         {
    //           id: "5",
    //           title: "Jordan",
    //           url: "/tienda?search=jordan",
    //         },
    //         {
    //           id: "5",
    //           title: "Dunk",
    //           url: "/tienda?search=dunk",
    //         },
    //       ],
    //     },
    //     // {
    //     //   categoria: [
    //     //     {
    //     //       id: "9",
    //     //       title: "Nike",
    //     //       url: "/tienda?tipo=ropa&genero=hombre",
    //     //     },
    //     //     {
    //     //       id: "10",
    //     //       title: "Polos",
    //     //       url: "/tienda?tipo=ropa&genero=hombre&category=polo",
    //     //     },
    //     //     {
    //     //       id: "12",
    //     //       title: "Casacas",
    //     //       url: "/tienda?tipo=ropa&genero=hombre&category=casaca",
    //     //     },
    //     //     {
    //     //       id: "12",
    //     //       title: "Poleras",
    //     //       url: "/tienda?tipo=ropa&genero=hombre&category=polera",
    //     //     },
    //     //     {
    //     //       id: "12",
    //     //       title: "Pantalones",
    //     //       url: "/tienda?tipo=ropa&genero=hombre&category=pantalon",
    //     //     },
    //     //     {
    //     //       id: "12",
    //     //       title: "Buzos",
    //     //       url: "/tienda?tipo=ropa&genero=hombre&category=buzo",
    //     //     },
    //     //   ],
    //     // },
    //   ],
    // },

    // {
    //   id: "Ntiendas",
    //   titulo: "Ubicanos",
    //   url: "#",
    // },

    // {
    //   id: "outlet",
    //   titulo: "SALE",
    //   url: "outlet",
    // },
  ],
};

export function NavDesktop({
  children,
}) {
  const [activeHoverNavDesktop, setActiveHoverNavDesktop] = useState();
  const { userRole } = useContext(RoleContext);
  const { status } = useSession();

  const canSeeStores = status === "authenticated" && userRole === "callcenter";

  // Solo mostrar: Catálogo (/pdf), Emprende (/emprende), Nuestras Tiendas (/nuestras-tiendas)
  // y, si puede ver tiendas (callcenter autenticado), agregar Tienda y Tienda Mayorista.
  const finalMenuSubmenu = useMemo(() => {
    const baseMenu = [
      { id: "catalogo", titulo: "Catálogo", url: "/pdf" },
      // { id: "emprende", titulo: "Emprende", url: "/emprende" },
      // { id: "nuestras-tiendas", titulo: "Nuestras Tiendas", url: "/nuestras-tiendas" },
    ];

    if (!canSeeStores) return baseMenu;

    const tienda = dataHeader.menuSubmenu.find((i) => i.id === "tienda");
    const tiendaMayorista = dataHeader.menuSubmenu.find((i) => i.id === "tienda-Mayorista");

    return [
      ...baseMenu,
      ...(tienda ? [tienda] : []),
      ...(tiendaMayorista ? [tiendaMayorista] : []),
    ];
  }, [canSeeStores]);

  // desktop nav
  const [hoverMenu, setHoverMenu] = useState(
    finalMenuSubmenu.find((i) => i.infoNav)?.infoNav || []
  );
  const [andler, setAndler] = useState(false);
  useEffect(() => {
    if (!andler) {
      setActiveHoverNavDesktop(undefined);
    }
  }, [andler]);

  const handleHover = (index) => {
    setActiveHoverNavDesktop(index);

    setAndler(true);
    setHoverMenu(finalMenuSubmenu[index]?.infoNav || []);
  };

  return (
    <div className="relative w-full">
      <ul className="flex w-full items-center justify-end ">
        <div className="absolute left-12">{children}</div>
        <div className="flex w-full items-center justify-center px-4">
          <div className=" grid grid-flow-col items-center gap-x-10 2xl:gap-x-16">
            <NavMenuDesktop
              handleHover={handleHover}
              setAndler={setAndler}
              dataHeader={{ menuSubmenu: finalMenuSubmenu }}
              activeHoverNavDesktop={activeHoverNavDesktop}
            />
          </div>

          <div className="xl:hidden">
            <NavTop>
              <NavSearch />
            </NavTop>
          </div>
          <div className="hidden xl:flex  absolute right-20 ">
            <NavTop>
              <NavSearch />
            </NavTop>
          </div>
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
