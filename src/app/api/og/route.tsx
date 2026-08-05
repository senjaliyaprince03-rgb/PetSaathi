import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const title = searchParams.get("title") || "PetSaathi";
    const subtitle = searchParams.get("subtitle") || "Trusted Pet Care in Your Neighborhood";
    const rating = searchParams.get("rating");

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff",
            backgroundImage: "linear-gradient(to bottom right, #f0fdfa, #fff)",
            fontFamily: "sans-serif",
            padding: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "4px solid #14b8a6",
              borderRadius: "24px",
              padding: "60px",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              width: "100%",
              height: "100%",
            }}
          >
            <div
              style={{
                fontSize: 80,
                fontStyle: "normal",
                fontWeight: "bold",
                color: "#111827",
                marginBottom: 20,
                textAlign: "center",
                lineHeight: 1.2,
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 40,
                fontStyle: "normal",
                color: "#4b5563",
                textAlign: "center",
                marginBottom: rating ? 40 : 0,
              }}
            >
              {subtitle}
            </div>
            {rating && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 36,
                  color: "#d97706",
                  backgroundColor: "#fef3c7",
                  padding: "10px 20px",
                  borderRadius: "9999px",
                  fontWeight: "bold",
                }}
              >
                ★ {rating} / 5.0 Rating
              </div>
            )}
            
            <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: "10px" }}>
               <div style={{ fontSize: 32, fontWeight: "bold", color: "#0d9488" }}>PetSaathi</div>
               <div style={{ fontSize: 24, color: "#6b7280" }}>• petsaathi.com</div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch {
    return new Response("Failed to generate the image", {
      status: 500,
    });
  }
}
