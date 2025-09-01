// /api/keywords/progress/[campaignId]/route.ts
import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { connectToDB } from "@/lib/db";
import Campaign from "@/lib/models/campaign.model";

export async function GET(
  req: Request,
  { params }: { params: { campaignId: string } }
) {
  const redis = getRedis();
  const progressKey = `campaign:${params.campaignId}:progress`;

  const progress = await redis.hgetall(progressKey);

    if (Object.keys(progress).length > 0) {
    const total = Number(progress.total || 0);
    const processed = Number(progress.processed || 0);
    const done = processed >= total && total > 0;
    return NextResponse.json({
    total,
    processed,
    done,
    source: "redis",
    lastUpdated: Number(progress.lastUpdated || Date.now()),
  });
  }

 await connectToDB();
const mongoProgress = await Campaign.findById(params.campaignId);

  if (!mongoProgress) {
    return NextResponse.json({ total: 0, processed: 0, done: false });
  }

  return NextResponse.json({
    total: mongoProgress.total,
    processed: mongoProgress.processed,
    done: mongoProgress.done,
    lastUpdated: mongoProgress.lastUpdated?.getTime() || null,
    source: "mongo",
  });
}
