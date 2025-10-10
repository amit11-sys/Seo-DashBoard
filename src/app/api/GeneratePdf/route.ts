
// app/generate-pdf/route.ts (App Router)
import { NextRequest, NextResponse } from "next/server";
// import { generatePDFWithTailwind } from "@/lib/GeneratePdf";

export async function POST(req: NextRequest) {
  const { html } = await req.json();

  if (!html) {
    return NextResponse.json({ error: "Missing HTML content" }, { status: 400 });
  }


}

