import { urlForImage } from '@/sanity/lib/image';
import React from 'react'

export default function DescargarPdf({catalogo}) {
    const getUrlFromId = (pdf) => {
        // Example ref: file-207fd9951e759130053d37cf0a558ffe84ddd1c9-mp3
        // We don't need the first part, unless we're using the same function for files and images
        const [_file, id, extension] = pdf.split('-');
        return `https://cdn.sanity.io/files/ibvmpbc1/production/${id}.${extension}`
      }
      
  
    
  
  return (
    <div className="xl:grid xl:grid-cols-3 2xl:grid-cols-4">
        {
            catalogo.map(el=>(
                <section className=" px-5 py-5 border-[1px] dark:border-blue-gray-500 border-blue-gray-600 rounded-xl">

                    <div className='text-center xl:text-lg uppercase'>
                    {el.titulo}
                    </div>
                <div className="flex justify-between py-2 uppercase text-xs">
                    <div>                    {el.mes}
                    </div>

                    <div>{el.marca}</div>
                </div>
                <img className="" src={urlForImage(el?.imgdw?.asset._ref).url()} alt="" />

                <div className="w-full flex justify-center py-3">
                    <a href={getUrlFromId(el.asset._ref)} target="_blank">

                        <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Descargar</button>
                    </a>
                </div>
                </section>

            ))
        }



     </div>
  )
}
