import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

export async function GET(
  req: Request,
  { params }: { params: { campaignId: string } }
) {
  const redis = getRedis();
  const progressKey = `campaign:${params.campaignId}:progress`;

  const progress = await redis.hgetall(progressKey);

  if (!progress || !progress.total) {
    return NextResponse.json({ total: 0, processed: 0 });
  }

  return NextResponse.json({
    total: Number(progress.total || 0),
    processed: Number(progress.processed || 0),
    lastUpdated: Number(progress.lastUpdated || 0),
  });
}
