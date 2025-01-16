import React from 'react'

export default function UserViewPedidos({data}:any) {
  console.log(data);
  
  return (
    <div className=" tailwind w-full p-5 gap-1 ">


        <div className='sticky z-50 top-0 right-0 border-[1px] dark:border-white border-black py-2 flex justify-center bg-white text-black'>
          <span className='text-lg uppercase font-bold'>Total:</span> <span className='text-xl uppercase font-bold ml-1 '>S/{data.cart_total}</span>
        </div>
      <div className='grid xl:grid-cols-2 grid-cols-1  justify-center'>
          {data?.productos?.map((producto:any, i:number) => (
            <div
              key={i}
              className="flex  items-center w-full p-2  border-b-[1px] border-blue-gray-300"
            >
              <div>
                <img src={producto.picture_url} width={56} alt="" />
              </div>
              <div className="text-sm">
                <div className="ml-10 ">
                  <div>{producto.name}</div>
                </div>
                {/* <div className="ml-10">
                  <div>{producto.sku}</div>
                </div> */}
                <div className="ml-10">
                  <div>
                    {" "}
                    <span className="font-bold">Talla</span> :
                    {producto.talla}
                  </div>
                </div>
                <div className="ml-10">
                  <div>
                    {" "}
                    <span className="font-bold">Cantidad</span> : x
                    {producto.cantidad}
                  </div>
                </div>
                <div className="ml-10">
                  <div>
                    {" "}
                    <span className="font-bold">Precio</span> :
                    S/{producto.unit_price}
                  </div>
                </div>

            
              </div>
            </div>
          ))}

      </div>
  </div>
  )
}
