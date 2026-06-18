import { NextRequest, NextResponse } from 'next/server';
import { globalApi } from '../../serverConfig';

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const result = await globalApi.post('/auth/forgot-password', body);
    return NextResponse.json(result.data);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      error?.response?.data || { message: 'Forgot password failed' },
      { status: error?.response?.status || 500 }
    );
  }
};
