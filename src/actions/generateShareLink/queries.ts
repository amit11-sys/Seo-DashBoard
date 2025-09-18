"use server";

import { getUserFromToken } from "@/app/utils/auth";
import { connectToDB } from "@/lib/db";
import ShareLink from "@/lib/models/ShareLink.model";
import { generateShareToken } from "@/lib/utils/token";



export async function GenerateShareLink(
  // userId: string,
  path: string,
  campaignId: string
) {
  try {
    await connectToDB();

    // Check authentication
    const user = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized please login" };
    }

    // Generate unique token
    const token = generateShareToken(campaignId);
    const userId = user?.id

    // Save to DB
    await ShareLink.create({
      token,
      userId,
      campaignId,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    // Build shareable URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const normalizedPath = path.endsWith("/") ? path : `${path}/`; // ensure slash
    const shareUrl = `${baseUrl}${normalizedPath}${token}`;

    return shareUrl;
  } catch (error) {
    console.error("Error generating share link:", error);
    return { error: "Failed to generate share link" };
  }
}


export async function validateShareToken(token: string) {
  try {
    if (!token) return { valid: false, reason: "Missing token" };

    await connectToDB();

    const share = await ShareLink.findOne({ token });

    if (!share) {
      return { valid: false, reason: "Invalid token" };
    }

    // ✅ if you store expiry date in DB, check it
    if (share.expiresAt && share.expiresAt < new Date()) {
      return { valid: false, reason: "Token expired" };
    }

    return { valid: true, share };
  } catch (error) {
    console.error("Error validating share token:", error);
    return { valid: false, reason: "Server error" };
  }
}

