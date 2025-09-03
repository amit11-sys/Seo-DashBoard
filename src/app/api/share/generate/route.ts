import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import ShareLink from "@/lib/models/ShareLink.model";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("share_token");

  if (!token) {
    return NextResponse.json({ valid: false, error: "No token" }, { status: 400 });
  }

  await connectToDB();

  const link = await ShareLink.findOne({ token });

  if (!link || (link.expiresAt && new Date() > link.expiresAt)) {
    return NextResponse.json({ valid: false, error: "Token expired" }, { status: 401 });
  }

  return NextResponse.json({ valid: true, userId: link.userId });
}
