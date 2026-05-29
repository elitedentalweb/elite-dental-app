import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { globalApi } from '../../serverConfig';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const cookieStore = await cookies();

    const response = await globalApi.get(`/objects/${id}`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(response.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      error?.response?.data || { message: 'Failed to fetch object' },
      { status: error?.response?.status || 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const cookieStore = await cookies();
    const body = await req.json();
    const response = await globalApi.patch(`/objects/${id}`, body, {
      headers: { Cookie: cookieStore.toString() },
    });
    return NextResponse.json(response.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      error?.response?.data || { message: 'Failed to update object' },
      { status: error?.response?.status || 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const cookieStore = await cookies();
    const response = await globalApi.delete(`/objects/${id}`, {
      headers: { Cookie: cookieStore.toString() },
    });
    return NextResponse.json(response.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      error?.response?.data || { message: 'Failed to delete object' },
      { status: error?.response?.status || 500 }
    );
  }
}
