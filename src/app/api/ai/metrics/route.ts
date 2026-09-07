import { NextResponse } from 'next/server';
import { metricsHandler } from '@/api/routes/dashboard';
import { getCurrentIdentity, hasAnyRole } from '@/modules/auth/session';

type JsonResponder = {
  status: (code: number) => { json: (data: unknown) => Response };
  json: (data: unknown) => Response;
};

const adminRoles = ["SUPER_ADMIN", "OPERATIONS_ADMIN"] as const;

export async function GET(request: Request & { nextUrl: URL }) {
  const identity = await getCurrentIdentity();
  if (!identity) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasAnyRole(identity, adminRoles)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

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
