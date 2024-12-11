"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { client } from "@/sanity/lib/client";
import CuentasBancarias from "./cuentas-bancarias";
import { urlForImage } from "@/sanity/lib/image";
import UserViewPedidos from "../user-components/user-view-pedidos";
import ModalDesk from "../modal/Modal";

interface Props {
  pedido?: any;
  cuentasBancarias?: any;
}

const UploadPayment = ({ pedido,cuentasBancarias }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [comprobanteExistente, setComprobanteExistente] = useState(pedido?.comprobante_img)

  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      console.log("Archivo seleccionado:", selectedFile);
      setFile(selectedFile);
      const preview = URL.createObjectURL(selectedFile);
      console.log("URL de vista previa:", preview);
      setPreviewUrl(preview);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);
    if(comprobanteExistente){
      setComprobanteExistente(null)
    }
  };

  // Función para manejar la carga o reemplazo de la imagen
  const handleUpload = async () => {
    if (!file) {
      alert("Por favor selecciona un archivo.");
      return;
    }

    setLoading(true);
    setProgress(0);

    try {
      // Consultar si ya existe una imagen asociada al pedido con `id_payer`
      const query = `*[_type == "pedidos" && id_payer == $id_payer]`;
      const params = { id_payer: pedido?.id_payer };
      const pedidos = await client.fetch(query, params);

      if (pedidos.length > 0) {
        const pedidoExistente = pedidos[0];

        // Si ya existe un comprobante, preguntamos si desea reemplazarlo
        const comprobanteImgUrl = pedidoExistente.comprobante_img
          ? pedidoExistente.comprobante_img.asset._ref
          : null;

        if (comprobanteImgUrl) {
          const confirmed = window.confirm(
            "Este pedido ya tiene un comprobante. ¿Deseas reemplazarlo?"
          );
          if (!confirmed) {
            return; // Si el usuario no desea reemplazarlo, salimos
          }
        }

        // Subir la nueva imagen al campo `comprobante_img`
        const formData = new FormData();
        formData.append("file", file);

        const { data } = await axios.post("/api/upload", formData, {
          onUploadProgress: (event) => {
            const percentCompleted = Math.round(
              (event.loaded * 100) / event.total!
            );
            setProgress(percentCompleted);
          },
        });

        // Subir la imagen a Sanity y actualizar el pedido
        const asset = await client.assets.upload("image", file);
        const updatedPedido = await client
          .patch(pedidoExistente._id)
          .set({
            comprobante_img: {
              _type: "image",
              asset: {
                _ref: asset._id,
                _type: "reference",
              },
            },
            estado:"pagado"
          })
          .commit();

        setSuccess(true);
        alert("Comprobante enviado con éxito.");
      
      } else {
        alert("Pedido no encontrado.");
      }
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      alert("Hubo un problema con la subida.");
    } finally {
      setLoading(false);
    }
  };
