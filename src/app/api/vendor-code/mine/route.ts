import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import axios from 'axios';

import { authOptions } from '@/libs/auth';
import sanityClient from '@/libs/sanity';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse('Authentication Required', { status: 401 });

  const { id } = session.user as any;

  try {
    const data = await sanityClient.fetch(
      `*[_type == "user" && _id == $id][0]{
        verificationCodes[]{ _key, code, expiresAt }
      }`,
      { id },
      { cache: 'no-cache' }
    );

    const now = Date.now();
    const all = (data?.verificationCodes || []) as { _key: string; code: string; expiresAt?: string }[];
    const withSortKey = all.map((c) => ({
      ...c,
      expMs: c.expiresAt ? Date.parse(c.expiresAt) : 0,
    }));

    const active = withSortKey
      .filter((c) => c.expMs && now <= c.expMs)
      .sort((a, b) => b.expMs - a.expMs)
      .map(({ _key, code, expiresAt }) => ({ _key, code, expiresAt }));

    const expired = withSortKey
      .filter((c) => !c.expMs || now > c.expMs)
      .sort((a, b) => b.expMs - a.expMs)
      .map(({ _key, code, expiresAt }) => ({ _key, code, expiresAt }));

    // Si hay 4 o más expirados, limpiarlos del documento
    if (expired.length >= 4) {
      const unset = expired.map((e) => `verificationCodes[_key=="${e._key}"]`);
      try {
        await axios.post(
          `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`,
          { mutations: [{ patch: { id, unset } }] },
          { headers: { Authorization: `Bearer ${process.env.SANITY_STUDIO_TOKEN}` } }
        );
      } catch (e) {
        console.error('Failed to unset expired codes', e);
      }
    }

    return NextResponse.json({ active, expired });
  } catch (e) {
    console.error('Unable to fetch codes', e);
    return new NextResponse('Unable to fetch codes', { status: 500 });
  }
}
