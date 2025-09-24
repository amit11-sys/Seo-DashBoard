

import Campaign from "@/lib/models/campaign.model";

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;
let refreshing: any= null;

export async function getSharedToken(campaignId: string) {
  const now = Date.now();

  // If a refresh is in progress, wait for it
  if (refreshing) return refreshing;

  // Return cached token if valid
  if (cachedToken && tokenExpiry && now < tokenExpiry) {
    const campaign = await Campaign.findById({ _id: campaignId });
    return { accessToken: cachedToken, campaign };
  }

  // Otherwise, refresh
  refreshing = (async () => {
    const campaign = await Campaign.findById({ _id: campaignId });
    if (!campaign) throw new Error("Campaign not found");

    // Use DB token if still valid
    if (campaign.googleAccessToken && campaign.googleAccessTokenExpiry && now < campaign.googleAccessTokenExpiry) {
      cachedToken = campaign.googleAccessToken;
      tokenExpiry = campaign.googleAccessTokenExpiry;
      refreshing = null;
      return { accessToken: cachedToken, campaign };
    }

    // Refresh token using Google API
    const refreshToken = campaign.googleRefreshToken;
    if (!refreshToken) throw new Error("Missing refresh token");    

    const body = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID ?? "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    });

    const res = await fetch(process.env.NEXT_PUBLIC_GOOGLE_AUTH_TOKEN!, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    const json: any = await res.json();
    if (!json.access_token) throw new Error("Failed to refresh token");

    // Update cache and DB
    cachedToken = json.access_token;
    tokenExpiry = Date.now() + json.expires_in * 1000 - 5000; // 5s buffer

    await Campaign.findByIdAndUpdate(campaignId, {
      googleAccessToken: cachedToken,
      googleAccessTokenExpiry: tokenExpiry,
      ...(json.refresh_token && { googleRefreshToken: json.refresh_token }),
    });

    refreshing = null;
    return { accessToken: cachedToken, campaign };
  })();

  return refreshing;
}
