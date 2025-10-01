import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import axios from 'axios';

import { authOptions } from '@/libs/auth';
import sanityClient from '@/libs/sanity';

function generateCode(length = 8) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

// POST /api/vendor-code -> genera y guarda un código temporal para el usuario autenticado (roles permitidos)
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse('Authentication Required', { status: 401 });

  const { id, role } = session.user as any;
  const allowed = ['callcenter', 'mayorista', 'emprendedor'];
  if (!allowed.includes(role)) {
    return new NextResponse('Forbidden: role not allowed', { status: 403 });
  }

  const code = generateCode(8);
  const expiresAt = new Date(Date.now() + 1 * 60 * 1000).toISOString();

  try {
    // 1) Leer códigos actuales para limpiar expirados
    const current = await sanityClient.fetch<{ verificationCodes?: { _key: string; code: string; expiresAt?: string }[] }>(
      `*[_type == "user" && _id == $id][0]{ verificationCodes[]{ _key, code, expiresAt } }`,
      { id },
      { cache: 'no-cache' }
    );

    const now = Date.now();
    const toUnset: string[] = [];
    for (const item of current?.verificationCodes || []) {
      const exp = item.expiresAt ? Date.parse(item.expiresAt) : 0;
      if (!exp || now > exp) {
        toUnset.push(`verificationCodes[_key=="${item._key}"]`);
      }
    }

    // 2) Construir mutación: limpiar expirados y agregar nuevo código
    const mutation = {
      mutations: [
        {
          patch: {
            id,
            setIfMissing: { verificationCodes: [] },
            ...(toUnset.length > 0 ? { unset: toUnset } : {}),
            insert: {
              after: 'verificationCodes[-1]',
              items: [
                {
                  _type: 'vendorVerification',
                  code,
                  expiresAt,
                },
              ],
            },
          },
        },
      ],
    } as const;

    const { data } = await axios.post(
      `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`,
      mutation,
      { headers: { Authorization: `Bearer ${process.env.SANITY_STUDIO_TOKEN}` } }
    );

    if (!data?.results) throw new Error('Mutation failed');

    return NextResponse.json({ code, expiresAt }, { status: 200 });
  } catch (err) {
    console.error('Error creating vendor code', err);
    return new NextResponse('Unable to create code', { status: 500 });
  }
}

// GET /api/vendor-code?code=XXXX -> valida y devuelve datos del vendedor si no expiró (uso único)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  if (!code) return new NextResponse('code is required', { status: 400 });

  try {
    const user = await sanityClient.fetch(
      `*[_type == "user" && defined(verificationCodes[code == $code][0])][0]{
        _id,
        name,
        apellidos,
        email,
        telefono,
        role,
        razonSocial,
        sede,
        image,
        documento,
        fechaNacimiento,
        fechaIngreso,
        area,
        cargo,
        "verificationExpiresAt": verificationCodes[code == $code][0].expiresAt,
        "verificationKey": verificationCodes[code == $code][0]._key
      }`,
      { code },
      { cache: 'no-cache' }
    );

    if (!user) return new NextResponse('Invalid code', { status: 404 });

    const now = Date.now();
    const expires = user?.verificationExpiresAt ? Date.parse(user.verificationExpiresAt) : 0;
    if (!expires || now > expires) {
      return new NextResponse('Code expired', { status: 410 });
    }

    // Uso único: eliminar el código del arreglo tras validarlo
    if (user?.verificationKey) {
      try {
        const unsetMutation = {
          mutations: [
            {
              patch: {
                id: user._id,
                unset: [`verificationCodes[_key=="${user.verificationKey}"]`],
              },
            },
          ],
        } as const;
        await axios.post(
          `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`,
          unsetMutation,
          { headers: { Authorization: `Bearer ${process.env.SANITY_STUDIO_TOKEN}` } }
        );
      } catch (e) {
        // No bloquear la respuesta al cliente si el unset falla
        console.error('Failed to unset used code', e);
      }
    }

    return NextResponse.json({
      vendor: {
        id: user._id,
        name: user.name,
        apellidos: user.apellidos,
        email: user.email,
        telefono: user.telefono,
        role: user.role,
        razonSocial: user.razonSocial,
        sede: user.sede,
        image: user.image,
        documento: user.documento,
        fechaNacimiento: user.fechaNacimiento,
        fechaIngreso: user.fechaIngreso,
        area: user.area,
        cargo: user.cargo,
      },
      expiresAt: user.verificationExpiresAt,
    });
  } catch (err) {
    console.error('Error validating vendor code', err);
    return new NextResponse('Unable to validate code', { status: 500 });
  }
}
