import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  const secret = request.headers.get("x-sanity-webhook-secret");

  if (!process.env.SANITY_WEBHOOK_SECRET || secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const body = await request.json() as { _type?: string; slug?: { current?: string } };
    const contentType = body._type;
    const slug = body.slug?.current;

    const tags: string[] = ["content:all"];

    if (contentType === "post") {
      tags.push("content:blog");
      if (slug) tags.push(`content:blog:${slug}`);
    } else if (contentType === "cityPage") {
      if (slug) tags.push(`content:city:${slug}`);
    } else if (contentType === "servicePage") {
      if (slug) tags.push(`content:service:${slug}`);
    }

    for (const tag of tags) {
      revalidateTag(tag);
    }

    logger.info("sanity.publish_revalidation", { contentType, slug, tags });

    return NextResponse.json({ revalidated: true, tags });
  } catch (error) {
    logger.exception("sanity.publish_failed", error);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
