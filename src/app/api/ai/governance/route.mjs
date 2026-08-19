import { governanceHandler } from '@/api/routes/dashboard';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  
  const req = {
    query: {
      userId: searchParams.get('userId')
    }
  };
  
  const res = {
    status: (code) => ({
      json: (data) => NextResponse.json(data, { status: code })
    }),
    json: (data) => NextResponse.json(data)
  };
  
  return governanceHandler(req, res);
}
