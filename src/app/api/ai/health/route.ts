import { healthHandler } from '@/api/routes/dashboard';
import { NextResponse } from 'next/server';

type JsonResponder = {
  status: (code: number) => { json: (data: unknown) => Response };
  json: (data: unknown) => Response;
};

export async function GET(request: Request) {
  // Mock express res interface
  const res: JsonResponder = {
    status: (code: number) => ({
      json: (data: unknown) => NextResponse.json(data, { status: code })
    }),
    json: (data: unknown) => NextResponse.json(data)
  };
  
  return healthHandler(request, res) as Promise<Response>;
}
