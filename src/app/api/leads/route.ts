import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { data } = await req.json();

    const cmsUrl = process.env.CMS_URL || "http://localhost:1337";
    const cmsApi = process.env.CMS_API;

    if (!cmsApi) {
      return NextResponse.json(
        { error: "CMS API key is not configured." },
        { status: 500 }
      );
    }

    const response = await fetch(`${cmsUrl}/api/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cmsApi}`,
      },
      body: JSON.stringify({ data }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Strapi error:", response.status, errorText);
      return NextResponse.json(
        { error: "Failed to submit lead to CMS." },
        { status: response.status }
      );
    }

    const responseData = await response.json();
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error in lead submission proxy:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}
