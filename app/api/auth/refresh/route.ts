import { NextResponse } from 'next/server';
import { globalApi } from '../../serverConfig';
import { cookies } from 'next/headers';
import { parse } from 'cookie';

export async function POST() {
  try {
    const cookieStore = await cookies();

    const response = await globalApi.post('/auth/refresh', null, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    const setCookie = response.headers['set-cookie'];

    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

      for (const el of cookieArray) {
        const parsed = parse(el);

        const options = {
          path: '/',
          maxAge: Number(parsed['Max-Age']),
        };

        if (parsed.accessToken) {
          cookieStore.set('accessToken', parsed.accessToken, options);
        }

        if (parsed.refreshToken) {
          cookieStore.set('refreshToken', parsed.refreshToken, options);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 401 });
  }
}
