"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

const tiendas = {
  "fritz-sport-grau": {
    establecimiento: "Fritz Sport tienda Miguel Grau",
    ruc: "20602090117",
    direccion: "Fritz Sport, Av. Miguel Grau 231, Lima 15001",
    email: "legal@fritzsportsac.com",
  },
  "fz-premium-los-olivos": {
    establecimiento: "Fz Premium Los Olivos",
    ruc: "20602090117",
    direccion: "Av. Alfredo Mendiola 3589, Los Olivos 15301",
    email: "legal@fritzsportsac.com",
  },
  "fz-premium-grau": {
    establecimiento: "Fz Premium Miguel Grau",
    ruc: "20602090117",
    direccion: "Av. Miguel Grau 249, Lima 15001",
    email: "legal@fritzsportsac.com",
  },
  "fritz-mayorista": {
    establecimiento: "Fritz Sport Mayorista",
    ruc: "20602090117",
    direccion: "Av. Iquitos 946, La Victoria 15003, Lima 15001",
    email: "legal@fritzsportsac.com",
  },
  "fritz-sport-los-olivos": {
    establecimiento: "Fritz Sport tienda Los Olivos",
    ruc: "20602090117",
    direccion: "Fritz Sport, Av. Miguel Grau 231, Lima 15001",
    email: "legal@fritzsportsac.com",
  },
  "fritz-sport-tumbes": {
    establecimiento: "Fritz Sport Tumbes",
    ruc: "20602090117",
    direccion: "Fritz Sport, Av. República del Perú 373, Villa de Aguas Verdes 24101",
    email: "legal@fritzsportsac.com",
  },
  "fritz-sport-huanuco": {
    establecimiento: "Fritz Sport Huanuco",
    ruc: "20613803905",
    direccion: "jr, Jirón Dámaso Beraún 1028, Huánuco 10000",
    email: "legal@fritzsportsac.com",
  },
};

type FormData = {
  nombre: string;
  documentoTipo: string;
  documentoNumero: string;
  direccion: string;
  email: string;
  telefono: string;
  establecimiento: string;
  ruc: string;
  direccionEstablecimiento: string;
  emailEstablecimiento: string;
  fechaIncidente: string;
  descripcion: string;
  expectativa: string;
  acepto: boolean;
  fechaRecepcion: string;
};

