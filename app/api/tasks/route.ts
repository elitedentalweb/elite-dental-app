import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { globalApi } from '../serverConfig';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const { searchParams } = new URL(req.url);
    const objectId = searchParams.get('objectId');
    const url = objectId ? `/tasks?objectId=${objectId}` : '/tasks';
    const response = await globalApi.get(url, {
      headers: { Cookie: cookieStore.toString() },
    });
    return NextResponse.json(response.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      error?.response?.data || { message: 'Failed to fetch tasks' },
      { status: error?.response?.status || 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const body = await req.json();
    const response = await globalApi.post('/tasks', body, {
      headers: { Cookie: cookieStore.toString() },
    });
    return NextResponse.json(response.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      error?.response?.data || { message: 'Failed to create task' },
      { status: error?.response?.status || 500 }
    );
  }
}
