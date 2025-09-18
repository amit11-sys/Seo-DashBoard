import { NextRequest, NextResponse } from "next/server";
import { keywordQueue } from "@/lib/queue/queue";
import { getRedis } from "@/lib/redis";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      campaignId,
      keywords,
      location_code,
      language_code,
      device,
      se_domain,
      target,
      userId,
    } = body;

    if (!campaignId || !Array.isArray(keywords) || keywords.length === 0) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    const redis = getRedis();
    const progressKey = `campaign:${campaignId}:progress`;

    await redis.hset(progressKey, {
      total: String(keywords.length),
      processed: "0",
      lastUpdated: String(Date.now()),
    });

    await redis.expire(progressKey, 60 * 60); // 1h

    for (const keyword of keywords) {
      await keywordQueue.add(
        "fetchKeywordRanking",
        {
          campaignId,
          userId: userId ?? null,
          keyword,
          location_code,
          language_code,
          device,
          se_domain,
          target,
        },
        {
          attempts: 3,
          backoff: { type: "exponential", delay: 3000 },
          removeOnComplete: true,
          removeOnFail: false,
        }
      );
    }

    return NextResponse.json({ ok: true, enqueued: keywords.length });
  } catch (e) {
    console.error("enqueue error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
