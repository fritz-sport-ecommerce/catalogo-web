// MainPdfAuto.js
"use client";
import PDF from "./Pdf_new";
import { pdf } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import Loader from "@/components/loader/loader";
export default function MainPdfAuto({ catalogo, cliente = false, productos }) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [pdfUrl, setPdfUrl] = useState(null);
  
  useEffect(() => {
    const generatePdf = async () => {
      try {
        if (!catalogo || !catalogo.catalogo) {
          throw new Error("El catálogo es inválido o está vacío.");
        }
        
        const doc = <PDF catalogo={catalogo.catalogo} items={productos} cliente={cliente} />;
        const blob = await pdf(doc).toBlob({ compress: true });
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (error) {
        console.error("Error al generar el PDF:", error);
      } finally {
        setIsGenerating(false);
      }
    };
    
    if (productos.length > 0) {
      generatePdf();
    }
  }, [catalogo, cliente, productos]);

  return (
    <>
  
      {isGenerating && <Loader/>}
      {pdfUrl && (
        <iframe
          src={pdfUrl}
          className="w-full h-screen border"
        />
      )}

    </>
  );
}