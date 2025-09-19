"use client";

import React, { useContext, useState } from "react";
import { ExternalLink, Tag } from "lucide-react";
import RoleContext from "@/context/roleContext";

type NavLink = {
  label: string;
  href: string;
  hasDropdown: boolean;
  gender?: string;
  marca?: string;
  icon?: boolean;
  special?: boolean;
};

// Definir las categorías por género
const categoriesByGender = {
  hombre: [
    { name: "Terrex", value: "terrex" },
    { name: "Urbano", value: "urbano" },
    { name: "Running", value: "running" },
    { name: "Básquet", value: "basquet" },
    { name: "Training", value: "training" },
    
    { name: "Chimpunes", value: "chimpunes" },
    { name: "Plataforma", value: "plataforma" },
    { name: "Sandalias", value: "sandalias" },
    { name: "Camisetas", value: "camisetas" },
    { name: "Polos", value: "polos" },
    { name: "Casacas", value: "casacas" },
    { name: "Pantalón", value: "pantalon" },
    { name: "Shorts", value: "shorts" },
    { name: "Buzos", value: "buzos" },
    { name: "Poleras", value: "poleras" },
    { name: "Gorras", value: "gorras" },
    { name: "Mochilas", value: "mochilas" },
    { name: "Bolsos", value: "bolsos" },
    { name: "Medias", value: "medias" },
  ],
  mujer: [
    { name: "Terrex", value: "terrex" },
    { name: "Urbano", value: "urbano" },
    { name: "Running", value: "running" },
    { name: "Training", value: "training" },
    
    { name: "Chimpunes", value: "chimpunes" },
    { name: "Plataforma", value: "plataforma" },
    { name: "Sandalias", value: "sandalias" },
    { name: "Camisetas", value: "camisetas" },
    { name: "Polos", value: "polos" },
    { name: "Casacas", value: "casacas" },
    { name: "Leggins", value: "leggins" },
    { name: "Tops", value: "tops" },
    { name: "Shorts", value: "shorts" },
    { name: "Falda", value: "falda" },
    { name: "Body", value: "body" },
    { name: "Pantalón", value: "pantalon" },
    { name: "Poleras", value: "poleras" },
    { name: "Buzos", value: "buzos" },
    { name: "Bvd", value: "bvd" },
    { name: "Medias", value: "medias" },
    { name: "Chalecos", value: "chalecos" },
    { name: "Mochilas", value: "mochilas" },
    { name: "Bolsos", value: "bolsos" },
  ],
  niños: [
    { name: "Escolar", value: "running" },
    { name: "Running", value: "running" },
    { name: "Básquet", value: "basquet" },
    
    { name: "Chimpunes", value: "chimpunes" },
    { name: "Plataforma", value: "plataforma" },
    { name: "Sandalias", value: "sandalias" },
    { name: "Camisetas", value: "camisetas" },
    { name: "Polos", value: "polos" },
    { name: "Casacas", value: "casacas" },
    { name: "Pantalón", value: "pantalon" },
    { name: "Shorts", value: "shorts" },
    { name: "Buzos", value: "buzos" },
    { name: "Poleras", value: "poleras" },
    { name: "Gorras", value: "gorras" },
    { name: "Medias", value: "medias" },
    { name: "Mochilas", value: "mochilas" },
  ],
  "fritz gato": [
    { name: "Zapatillas Fritz", value: "zapatillas-fritz", search: "zapatillas%20fritz" },
    { name: "Calzado Deportivo", value: "calzado-deportivo" },
    { name: "Zapatillas Casual", value: "zapatillas-casual" },
    { name: "Sneakers", value: "sneakers" },
    { name: "Tenis", value: "tenis" },
  ],
  chocolateras: [
    { name: "Fritz Gato", value: "peloteras-fritz", search: "zapatillas%20fritz" },
    { name: "Chocolateras", value: "ropa-deportiva" ,search: "peloteras%20fritz" },
    
  ],
};

const navLinks: NavLink[] = [
  { label: "Hombres", href: "/tienda?genero=hombre", hasDropdown: true, gender: "hombre" },
  { label: "Mujeres", href: "/tienda?genero=mujer", hasDropdown: true, gender: "mujer" },
  { label: "Niños", href: "/tienda?genero=niños", hasDropdown: true, gender: "niños" },

  { label: "Chocolateras", href: "/tienda?marca=fritzsport", hasDropdown: true, marca: "chocolateras" },

  { label: "Catálogo", href: "https://www.fritzsportcatalogo.pe", hasDropdown: false, icon: true },
  { label: "Tienda", href: "/tienda", hasDropdown: false },
  { label: "Outlet", href: "/outlet", hasDropdown: false, special: true },
];

const HeaderNavMenu = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { userRole } = useContext(RoleContext);

  // Si el rol es callcenter, solo mostramos Tienda y Tienda Mayorista
  const callCenterLinks: NavLink[] = [
    { label: "Tienda", href: "/tienda", hasDropdown: false },
    { label: "Tienda Mayorista", href: "/tienda-mayorista", hasDropdown: false },
  ];

  const linksToRender: NavLink[] = userRole === "callcenter" ? callCenterLinks : navLinks;

  return (
    <>
      <nav className="w-full overflow-x-auto relative">
        <ul className="flex gap-6 justify-center items-center whitespace-nowrap py-2">
          {linksToRender.map((link) => (
            <li 
              key={link.href}
              className="relative"
              onMouseEnter={() => link.hasDropdown ? setHoveredItem(link.label) : null}
              onMouseLeave={() => link.hasDropdown ? setHoveredItem(null) : null}
            >
              <a
                href={link.href}
                className={`text-gray-700 dark:text-gray-200 font-medium hover:text-blue-600 transition-colors px-2 font-raleway flex items-center gap-1 ${
                  link.label === "Chocolateras" ? "text-red-500 dark:text-red-400" : ""
                } ${
                  link.special ? "bg-gradient-to-r from-red-500 to-red-500 text-white px-3 py-1 rounded-full hover:from-red-600 hover:to-orange-600 shadow-md" : ""
                }`}
              >
                {link.icon && <Tag size={16} />}
                {link.label}
                {link.href.startsWith('http') && <ExternalLink size={14} />}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Dropdown Menu Global - Posicionado debajo del menú principal */}
      {hoveredItem && userRole !== "callcenter" && (
        <div 
          className="fixed inset-0 z-[9999] pointer-events-none"
          onMouseEnter={() => setHoveredItem(null)}
        >
          <div className="pointer-events-auto">
            {linksToRender.map((link) => {
              if (link.hasDropdown && hoveredItem === link.label) {
                return (
                  <div
                    key={link.href}
                    className="absolute top-[140px] left-0 w-full bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700 shadow-lg"
                    onMouseEnter={() => setHoveredItem(link.label)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                      <div className="grid grid-cols-3 gap-6">
                        {categoriesByGender[(link.gender || link.marca) as keyof typeof categoriesByGender]?.map((category) => (
                          <a
                            key={category.value}
                            href={'search' in category && category.search
                              ? `/tienda?search=${category.search}` 
                              : `/tienda?genero=${link.gender || link.marca}&category=${category.value}`
                            }
                            className="text-sm text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 px-2 py-1 rounded transition-colors"
                          >
                            {category.name}
                          </a>
                        ))}
                      </div>
                      <div className="border-t border-gray-200 dark:border-gray-700 mt-3 pt-3">
                        <a
                          href={link.href}
                          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                        >
                          Ver todo {link.label}
                        </a>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default HeaderNavMenu;