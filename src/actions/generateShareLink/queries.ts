"use server";

import { connectToDB } from "@/lib/db";
import ShareLink from "@/lib/models/ShareLink.model";
import { generateShareToken } from "@/lib/utils/token";


export async function GenerateShareLink(userId: string, path: string,campignId:string) {
  await connectToDB();

  const token = generateShareToken(campignId);


  
  await ShareLink.create({
   token,
    userId,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ;
  const shareUrl = `${baseUrl}${path}${token}`;

  return shareUrl;
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

