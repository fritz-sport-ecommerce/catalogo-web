"use client";
import React from 'react';

type CodeItem = { code: string; expiresAt: string };

export default function GenerarCodigoVendedorPage() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [code, setCode] = React.useState<string | null>(null);
  const [expiresAt, setExpiresAt] = React.useState<string | null>(null);
  const [remaining, setRemaining] = React.useState<number>(0);
  const [activeCodes, setActiveCodes] = React.useState<CodeItem[]>([]);
  const [expiredCodes, setExpiredCodes] = React.useState<CodeItem[]>([]);
  const [tick, setTick] = React.useState(0);
  const [tab, setTab] = React.useState<'activos' | 'expirados'>('activos');

  const startTimer = React.useCallback((iso: string) => {
    const end = Date.parse(iso);
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, end - now);
      setRemaining(diff);
      if (diff <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setCode(null);
    setExpiresAt(null);
    try {
      const res = await fetch('/api/vendor-code', { method: 'POST' });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Error al generar código');
      }
      const data = await res.json();
      setCode(data.code);
      setExpiresAt(data.expiresAt);
      startTimer(data.expiresAt);
      await fetchCodes();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCodes = React.useCallback(async () => {
    try {
      const res = await fetch('/api/vendor-code/mine');
      if (!res.ok) return;
      const data = await res.json();
      setActiveCodes((data.active || []).slice(0, 5));
      setExpiredCodes((data.expired || []).slice(0, 5));
    } catch {}
  }, []);

  React.useEffect(() => {
    fetchCodes();
  }, [fetchCodes]);

  // Rerender every second to update countdowns for list
  React.useEffect(() => {
    const id = setInterval(() => setTick((v) => v + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  return (
    <div className="container mx-auto max-w-xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Generar código de verificación</h1>
      <p className="text-sm text-gray-600 mb-4">
        Solo roles: Call Center, Mayorista o Emprendedor. El código será válido por 1 minuto.
      </p>
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Generando...' : 'Generar código'}
      </button>

      {error && (
        <div className="mt-4 text-red-600 text-sm">{error}</div>
      )}

      {code && (
        <div className="mt-6 p-4 border rounded">
          <div className="text-sm text-gray-500">Tu código</div>
          <div className="text-3xl font-bold tracking-widest">{code}</div>
          {expiresAt && (
            <div className="mt-2 text-sm text-gray-600">
              Expira: {new Date(expiresAt).toLocaleString()}
            </div>
          )}
          <div className="mt-2 text-sm">Tiempo restante: {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</div>
          <p className="mt-2 text-sm text-gray-600">Comparte este código con quien necesite verificar tu información.</p>
        </div>
      )}

      {/* Lista tabs */}
      <div className="mt-8">
        <div className="flex gap-2 border-b mb-4">
          <button
            className={`px-3 py-2 text-sm ${tab === 'activos' ? 'border-b-2 border-black font-semibold' : 'text-gray-600'}`}
            onClick={() => setTab('activos')}
          >
            Activos
          </button>
          <button
            className={`px-3 py-2 text-sm ${tab === 'expirados' ? 'border-b-2 border-black font-semibold' : 'text-gray-600'}`}
            onClick={() => setTab('expirados')}
          >
            Expirados
          </button>
        </div>

        {tab === 'activos' ? (
          activeCodes.length === 0 ? (
            <div className="text-sm text-gray-500">No tienes códigos activos.</div>
          ) : (
            <div className="space-y-2">
              {activeCodes.map((c) => {
                const remain = c.expiresAt ? Math.max(0, Date.parse(c.expiresAt) - Date.now()) : 0;
                const m = Math.floor(remain / 60000);
                const s = Math.floor((remain % 60000) / 1000);
                return (
                  <div key={c.code} className="p-3 border rounded flex items-center justify-between">
                    <div>
                      <div className="text-base font-mono tracking-widest">{c.code}</div>
                      <div className="text-xs text-gray-600">Expira: {new Date(c.expiresAt).toLocaleString()}</div>
                    </div>
                    <div className="text-sm text-gray-800">
                      {m.toString().padStart(2, '0')}:{s.toString().padStart(2, '0')}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          expiredCodes.length === 0 ? (
            <div className="text-sm text-gray-500">No hay códigos expirados.</div>
          ) : (
            <div className="space-y-2">
              {expiredCodes.map((c) => (
                <div key={c.code} className="p-3 border rounded flex items-center justify-between">
                  <div>
                    <div className="text-base font-mono tracking-widest">{c.code}</div>
                    <div className="text-xs text-gray-600">Expiró: {new Date(c.expiresAt).toLocaleString()}</div>
                  </div>
                  <div className="text-sm text-red-600">Expirado</div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
