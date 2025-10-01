
export type VerifyResult =
  | { ok: true; vendor: any; expiresAt: string }
  | { ok: false; error: string };

export async function verifyVendorAction(_: any, formData: FormData): Promise<VerifyResult> {
  const code = String(formData.get('code') || '').toUpperCase().trim();

  // Validación server-side (evita requests innecesarias)
  if (!/^[A-Z0-9]{8}$/.test(code)) {
    return { ok: false, error: 'Código inválido. Debe tener 8 caracteres A-Z y 0-9.' };
  }

  try {
    const res = await fetch(`/api/vendor-code?code=${encodeURIComponent(code)}`, {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: text || 'Código inválido o expirado' };
    }

    const data = await res.json();
    return { ok: true, vendor: data.vendor, expiresAt: data.expiresAt };
  } catch (e: any) {
    return { ok: false, error: 'No se pudo verificar el código' };
  }
}
