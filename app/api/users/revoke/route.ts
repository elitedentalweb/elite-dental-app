import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { globalApi } from '../../serverConfig';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const body = await req.json();
    const response = await globalApi.post('/users/revoke', body, {
      headers: { Cookie: cookieStore.toString() },
    });
    return NextResponse.json(response.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      error?.response?.data || { message: 'Failed to revoke user' },
      { status: error?.response?.status || 500 }
    );
  }
}
