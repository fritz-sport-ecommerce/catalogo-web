"use client"
import { Card, Typography } from "@material-tailwind/react";


 
 
export default function GiaDeTallasRopa({GiaDeTallasRopa}) {
  return (
    <Card className="laptop:h-[100vh] xl:h-[100vh] w-full overflow-y-scroll 2xl:p-8 py-3 px-3" >
      <div className="text-3xl text-black font-extrabold text-center uppercase mb-5">{GiaDeTallasRopa.title}</div>
      <table className="w-full min-w-max table-auto text-left h-full">
        <thead>
          <tr className="sticky top-0 mb-10">
            {GiaDeTallasRopa.TABLE_HEAD.map((head) => (
              <th key={head} className="border-b border-blue-gray-100 bg-black p-4">
                <Typography
         
            
                  className="font-extrabold text-white uppercase 2xl:text-base text-sm leading-none opacity-70 text-center"

                >
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody >
          {GiaDeTallasRopa.TABLE_ROWS.map(({TITLE,ADIDAS, REEBOK,NIKE, CAT,FILA}, index) => (
            <tr key={index} className="even:bg-blue-gray-50/50">
            <td className="">
              <Typography variant="small" color="blue-gray" className="font-normal hover:bg-blue-gray-100 2xl:px-5 2xl:py-5 flex justify-center 2xl:text-base text-sm h-full text-center">
                  {TITLE}
                </Typography>
              </td>
              <td className="">

               <Typography variant="small" color="blue-gray" className="font-normal hover:bg-blue-gray-100 2xl:px-5 2xl:py-5 flex justify-center 2xl:text-base text-sm h-full text-center">
                  {ADIDAS}
                </Typography>
              </td>
              <td className="">

              <Typography variant="small" color="blue-gray" className="font-normal hover:bg-blue-gray-100 2xl:px-5 2xl:py-5 flex justify-center 2xl:text-base text-sm h-full text-center">
                {REEBOK}

                </Typography>
              </td>
              <td className="">

             <Typography variant="small" color="blue-gray" className="font-normal hover:bg-blue-gray-100 2xl:px-5 2xl:py-5 flex justify-center 2xl:text-base text-sm h-full text-center">
                {NIKE}

                </Typography>
              </td>
              <td className="">

              <Typography variant="small" color="blue-gray" className="font-normal hover:bg-blue-gray-100 2xl:px-5 2xl:py-5 flex justify-center 2xl:text-base text-sm h-full text-center">
                {CAT}

                </Typography>
              </td>
              {
                FILA && (
              <td className="">

             <Typography variant="small" color="blue-gray" className="font-normal hover:bg-blue-gray-100 2xl:px-5 2xl:py-5 flex justify-center 2xl:text-base text-sm h-full text-center">
                {FILA}

                </Typography>
              </td>

                )
              }
          
     
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}