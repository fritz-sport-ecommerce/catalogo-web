import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useCart } from "react-use-cart";

import { precioProduct } from "@/config/precio-product";
import { useToast } from "@/components/ui/use-toast";
import GiaDeTallasMain from "@/components/guia-tallas/GiaDeTallasMain";

import { Button } from "./ui/button";
import ModalDesk from "./modal/Modal";
import LoveFollow from "./love-follow/love-follow";

export default function ProductAddToCart({ product, descuentos }) {
  const { toast } = useToast();
  const [selectSize, setSelectSize] = useState({
    talla: "",
    stock: 0,
    _key: "",
  });
  const [activeAddProduct, setActiveAddProduct] = useState(true);

  const { addItem, items } = useCart();

  //add to cart
  const addToCart = () => {
    const item = {
      ...product,
      product_data: {
        size: selectSize,
      },
    };

    addItem({
      id: product.id,
      name: product.name,
      idsanity: product.id,
      img: product.image,
      title: product.name,
      image: product.images[0].asset?._ref,
      objectID: product.sku,
      price: precioProduct(
        product.descuento,
        product.priceecommerce,
        product.preciomanual,
        descuentos
      ),
      priceecommerce:product.priceecommerce,
      pricemayorista:product.pricemayorista,
      priceemprendedor:product.priceemprendedor,

      talla: String(`${selectSize.tallascatalogo}`),
      slug: product.slug,
    });
    toast({
      title: `${item.name} (${selectSize.talla})`,
      description: "Producto Agregado al Carrito",
      action: (
        <Link href={"/carrito"}>
          <Button variant={"link"} className="gap-x-5 whitespace-nowrap">
            <span>Abrir Carrito</span>
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
      ),
    });
    setActiveAddProduct(true);
  };

  const selectTalla = (talla, _key, stock) => {
    setActiveAddProduct(false);
    setSelectSize({ talla, _key, stock });
  };

  const [cliente, setCliente] = useState(false);
  useEffect(() => {
    setCliente(true);
  }, []);

  return (
    <div>
      <p>
        Tallas: <strong>{product?.tallascatalogo || ""}</strong>
      </p>
      {/* <div className="mt-4">
        {cliente &&
          product.tallas.map(({ talla, stock, _key }) => (
            <Button
              onClick={() => selectTalla(talla, _key, stock)}
              key={_key}
              disabled={
                stock <= 0 ||
                stock === undefined ||
                stock === null ||
                items.find(
                  (itemsCarrito) =>
                    itemsCarrito.id === _key &&
                    itemsCarrito.quantity >= stock &&
                    itemsCarrito.objectID === product.sku
                )
              }
              variant={
                selectSize.talla === talla && !activeAddProduct
                  ? "default"
                  : "outline"
              }
              className={`${
                stock <= 0 ||
                (items.find(
                  (itemsCarrito) =>
                    itemsCarrito.id === _key &&
                    itemsCarrito.quantity >= stock &&
                    itemsCarrito.objectID === product.sku
                ) &&
                  "line-through")
              } mr-2 mt-4 `}
            >
              {talla}
            </Button>
          ))}
      </div> */}

      {product.tipo == "calzado" && (
        <ModalDesk>
          <GiaDeTallasMain
            gender={product.genero}
            product_type={product.tipo}
          />
        </ModalDesk>
      )}
 <form
        className=" flex items-center mt-4 "
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="w-full">
  
            <Button
              // disabled={activeAddProduct}
              onClick={addToCart}
              type="button"
              className=" w-full rounded-none uppercase bg-black py-6 text-base font-medium focus:outline-none focus:ring-2 dark:bg-white "
            >
              { "Agregar Al Carrito"}
            </Button>
       
        </div>
        {/* <LoveFollow view={false} product={product} /> */}
      </form>
      <form
        className=" flex items-center mt-4 "
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="w-full">
          <Link
            href={
              "https://api.whatsapp.com/send/?phone=51983478551&text&type=phone_number&app_absent=0"
            }
            target="_blank"
          >
            <Button
              type="button"
              className=" w-full rounded-none uppercase bg-black py-6 text-base font-medium focus:outline-none focus:ring-2 dark:bg-white "
            >
              contactar a un asessor
            </Button>
          </Link>
        </div>
        {/* <LoveFollow view={false} product={product} /> */}
      </form>
    </div>
  );
}
