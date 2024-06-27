"use client"

import { XCircle } from "lucide-react"

import { SanityProduct } from "@/config/inventory"

import Product from "../product/product"
import CarouselProductTabs from "./carousel-product-tabs"

interface Props {
  products: SanityProduct[]
}

export function ProductSliderTab({ products }: Props) {
  if (products.length === 0) {
    return (
      <div className=" grid w-full grid-cols-1">
        <CarouselProductTabs productos={products} />
      </div>
    )
  }

  return (
    <>
      <div className=" grid w-full grid-cols-1">
        <CarouselProductTabs productos={products} />
        {/* {products
        // .filter((el) => el.stock > 0)
        .map((product) => (
          <Product outlet={false} products={product} relacionados={false} />
        ))} */}
      </div>
    </>
  )
}
