"use client"
import React from 'react'

export default function ImagePage({product}:any) {
  return (
    <img
          src={product.imgcatalogomain.asset.url}
          alt={`Imagen de ${product.sku}`}
         
        />
  )
}
