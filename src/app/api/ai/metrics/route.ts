import { metricsHandler } from '@/api/routes/dashboard';
import { NextResponse } from 'next/server';

type JsonResponder = {
  status: (code: number) => { json: (data: unknown) => Response };
  json: (data: unknown) => Response;
};

export async function GET(request: Request & { nextUrl: URL }) {
  const searchParams = request.nextUrl.searchParams;
  
  // Mock express req/res
  const req = {
    query: {
      windowMs: searchParams.get('windowMs') ?? undefined
    }
  };
  
  const res: JsonResponder = {
    status: (code: number) => ({
      json: (data: unknown) => NextResponse.json(data, { status: code })
    }),
    json: (data: unknown) => NextResponse.json(data)
  };
  
  return metricsHandler(req, res) as Promise<Response>;
}
