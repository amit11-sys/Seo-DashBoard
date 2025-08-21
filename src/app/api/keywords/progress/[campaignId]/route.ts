// /api/keywords/progress/[campaignId]/route.ts
import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

export async function GET(
  req: Request,
  { params }: { params: { campaignId: string } }
) {
  const redis = getRedis();
  const progressKey = `campaign:${params.campaignId}:progress`;

  const progress = await redis.hgetall(progressKey);

  const total = Number(progress.total || 0);
  const processed = Number(progress.processed || 0);
  const done = processed >= total && total > 0;

  return NextResponse.json({
    total,
    processed,
    done,
    lastUpdated: Number(progress.lastUpdated || 0),
  });
}
