import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';
import sanityClient from '@/libs/sanity';

// SSE endpoint to stream verificationCodes changes for the authenticated user
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response('Authentication Required', { status: 401 });
  }

  // Only allow the authenticated user to subscribe to their own changes
  const userId = (session.user as any)?.id as string | undefined;
  if (!userId) {
    return new Response('Invalid session', { status: 400 });
  }

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  // Utility to send SSE messages
  const send = async (event: string, data: any) => {
    const payload = typeof data === 'string' ? data : JSON.stringify(data);
    const message = `event: ${event}\n` + `data: ${payload}\n\n`;
    await writer.write(new TextEncoder().encode(message));
  };

  // Send a comment to keep the connection alive in some proxies
  const pingInterval = setInterval(async () => {
    try {
      await writer.write(new TextEncoder().encode(`: ping\n\n`));
    } catch {
      // ignore
    }
  }, 15000);

  // Start listening to Sanity for this user's verificationCodes changes
  const listenClient = sanityClient.withConfig({ useCdn: false });
  const subscription = listenClient
    .listen(
      `*[_type == "user" && _id == $id][0]{ verificationCodes[]{ code, expiresAt } }`,
      { id: userId },
      { visibility: 'query' }
    )
    .subscribe({
      next: async (msg: any) => {
        console.log('[SSE] listen event for user', userId);
        // For visibility: 'query', msg.result has the current projection
        const result = msg?.result || {};
        const codes = Array.isArray(result?.verificationCodes)
          ? result.verificationCodes
          : [];
        try { console.log('[SSE] codes length', codes.length); } catch {}
        await send('codes', { active: codes });
      },
      error: async (err: any) => {
        try { console.error('[SSE] listen error', err); } catch {}
        await send('error', { message: 'listen_failed', detail: String(err) });
        try { await writer.close(); } catch {}
      },
      complete: async () => {
        try { console.log('[SSE] listen complete for user', userId); } catch {}
        try { await writer.close(); } catch {}
      },
    });

  // Initial hello
  await send('ready', { ok: true });
  try { console.log('[SSE] stream opened for user', userId); } catch {}

  // Close handling when client disconnects
  const close = async () => {
    try { subscription.unsubscribe(); } catch {}
    clearInterval(pingInterval);
    try { await writer.close(); } catch {}
  };

  // next/server doesn't expose request.closed directly; rely on GC when stream closes
  // Return the SSE response
  return new Response(readable, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      // Allow the browser to connect from same origin
      'X-Accel-Buffering': 'no',
    },
  });
}
