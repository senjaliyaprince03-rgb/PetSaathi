import { NextResponse } from "next/server";
import { getCityPages, createCityPage } from "@/modules/content/citypage.service";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ cityId: string }> }
) {
  try {
    const pages = await getCityPages((await params).cityId);
    return NextResponse.json({ pages }, { status: 200 });
  } catch (error: any) {
    console.error("Error in GET city pages API:", error);
    return NextResponse.json(
      { error: "internal_error", message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ cityId: string }> }
) {
  try {
    const userId = req.headers.get("x-user-id");
    // Ensure admin role check here in real code
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { contentEntryId, pageType } = body;

    if (!contentEntryId || !pageType) {
      return NextResponse.json({ error: "bad_request", message: "Missing required fields" }, { status: 400 });
    }

    const cityPage = await createCityPage(
      (await params).cityId,
      contentEntryId,
      pageType
    );

    return NextResponse.json({ cityPage }, { status: 201 });
  } catch (error: any) {
    if (error.code === "city_not_found" || error.code === "entry_not_found") {
      return NextResponse.json({ error: "not_found", message: error.message }, { status: 404 });
    }
    console.error("Error in POST city page API:", error);
    return NextResponse.json(
      { error: "internal_error", message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
