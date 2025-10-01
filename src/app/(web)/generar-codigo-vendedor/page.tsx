"use client";
import React from 'react';
import { useToast } from '@/components/ui/use-toast';

type CodeItem = { code: string; expiresAt: string };

export default function GenerarCodigoVendedorPage() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [code, setCode] = React.useState<string | null>(null);
  const [expiresAt, setExpiresAt] = React.useState<string | null>(null);
  const [remaining, setRemaining] = React.useState<number>(0);
  // Listas completas para lógica
  const [activeCodesAll, setActiveCodesAll] = React.useState<CodeItem[]>([]);
  const [expiredCodesAll, setExpiredCodesAll] = React.useState<CodeItem[]>([]);
  // Derivadas para UI (limitadas)
  const activeCodes = React.useMemo(() => activeCodesAll.slice(0, 5), [activeCodesAll]);
  const expiredCodes = React.useMemo(() => expiredCodesAll.slice(0, 5), [expiredCodesAll]);
  const [tick, setTick] = React.useState(0); // mantiene actualizados los contadores de la lista
  const [tab, setTab] = React.useState<'activos' | 'expirados'>('activos');
  const [verifiedNotice, setVerifiedNotice] = React.useState(false);
  // Flag para evitar alerta prematura: asegurar que el código generado haya aparecido al menos una vez en activos
  const [seenCurrentCodeActive, setSeenCurrentCodeActive] = React.useState(false);
  // Mantener una sola instancia del intervalo del contador principal
  const timerRef = React.useRef<number | null>(null);
  // Marca de tiempo de generación para permitir alerta tras pequeña gracia aunque no se haya visto activo
  const [generatedAt, setGeneratedAt] = React.useState<number | null>(null);
  const { toast } = useToast();

  const startTimer = React.useCallback((iso: string) => {
    const end = Date.parse(iso);
    // Limpiar intervalo previo si existe
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    // Setear valor inicial inmediato
    setRemaining(Math.max(0, end - Date.now()));
    const id = window.setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, end - now);
      setRemaining(diff);
      if (diff <= 0 && timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }, 1000);
    timerRef.current = id;
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setCode(null);
    setExpiresAt(null);
    setVerifiedNotice(false);
    setSeenCurrentCodeActive(false);
    setGeneratedAt(null);
    try {
      const res = await fetch('http://localhost:3000/api/vendor-code', { method: 'POST' });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Error al generar código');
      }
      const data = await res.json();
      setCode(data.code);
      setExpiresAt(data.expiresAt);
      startTimer(data.expiresAt);
      setGeneratedAt(Date.now());
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
      // Guardar listas completas para la lógica de verificación
      setActiveCodesAll(data.active || []);
      setExpiredCodesAll(data.expired || []);
    } catch {}
  }, []);

  React.useEffect(() => {
    fetchCodes();
  }, [fetchCodes]);

  // Detectar verificación: si el código actual desaparece de activos antes de expirar
  React.useEffect(() => {
    if (!code || !expiresAt || verifiedNotice) return;
    const stillActive = activeCodesAll.some((c) => c.code === code);
    // Marcar que el código se observó activo al menos una vez
    if (stillActive && !seenCurrentCodeActive) {
      setSeenCurrentCodeActive(true);
      return;
    }
    const notExpired = Date.now() < Date.parse(expiresAt);
    // Solo alertar si ya lo vimos activo y luego desapareció antes de expirar
    const graceWindowPassed = generatedAt ? (Date.now() - generatedAt) > 3000 : false;
    if ((seenCurrentCodeActive || graceWindowPassed) && !stillActive && notExpired) {
      setVerifiedNotice(true);
      // Toast informativo
      toast({
        title: 'Código verificado',
        description: 'El cliente verificó tu código.',
      });
    }
  }, [activeCodesAll, code, expiresAt, verifiedNotice, seenCurrentCodeActive, generatedAt]);

  // Polling periódico de códigos mientras el actual esté vigente y no verificado
  React.useEffect(() => {
    if (!code || !expiresAt || verifiedNotice) return;
    const endMs = Date.parse(expiresAt);
    if (Number.isNaN(endMs)) return;
    const id = setInterval(() => {
      const now = Date.now();
      if (now >= endMs) {
        clearInterval(id);
        return;
      }
      fetchCodes();
    }, 2000);
    return () => clearInterval(id);
  }, [code, expiresAt, verifiedNotice, fetchCodes]);

  // SSE en tiempo real desde /api/vendor-code/events para reflejar cambios inmediatos
  React.useEffect(() => {
    if (!code || !expiresAt || verifiedNotice) return;
    let es: EventSource | null = null;
    try {
      es = new EventSource('http://localhost:3000/api/vendor-code/events');
      es.addEventListener('ready', () => {
        try { console.log('[SSE] connected'); } catch {}
      });
      es.addEventListener('codes', (e: MessageEvent) => {
        try {
          const payload = JSON.parse(e.data || '{}');
          if (Array.isArray(payload.active)) {
            setActiveCodesAll(payload.active as any);
          }
        } catch {}
      });
      es.addEventListener('error', (e: MessageEvent) => {
        try { console.error('[SSE] error event', e); } catch {}
      });
      es.onerror = (err) => {
        try { console.error('[SSE] onerror', err); } catch {}
      };
    } catch {}
    return () => {
      try { es?.close(); } catch {}
    };
  }, [code, expiresAt, verifiedNotice]);

  // Rerender every second para actualizar contadores de la lista (no afecta el timer principal)
  React.useEffect(() => {
    const id = setInterval(() => setTick((v) => v + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Limpiar intervalo principal en unmount
  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  return (
    <div className="container mx-auto max-w-xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Generar código de verificación</h1>
      <p className="text-sm text-gray-600 mb-4">
        Solo roles: Call Center, Mayorista o Emprendedor. El código será válido por 5 minutos.
      </p>
      {verifiedNotice && (
        <div className="mb-4 rounded border border-green-200 bg-green-50 text-green-800 px-4 py-2 text-sm">
          El cliente verificó tu código.
        </div>
      )}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50 dark:border-white border-[1px]"
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
            className={`px-3 py-2 text-sm ${tab === 'activos' ? 'border-b-2 border-black dark:border-white font-semibold' : 'text-gray-600'}`}
            onClick={() => setTab('activos')}
          >
            Activos
          </button>
          <button
            className={`px-3 py-2 text-sm ${tab === 'expirados' ? 'border-b-2 border-black dark:border-white font-semibold' : 'text-gray-600'}`}
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
