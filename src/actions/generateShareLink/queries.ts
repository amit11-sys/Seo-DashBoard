"use server";

import { connectToDB } from "@/lib/db";
import ShareLink from "@/lib/models/ShareLink.model";
import { generateToken } from "@/lib/utils/token";


export async function GenerateShareLink(userId: string, path: string = "/dashboard") {
  await connectToDB();

  const token = generateToken();

  
  await ShareLink.create({
    token,
    userId,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const shareUrl = `${baseUrl}${path}?share_token=${token}`;

  return shareUrl;
}
