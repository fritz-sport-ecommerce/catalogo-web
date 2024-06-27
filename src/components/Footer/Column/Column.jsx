import React, { useState } from "react";

import "./Column.css";
import Link from "next/link";

import { Logo } from "@/components/logo/logo";

const Column = (props) => {
  const icons = [
    "https://cdn.visa.com/v2/assets/images/logos/visa/blue/logo.png",
    "https://mtf.mastercard.co.za/content/dam/public/mastercardcom/mea/za/logos/mc-logo-52.svg",
    // "https://i.imgur.com/SCFSSVs.png",
    // "https://i.imgur.com/kuSZEpB.png",
  ];
  const { column, logo } = props;
  const [activecol, setActivecol] = useState(false);

  return (
    <div className="column">
      {logo ? (
        <>
          <Logo />
          <div>
            <h4>Aceptamos Pagos</h4>
            <div>
              {icons?.map((icon, i) => {
                return (
                  <img
                    key={i}
                    src={icon}
                    className={i == 1 && "200px"}
                    alt=""
                  />
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <>
          <h3
            className={activecol && "activecoltitle"}
            onClick={() => setActivecol(!activecol)}
          >
            <span>{column.title}</span>
            <i className={"fal fa-chevron-right"}></i>
          </h3>
          <div className={activecol ? "activecol col" : "col"}>
            {column.links.map((link, i) => {
              return (
                <Link key={i} href={`${link.link}`}>
                  {link.text}
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
export default Column;
