import { NextResponse } from "next/server";
import { createContentEntry, publishContent } from "@/modules/content/cms.service";
import type { ServiceCode } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const userId = req.headers.get("x-user-id");
    // Ensure admin role check here in real code
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { slug, type, title, primaryJob, authorId, contentBody, excerpt, city, serviceCode } = body;

    if (!slug || !type || !title || !primaryJob || !authorId || !contentBody) {
      return NextResponse.json({ error: "bad_request", message: "Missing required fields" }, { status: 400 });
    }

    const entry = await createContentEntry({
      slug,
      type,
      title,
      primaryJob,
      authorId,
      body: contentBody,
      excerpt,
      city,
      serviceCode: serviceCode as ServiceCode | undefined
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error: any) {
    if (error.code === "slug_exists" || error.code === "author_not_found") {
      return NextResponse.json({ error: error.code, message: error.message }, { status: 400 });
    }
    console.error("Error in POST content API:", error);
    return NextResponse.json(
      { error: "internal_error", message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const action = searchParams.get("action");

    if (!id || action !== "publish") {
      return NextResponse.json({ error: "bad_request", message: "Invalid parameters" }, { status: 400 });
    }

    const entry = await publishContent(id, userId);
    return NextResponse.json({ entry }, { status: 200 });
  } catch (error: any) {
    if (error.code === "entry_not_found") {
      return NextResponse.json({ error: "not_found", message: error.message }, { status: 404 });
    }
    console.error("Error in PATCH content API:", error);
    return NextResponse.json(
      { error: "internal_error", message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
