import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export async function GET(req: any, context: any) {
  if (context?.params && typeof context.params.then === "function") {
    context.params = await context.params;
  }
  return handler(req, context);
}

export async function POST(req: any, context: any) {
  if (context?.params && typeof context.params.then === "function") {
    context.params = await context.params;
  }
  return handler(req, context);
}
