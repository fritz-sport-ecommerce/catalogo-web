"use client";

import Column from "./Column/Column";
import "./Footer.css";
import LibroReclamacionesRedes from "./libro-reclamaciones-redes";
const columns = [
  // {
  //   title: "Shop",
  //   links: ["alllinks"],
  // },
  {
    title: "Paginas",
    links: [
      {
        text: "Hombre",
        link: "/tienda?genero=hombre",
      },
      {
        text: "Mujer",
        link: "/tienda?genero=mujer",
      },
      {
        text: "Niños",
        link: "/tienda?genero=niños",
      },
      {
        text: "Carrito",
        link: "/tienda?genero=carrito",
      },
    ],
  },
  // {
  //   title: "Help",
  //   links: [
  //     {
  //       text: "Problemas con mi Pedido",
  //       link: "https://api.whatsapp.com/send/?phone=51983478551&text&type=phone_number&app_absent=0",
  //     },
  //     {
  //       text: "Hacer una Devolución",
  //       link: "https://api.whatsapp.com/send/?phone=51983478551&text&type=phone_number&app_absent=0",
  //     },
  //     {
  //       text: "Talla Incorrecta",
  //       link: "https://api.whatsapp.com/send/?phone=51983478551&text&type=phone_number&app_absent=0",
  //     },
  //   ],
  // },
  {
    title: "Políticas",
    links: [
      {
        text: "Políticas de Privacidad",
        link: "/pyp",
      },
      {
        text: "Contáctanos",
        link: "https://api.whatsapp.com/send/?phone=51983478551&text&type=phone_number&app_absent=0",
      },
      {
        text: "Términos & Condiciones",
        link: "/tyc",
      },
      {
        text: "Trabaja con Nosotros",
        link: "https://wa.me/51908843497/?text=quisiera%20trabajar%20en%20Fritz%20Sport",
        // link: "https://api.whatsapp.com/send/?phone=51908843497&text&type=phone_number&app_absent=0?text=quisiera%20trabajar%20en%20Fritz%20Sport",
      },
    ],
  },
];
const Footer = (props) => {
  const columnsrow = columns?.map((column, i) => {
    return <Column key={i} column={column} />;
  });

  return (
    <>
      <div className="footer ">
        <div className="columns">
          <Column logo />
          {columnsrow}
        </div>
      </div>
      <LibroReclamacionesRedes></LibroReclamacionesRedes>
    </>
  );
};

export default Footer;
