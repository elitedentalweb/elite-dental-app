import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parse } from 'cookie';
import { globalApi } from '../../serverConfig';

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const result = await globalApi.post('/auth/login', body);

    const cookieStore = await cookies();
    const setCookie = result.headers['set-cookie'];

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

    return NextResponse.json(result.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      error?.response?.data || { message: 'Login failed' },
      { status: error?.response?.status || 500 }
    );
  }
};
