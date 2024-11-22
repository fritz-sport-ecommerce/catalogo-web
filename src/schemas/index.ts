import account from "./account";
// import booking from "./booking";
import { catalogo } from "./catalogo-schema";
import { descuentos } from "./descuentos";
import { emprende } from "./emprende-schema";
import { home } from "./home-schema";
import { homefz } from "./home-schema-fz";
// import hotelRoom from "./hotelRoom";
import { nuestras_tiendas } from "./nuestras-tiendas-schema";
import { pedidos } from "./pedidos";
import { product } from "./product-schema";
import review from "./review";
import user from "./user";
import verificationToken from "./verificationToken";
// import { test } from "./test";
import { descuento_registro } from "./descuento-registro";

export const schemaTypes = [
  user,
  home,
  homefz,
  product,
  nuestras_tiendas,
  emprende,
  descuentos,
  descuento_registro,
  pedidos,
  catalogo,
  account,
  // test,
  // booking,
  // hotelRoom,
  // review,
  verificationToken,
];