export default function LibroReclamacionesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    documentoTipo: "",
    documentoNumero: "",
    direccion: "",
    email: "",
    telefono: "",
    establecimiento: "",
    ruc: "",
    direccionEstablecimiento: "",
    emailEstablecimiento: "",
    fechaIncidente: "",
    descripcion: "",
    expectativa: "",
    acepto: false,
    fechaRecepcion: "",
  });
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const sedeParam = (searchParams?.get("sede") ?? "") as keyof typeof tiendas | "";
    if (!sedeParam) {
      router.replace("/");
      return;
    }
    const today = new Date().toISOString().split("T")[0];
    const tienda = tiendas[sedeParam];

    setFormData((prev) => ({
      ...prev,
      fechaRecepcion: today,
      establecimiento: tienda?.establecimiento || "",
      ruc: tienda?.ruc || "",
      direccionEstablecimiento: tienda?.direccion || "",
      emailEstablecimiento: tienda?.email || "",
    }));
  }, [searchParams, router]);

  // Ocultar alerta automáticamente después de 2 segundos
  useEffect(() => {
    if (alert) {
      const timeout = setTimeout(() => setAlert(null), 2000);
      return () => clearTimeout(timeout);
    }
  }, [alert]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    let fieldValue: string | boolean = value;
    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      fieldValue = e.target.checked;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const camposObligatorios: (keyof FormData)[] = [
      "nombre",
      "documentoTipo",
      "documentoNumero",
      "email",
      "fechaIncidente",
      "descripcion",
    ];

    for (const campo of camposObligatorios) {
      if (!formData[campo]) {
        setAlert({ type: 'error', message: 'Por favor, completa todos los campos obligatorios antes de enviar.' });
        return;
      }
    }

    if (!formData.acepto) {
      setAlert({ type: 'error', message: 'Debes aceptar la declaración antes de enviar.' });
      return;
    }

    // Enviar datos al endpoint API
    try {
      const response = await fetch("/api/libro-reclamaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        setAlert({ type: 'error', message: errorData.error || 'Error al enviar el reclamo' });
        return;
      }
      const blob = await response.blob();
      // Descargar PDF automáticamente
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reclamo-${formData.nombre}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setAlert({ type: 'success', message: 'Reclamación enviada correctamente. Se ha descargado el PDF.' });
      // Resetear solo los campos de Datos del Consumidor y Detalle del Reclamo
      setFormData({
        ...formData,
        nombre: "",
        documentoTipo: "",
        documentoNumero: "",
        direccion: "",
        email: "",
        telefono: "",
        fechaIncidente: "",
        descripcion: "",
        expectativa: "",
        acepto: false,
        // establecimiento, ruc, direccionEstablecimiento, emailEstablecimiento, fechaRecepcion se mantienen
      });
    } catch (err) {
      setAlert({ type: 'error', message: 'Hubo un error al enviar el reclamo. Intenta nuevamente.' });
    }
  };

  const inputClass = "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400";
  const readOnlyClass = inputClass + " bg-gray-100 dark:bg-gray-700 cursor-not-allowed text-gray-600 dark:text-gray-300";
  const textareaClass = "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400";
  const labelClass = "text-sm font-medium text-gray-700 dark:text-gray-300";

  // Validación de formulario
  const isFormValid = () => {
    const camposObligatorios: (keyof FormData)[] = [
      "nombre",
      "documentoTipo",
      "documentoNumero",
      "email",
      "fechaIncidente",
      "descripcion",
    ];
    for (const campo of camposObligatorios) {
      if (!formData[campo]) return false;
    }
    if (!formData.acepto) return false;
    return true;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">

      <h1 className="text-4xl font-bold text-center text-red-600 dark:text-red-400 mb-8">
        Libro de Reclamaciones Virtual
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datos del Consumidor */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-300 dark:border-gray-600 p-6 rounded-lg bg-white dark:bg-gray-900">
          <h2 className="md:col-span-2 text-xl font-semibold text-gray-800 dark:text-gray-200">Datos del Consumidor</h2>

          <div>
            <label className={labelClass}>Nombre completo:</label>
            <input name="nombre" required onChange={handleChange} className={inputClass} value={formData.nombre} />
          </div>
          <div>
            <label className={labelClass}>Tipo de documento:</label>
            <select name="documentoTipo" required onChange={handleChange} className={inputClass} value={formData.documentoTipo}>
              <option value="">Selecciona...</option>
              <option value="DNI">DNI</option>
              <option value="Carnet de extranjería">Carnet de extranjería</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Número de documento:</label>
            <input name="documentoNumero" required onChange={handleChange} className={inputClass} value={formData.documentoNumero} />
          </div>
          <div>
            <label className={labelClass}>Dirección:</label>
            <input name="direccion" onChange={handleChange} className={inputClass} value={formData.direccion} />
          </div>
          <div>
            <label className={labelClass}>Correo electrónico:</label>
            <input name="email" type="email" required onChange={handleChange} className={inputClass} value={formData.email} />
          </div>
          <div>
            <label className={labelClass}>Teléfono:</label>
            <input name="telefono" onChange={handleChange} className={inputClass} value={formData.telefono} />
          </div>
        </section>

        {/* Datos del Establecimiento */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-300 dark:border-gray-600 p-6 rounded-lg bg-white dark:bg-gray-900">
          <h2 className="md:col-span-2 text-xl font-semibold text-gray-800 dark:text-gray-200">Datos del Establecimiento</h2>

          <div>
            <label className={labelClass}>Nombre del establecimiento:</label>
            <input name="establecimiento" value={formData.establecimiento} readOnly className={readOnlyClass} />
          </div>
          <div>
            <label className={labelClass}>RUC:</label>
            <input name="ruc" value={formData.ruc} readOnly className={readOnlyClass} />
          </div>
          <div>
            <label className={labelClass}>Dirección:</label>
            <input name="direccionEstablecimiento" value={formData.direccionEstablecimiento} readOnly className={readOnlyClass} />
          </div>
          <div>
            <label className={labelClass}>Correo electrónico:</label>
            <input name="emailEstablecimiento" value={formData.emailEstablecimiento} readOnly className={readOnlyClass} />
          </div>
        </section>

        {/* Detalle del Reclamo */}
        <section className="space-y-4 border border-gray-300 dark:border-gray-600 p-6 rounded-lg bg-white dark:bg-gray-900">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Detalle del Reclamo</h2>

          <div>
            <label className={labelClass}>Fecha del incidente:</label>
            <input type="date" name="fechaIncidente" required onChange={handleChange} className={inputClass} value={formData.fechaIncidente} />
          </div>
          <div>
            <label className={labelClass}>Descripción del reclamo:</label>
            <textarea name="descripcion" required onChange={handleChange} className={textareaClass} rows={4} value={formData.descripcion}></textarea>
          </div>
          <div>
            <label className={labelClass}>Solución esperada:</label>
            <textarea name="expectativa" onChange={handleChange} className={textareaClass} rows={3} value={formData.expectativa}></textarea>
          </div>
        </section>

        {/* Fecha Recepción */}
        <section className="border border-gray-300 dark:border-gray-600 p-6 rounded-lg space-y-4 bg-white dark:bg-gray-900">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Fecha de Recepción del Reclamo</h2>
          <input name="fechaRecepcion" type="date" value={formData.fechaRecepcion} readOnly className={readOnlyClass} />
        </section>
      {/* Alerta personalizada */}
      {alert && (
        <div
          className={`mb-6 px-4 py-3 rounded-md text-white font-semibold shadow-lg transition-all
            ${alert.type === 'success' ? 'bg-green-600' : 'bg-red-500'}
          `}
        >
          {alert.message}
          <button
            className="ml-4 text-white font-bold float-right text-lg leading-none focus:outline-none"
            onClick={() => setAlert(null)}
            aria-label="Cerrar alerta"
          >
            ×
          </button>
        </div>
      )}
        {/* Declaración jurada */}
        <section className="border border-gray-300 dark:border-gray-600 p-6 rounded-lg space-y-4 bg-white dark:bg-gray-900">
          <label className="flex items-start gap-3">
            <input type="checkbox" name="acepto" checked={formData.acepto} onChange={handleChange} className="mt-1 w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
            <span className="text-gray-700 dark:text-gray-300">
              Declaro bajo juramento que la información proporcionada es verídica y correcta.
            </span>
          </label>
        </section>

        {/* Botón enviar */}
        <div className="text-center">
          <button
            type="submit"
            disabled={!isFormValid()}
            className={`px-6 py-3 rounded transition font-semibold text-white
              ${isFormValid() ? "bg-green-600 hover:bg-green-700" : "bg-red-400 cursor-not-allowed opacity-60"}
            `}
          >
            Enviar Reclamación
          </button>
        </div>

        {/* Nota legal */}
        <p className="text-sm text-gray-600 dark:text-gray-400 italic text-justify mt-8 border-t border-gray-300 dark:border-gray-600 pt-4">
          <strong>Nota importante:</strong> De acuerdo con la Ley N° 29571 (Ley de Protección y Defensa del Consumidor) y su reglamento, este Libro de Reclamaciones Virtual debe ser proporcionado en todo establecimiento que ofrezca bienes o servicios, y debe garantizar que el consumidor pueda expresar su reclamo de manera clara y recibir una respuesta en un plazo razonable.
        </p>
      </form>
    </div>
  );
}