const [activeViewProduct, setActiveViewProduct] = useState(false)
  return (
    <>
      <h1 className="text-2xl mt-10 xl:text-3xl font-semibold text-gray-800 text-center dark:text-gray-200">
        Sigue estos 3 pasos para confirmar tu pedido 😊.
      </h1>
      <div className="max-w-4xl mx-auto mt-10 bg-white dark:bg-gray-800 xl:p-6 px-2 shadow-md rounded-lg">
        <div className="flex justify-between items-center border-b-[1px] border-white py-5">
          <h3 className="text-xl uppercase xl:text-3xl font-semibold text-green-500 text-center dark:text-green-500">
            Total a pagar: S/{pedido?.cart_total}
          </h3>
          <button className="bg-black py-2 px-3 text-white rounded-md" onClick={()=>setActiveViewProduct(true)}>Ver detalles</button>
          <ModalDesk isOpen={activeViewProduct} onClose={() => setActiveViewProduct(false)}>
              <UserViewPedidos data={pedido}/>
          </ModalDesk>
        </div>
        <div className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <div className="mt-5">
            <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              PASO 1: Copia la cuenta bancaria y realiza tu pago en tu entidad
              bancaria favorita. Luego, toma una captura.
            </div>
            <CuentasBancarias  cuentasBancarias={cuentasBancarias}/>
          </div>

          <div className="pt-5 w-full">
            <div className="text-lg mb-6 font-semibold py-2 text-gray-800 dark:text-gray-200">
              PASO 2: Adjunta tu comprobante de pago.
            </div>
            {/* Adjunta comprobante */}
            <div className="bg-white py-5 rounded-md">
              <p className="text-md font-semibold text-gray-600 xl:mt-5 text-center">
               {comprobanteExistente ? "Elimina tu comprobante si deseas reemplazarlo ": "Sube tu comprobante para confirmar tu pedido."}
              </p>

              {/* Input de archivo */}
              {!file && !comprobanteExistente && (
                <div className="mt-4 flex justify-center w-full h-full items-center">
                  <label
                    htmlFor="fileUpload"
                    className="cursor-pointer border-dashed border-2 border-black py-5 h-[400px] w-[400px] flex justify-center items-center"
                  >
                    <svg
                      width="64px"
                      height="64px"
                      className="stroke-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                      <g id="SVGRepo_iconCarrier">
                        <path
                          d="M8 16L12 12M12 12L16 16M12 12V21M20 16.7428C21.2215 15.734 22 14.2079 22 12.5C22 9.46243 19.5376 7 16.5 7C16.2815 7 16.0771 6.886 15.9661 6.69774C14.6621 4.48484 12.2544 3 9.5 3C5.35786 3 2 6.35786 2 10.5C2 12.5661 2.83545 14.4371 4.18695 15.7935"
                          stroke="#000000"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </g>
                    </svg>

                    <input
                      id="fileUpload"
                      type="file"
                      accept=".jpg,.png"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              )}

              {/* Vista previa y botón para eliminar */}
              {comprobanteExistente && comprobanteExistente?.asset?._ref && (
                <div className="mt-4 flex flex-col items-center">
                  <img
                    src={urlForImage(comprobanteExistente?.asset?._ref).url()}
                    alt="Vista previa"
                    className="xl:w-[500px] h-[500px] w-full rounded-lg shadow"
                  />
                  <button
                    onClick={removeFile}
                    className="mt-2 px-4 py-2 bg-red-500 text-white font-medium rounded hover:bg-red-600"
                  >
                    Borrar comprobante
                  </button>
                </div>
              )}
              {previewUrl && (
                <div className="mt-4 flex flex-col items-center">
                  <img
                    src={previewUrl ? previewUrl : urlForImage(comprobanteExistente?.asset?._ref).url()}
                    alt="Vista previa"
                    className="xl:w-[500px] h-[500px] w-full rounded-lg shadow"
                  />
                  <button
                    onClick={removeFile}
                    className="mt-2 px-4 py-2 bg-red-500 text-white font-medium rounded hover:bg-red-600"
                  >
                    Borrar comprobante
                  </button>
                </div>
              )}

              {loading && (
                <div className="relative mt-4 w-full h-4 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
                  <div
                    className="absolute top-0 left-0 h-full bg-blue-500 transition-all"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-6">
            <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              PASO 3: Envía tu comprobante y nos comunicaremos contigo para
              enviar tu pedido.
            </div>
            <div className="mt-1 flex justify-center">
              <button

                className={`mt-6 px-6 py-2 uppercase ${!file || comprobanteExistente || loading ? "bg-red-500":"bg-green-500"}  text-white font-semibold rounded-md hover:bg-red-800 disabled:opacity-30`}
                onClick={handleUpload}
                disabled={!file || comprobanteExistente || loading ? true:false}
              >
                {loading ? "Subiendo..." : "Enviar Comprobante"}
              </button>

     
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadPayment;