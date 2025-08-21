import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const campaignId = searchParams.get("campaignId");
  if (!campaignId) {
    return NextResponse.json({ error: "campaignId required" }, { status: 400 });
  }

  const redis = getRedis();

  // Progress
  const total = await redis.llen(`campaign:${campaignId}:keywords`);
  const completed = parseInt((await redis.get(`campaign:${campaignId}:completed`)) || "0", 10);

  const isDone = completed >= total && total > 0;

  return NextResponse.json({
    total,
    completed,
    done: isDone,
  });
}
