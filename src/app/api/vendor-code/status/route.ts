import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';
import sanityClient from '@/libs/sanity';

// GET /api/vendor-code/status?code=XXXX
// Devuelve: { status: 'pending' | 'verified' | 'expired', expiresAt?: string }
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse('Authentication Required', { status: 401 });

  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  if (!code) return new NextResponse('code is required', { status: 400 });

  try {
    // Buscar globalmente: (1) existencia del código activo y (2) un evento de verificación reciente
    const doc = await sanityClient.fetch(
      `{
        "codeDoc": *[_type == "user" && defined(verificationCodes[code == $code][0])][0]{
          verificationCodes[code == $code][0]{ expiresAt }
        },
        "eventDoc": *[_type == "user" && lastVerificationEvent.code == $code][0]{
          lastVerificationEvent{ verifiedAt }
        }
      }`,
      { code },
      { cache: 'no-cache' }
    );

    const item = doc?.codeDoc?.verificationCodes as undefined | { expiresAt?: string };
    const evt = doc?.eventDoc?.lastVerificationEvent as undefined | { verifiedAt?: string };
    const now = Date.now();

    // Si hay evento reciente, considerar verificado (mitiga retrasos de consistencia)
    if (evt?.verifiedAt) {
      const t = Date.parse(evt.verifiedAt);
      if (t && now - t < 15 * 60 * 1000) {
        return NextResponse.json({ status: 'verified' });
      }
    }

    if (item?.expiresAt) {
      const expMs = Date.parse(item.expiresAt);
      if (!expMs || now > expMs) {
        return NextResponse.json({ status: 'expired', expiresAt: item.expiresAt });
      }
      return NextResponse.json({ status: 'pending', expiresAt: item.expiresAt });
    }

    // No existe en ningún usuario ni evento válido -> asumir verificado (uso único)
    return NextResponse.json({ status: 'verified' });
  } catch (e) {
    return new NextResponse('Unable to check status', { status: 500 });
  }
}
