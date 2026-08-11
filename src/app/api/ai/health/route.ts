// @ts-nocheck
import { healthHandler } from '../../../../../api/routes/dashboard.mjs';
import { NextResponse } from 'next/server';

export async function GET(request) {
  // Mock express res interface
  const res = {
    status: (code) => ({
      json: (data) => NextResponse.json(data, { status: code })
    }),
    json: (data) => NextResponse.json(data)
  };
  
  return healthHandler(request, res);
}
