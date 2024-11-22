import React, { useEffect, useState } from 'react'

interface  Props {
  tallas : [],
  sku:string
}

export default function CantidadProduct({tallas,sku}:Props) {
  const [cantidadP, setCantidadP] = useState(0)
//cantidad de stock en productos
useEffect(() => {
  let quantity = 0;
  tallas?.forEach((el: { stock: number; }) => {
  // console.log(el.stock);
  quantity = quantity + el.stock ++
});
setCantidadP(quantity)
}, [sku])
  return (
    <div>
      {
        cantidadP != 0 && (

          <div className='text-xs xl:text-sm mt-1 text-red-300'>         { cantidadP <= 20 && `Solo ${cantidadP ===1 ? "queda" : "quedan" } ${cantidadP} ${cantidadP ===1 ? "unidad" : "unidades" } `  }  </div>
        )
      }
      </div>
  )
}
