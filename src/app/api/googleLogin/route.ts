
import { getCurrentCampaignIdData, getDbCompaignDataUpdate, setPropertyIdForDB } from "@/actions/campaign";
import { getGoogleAnalyticsAccountID, getGoogleAnalyticsPropertyID } from "@/actions/googleConsole";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
const state = url.searchParams.get("state")?.toString();
  // console.log(campaignId,"in googleLogin");
  console.log(url, "url in googleLogin");
  console.log(code, "code in googleLogin");
  console.log(state, "campaignId   in googleLogin"); 
  let decoded = "";
  if (state !== undefined) {
 decoded = decodeURIComponent(state);
  // ...
}
    // Parse from JSON string to object
    const stateData = JSON.parse(decoded);

    console.log(stateData, "state data object");
    console.log(stateData.campaignId, "campaignId");
    console.log(stateData.analyticsData, "analyticsData");
    console.log(stateData.consoleData, "consoleData");

  if (!code) {
    return NextResponse.json({ message: "No code provided." }, { status: 400 });
  }

  try {
    const tokenData = {
      code: code,
       client_id:
       `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`,
      client_secret: `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET}`,
      redirect_uri: `${process.env.NEXT_PUBLIC_REDIRECT_URI}`,
      grant_type: "authorization_code",
    };

    const tokenRes = await fetch(`${process.env.NEXT_PUBLIC_GOOGLE_AUTH_TOKEN}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(tokenData as any).toString(),
    });

    const tokenResult = await tokenRes.json();
    console.log("Google Tokens:", tokenResult);

    const currentCampaignIdData = await getCurrentCampaignIdData(stateData.campaignId);
    const projectUrl= currentCampaignIdData?.CurrentCampaignIdData?.projectUrl
      console.log(currentCampaignIdData,"inRouter")
    // const accountIDdata = await getGoogleAnalyticsAccountID(tokenResult?.access_token);
    
    // console.log(accountIDdata,"accountIDdata in googleLogin");

    // const propertyIDdata = await getGoogleAnalyticsPropertyID(accountIDdata?.webProperties[0].id, tokenResult?.access_token);
    // console.log(propertyIDdata,"propertyIDdata in googleLogin");
    // You can store tokens in db or session here

      if (stateData?.analyticsData === true) {
      await setPropertyIdForDB(stateData.campaignId, tokenResult, projectUrl);
      await getDbCompaignDataUpdate(stateData.campaignId, tokenResult);
    }
    if (stateData?.consoleData === true) {
      await getDbCompaignDataUpdate(stateData.campaignId, tokenResult);
    }



    // Redirect to dashboard or success page 


    return NextResponse.redirect(new URL(`/dashboard/${stateData.campaignId}`, req.url));
  } catch (err) {
    console.error("Error in Google OAuth Callback:", err);
    return NextResponse.json({ message: "OAuth Error" }, { status: 500 });
  }
}
