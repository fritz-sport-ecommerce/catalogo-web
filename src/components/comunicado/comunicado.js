"use client"

import React from "react"
import Link from "next/link"
import { urlForImage } from "@/sanity/lib/image"
import { Dialog } from "@material-tailwind/react"

export function DialogSizes({ promoHome }) {
  const [size, setSize] = React.useState("xl")

  const handleOpen = (value) => setSize(value)

  return (
    <>
      {promoHome.promo.activebuttontitle && (
        <Dialog
          className=" flex justify-center rounded-none border-transparent bg-transparent"
          open={
            size === "xs" ||
            size === "sm" ||
            size === "md" ||
            size === "lg" ||
            size === "xl" ||
            size === "xxl"
          }
          size={"sm"}
          handler={handleOpen}
        >
          {/* <DialogHeader>Comunicado</DialogHeader> */}
          <Link href={promoHome.promo.urlslider}>
            <img
              src={urlForImage(promoHome.promo.imgdeskt.asset._ref).url()}
              alt={promoHome.desc}
            />
          </Link>
          {/* <DialogBody className=""></DialogBody> */}
        </Dialog>
      )}
    </>
  )
}
