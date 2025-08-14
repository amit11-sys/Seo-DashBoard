import { NextResponse } from "next/server";
import { getRefreshGoogleAccessToken } from "@/actions/googleConsole"; 

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const campaignId = searchParams.get("campaignId");
  if (!campaignId) return NextResponse.json({ error: "campaignId required" }, { status: 400 });

  try {
    const newToken = await getRefreshGoogleAccessToken(campaignId);
    return NextResponse.json({ accessToken: newToken });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
