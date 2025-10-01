"use client";
import React from 'react';
import type { VerifyResult } from './actions';
import { verifyVendorAction } from './actions';
import { CheckCircle2, UserCircle2 } from 'lucide-react';

export default function VerifyForm() {
  const [code, setCode] = React.useState('');
  const [expiresAt, setExpiresAt] = React.useState<string | null>(null);
  const [vendor, setVendor] = React.useState<any | null>(null);
  const [remaining, setRemaining] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const isValid = /^[A-Z0-9]{8}$/.test(code);

  React.useEffect(() => {
    if (!expiresAt) return;
    const end = Date.parse(expiresAt);
    const tick = () => setRemaining(Math.max(0, end - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setVendor(null);
    setExpiresAt(null);
    if (!isValid) {
      setError('Código inválido. Debe tener 8 caracteres A-Z y 0-9.');
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.set('code', code);
      const result = await verifyVendorAction(null as any, formData);
      if (result.ok) {
        setVendor(result.vendor);
        setExpiresAt(result.expiresAt);
      } else {
        setError(result.error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  const isExpired = expiresAt ? Date.now() > Date.parse(expiresAt) : false;

  return (
    <div>
      <form onSubmit={onSubmit} className="flex gap-2 mb-2">
      <input
  name="code"
  value={code}
  onChange={(e) => setCode(e.target.value.toUpperCase())}
  placeholder="Ingresa el código (8 caracteres)"
  className="flex-1 dark:text-black rounded-md border border-gray-300 bg-white px-4 py-3 text-lg tracking-[0.3em]
             placeholder:text-sm placeholder:tracking-normal placeholder:text-gray-400 
             focus:outline-none focus:ring-2 focus:ring-black focus:border-black
             dark:bg-zinc-900 dark:border-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-white"
  maxLength={8}
  pattern="[A-Z0-9]{8}"
  title="8 caracteres alfanuméricos en mayúsculas"
  required
/>

        <button
          type="submit"
          disabled={!isValid || submitting}
          className="rounded-md bg-black px-5 py-3 text-white disabled:opacity-50"
        >
          {submitting ? 'Verificando...' : 'Verificar'}
        </button>
      </form>

      <div className="mb-4 text-xs text-gray-500 dark:text-zinc-400">
        Formato válido: 8 caracteres A-Z y 0-9. El código es de un solo uso y expira en 5 minutos.
      </div>

      {error && (
        <div className="text-red-600 text-sm mb-4">{error}</div>
      )}

{vendor && (
  <div className="border rounded-xl p-6 shadow-sm dark:border-zinc-700 text-center">
    
    {/* Foto en el centro */}
    <div className="flex justify-center">
      {vendor.image ? (
        <img
          src={vendor.image}
          alt={vendor.name || "vendedor"}
          className="w-24 h-24 rounded-full object-cover border"
        />
      ) : (
        <UserCircle2 className="w-24 h-24 text-gray-400" />
      )}
    </div>

    {/* Nombre y verificación */}
    <div className="mt-3 flex items-center justify-center gap-2">
      <span className="text-lg font-semibold">
        {vendor.name} {vendor.apellidos}
      </span>
      <CheckCircle2 className="w-5 h-5 text-green-500" />
    </div>
    <div className="text-sm text-gray-600 dark:text-white">
      Rol: {vendor.role}
    </div>

    {/* Datos del vendedor */}
    <div className="mt-5 text-left">
      <div className="overflow-hidden rounded-md border dark:border-zinc-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px text-sm">
          {/* <InfoItem label="RAZON SOCIAL" value={vendor.razonSocial} /> */}
          <InfoItem label="SEDE" value={vendor.sede} />
          <InfoItem
            label="APELLIDOS Y NOMBRES"
            value={[vendor.apellidos, vendor.name].filter(Boolean).join(" ")}
            colSpan
          />
          {/* <InfoItem label="N° DNI" value={vendor.documento} /> */}
          {/* <InfoItem
            label="FECHA DE NACIMIENTO"
            value={
              vendor.fechaNacimiento
                ? new Date(vendor.fechaNacimiento).toLocaleDateString()
                : "-"
            }
          /> */}
          {/* <InfoItem label="N° CELULAR" value={vendor.telefono} /> */}
          <InfoItem
            label="FECHA DE INGRESO"
            value={
              vendor.fechaIngreso
                ? new Date(vendor.fechaIngreso).toLocaleDateString()
                : "-"
            }
          />
          <InfoItem label="ÁREA" value={vendor.area} />
          <InfoItem label="CARGO" value={vendor.cargo} />
        </div>
      </div>
    </div>

    {/* Contador */}
    {expiresAt && (
      <div className="mt-4 text-sm">
        {isExpired ? (
          <span className="text-red-600">El código ha expirado.</span>
        ) : (
          <span className="text-gray-700 dark:text-zinc-400">
            Tiempo restante: {minutes.toString().padStart(2, "0")}:
            {seconds.toString().padStart(2, "0")}
          </span>
        )}
      </div>
    )}
  </div>
)}

    </div>
  );
}
// Componente auxiliar para celdas
function InfoItem({
  label,
  value,
  colSpan,
}: {
  label: string;
  value?: string;
  colSpan?: boolean;
}) {
  return (
    <div className={`p-3 ${colSpan ? "md:col-span-2" : ""}`}>
      <span className="font-semibold text-gray-800 dark:text-white">
        {label}
      </span>
      <div className="mt-1 text-gray-700 dark:text-blue-500">
        {value || "-"}
      </div>
    </div>
  );
}