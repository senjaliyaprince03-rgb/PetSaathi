// @ts-nocheck
import { metricsHandler } from '../../../../../api/routes/dashboard.mjs';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  
  // Mock express req/res
  const req = {
    query: {
      windowMs: searchParams.get('windowMs')
    }
  };
  
  const res = {
    status: (code) => ({
      json: (data) => NextResponse.json(data, { status: code })
    }),
    json: (data) => NextResponse.json(data)
  };
  
  return metricsHandler(req, res);
}
