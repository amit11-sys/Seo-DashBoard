"use server";
import Campaign from "@/lib/models/campaign.model";
import { getDBcompaignGoogleData } from "../campaign";
import fetch from "node-fetch";
import { getValidGoogleToken } from "../campaign/queries";
import { date } from "zod";
import { fetchLocations } from "../KeywordsGmb/queries";

const client_secret = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET;
const client_id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;


type GAApiRow = any; // <- replace with your real row shape
type GSApiResponse = {
  rows?: GAApiRow[];
};
type GApiResponse = {
  rows?: GAApiRow[];
};
interface CampaignTokens {
  googleAccessToken: string;
  googleAccessTokenExpiry: number;
  googleRefreshToken: string;
  googleRefreshTokenExpiry: number;
  googleId_token: string;

  projectUrl: string;
}

interface CompaignGoogleData {
  error?: string;
  success?: boolean;
  message?: string;
  compaignGoogleData?: CampaignTokens; // <-- make it optional
}

function extractDomain(url: string): string | null {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname; // e.g. 'www.handonawhiteboard.com'
    const parts = hostname.split(".");
    // Drop 'www' or subdomain if present
    return parts.length > 2 ? parts[parts.length - 2] : parts[0];
  } catch {
    return null;
  }
}

export async function GoogleConsoleDataByDate(
  newCompaignId: string,
  date: any
) {
  // this data taken from dimensions
  const { startDate, endDate, dimensions } = date;
  const today1 = new Date();
  const todayFormatted = today1.toISOString().split("T")[0];

  const today2 = new Date();
  const threeMonthsAgo = new Date(today2.setMonth(today2.getMonth() - 3));

  const threeMonthsAgoFormatted = threeMonthsAgo.toISOString().split("T")[0];

  const payload = {
    startDate: startDate || threeMonthsAgoFormatted,
    endDate: endDate || todayFormatted,
    dimensions: ["date"],
  };

  const compaignGoogleData: any = await getValidGoogleToken(newCompaignId);
 

  const access_token = compaignGoogleData.googleAccessToken;
  const CompaignUrl = compaignGoogleData.projectUrl;

  const urlNameMatch = extractDomain(CompaignUrl);
 

  try {

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_GOOGLE_CONSOLE_URL}${encodeURIComponent(CompaignUrl)}/searchAnalytics/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(
        `GA request failed: ${res.status} ${res.statusText} - ${text}`
      );
    }

    const json = (await res.json()) as GSApiResponse;

    const rawData = json.rows ?? [];
    const processedData = processConsoleData(rawData);
    0;
    return {
      dateWise: rawData,
      monthWise: processedData,
    };
  } catch (error: any) {
    console.error(
      "getGoogleAnalyticsDataByDate error:",
      error?.message ?? error
    );
    return;
  }
}
interface AnalyticsDataItem {
  keys: string[]; // An array containing the date (e.g., ['2024-10-19'])
  clicks: number;
  impressions: number;
  position: number;
}
export async function GoogleSearchDataByDimension(
  newCompaignId: string,
  dimension: string,
  date: any
) {

  const { startDate, endDate } = date;
  const today1 = new Date();
  const todayFormatted = today1.toISOString().split("T")[0];

  const today2 = new Date();
  const threeMonthsAgo = new Date(today2.setMonth(today2.getMonth() - 3));

  const threeMonthsAgoFormatted = threeMonthsAgo.toISOString().split("T")[0];

  try {
    const dataWithDimension = {
      startDate: startDate || threeMonthsAgoFormatted,
      endDate: endDate || todayFormatted,
      dimensions: [dimension],
    };
    const compaignGoogleData: any = await getValidGoogleToken(newCompaignId);

  


    
    
    if (!compaignGoogleData?.googleAccessToken) {
      throw new Error("No campaign tokens found");
    }
    
    const access_token = compaignGoogleData?.googleAccessToken;
    const CompaignUrl = compaignGoogleData?.projectUrl;
    
   

    const acoountNameforMatch = extractDomain(CompaignUrl);

    
    

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_GOOGLE_CONSOLE_URL}${encodeURIComponent(CompaignUrl)}/searchAnalytics/query`,
      
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataWithDimension),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      const err: any = new Error(`HTTP ${res.status} ${res.statusText}`);
      err.response = { status: res.status, data: text };
      throw err;
    }
    const json: any = await res.json();

    const dimensionData = json?.rows ?? [];
    return dimensionData;
  } catch (error: any) {
    if (error?.response) {
      console.error("Error response:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }
    return;
  }
}

function processConsoleData(rawData: AnalyticsDataItem[]): {
  month: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}[] {
  const monthData: Record<
    string,
    { clicks: number; impressions: number; positionSum: number; count: number }
  > = {};

  rawData.forEach((item) => {
    const date = item.keys[0]; // Assuming 'keys' contains the date
    const clicks = item.clicks || 0; // Use 0 as fallback if clicks is undefined
    const impressions = item.impressions || 0; // Use 0 as fallback if impressions is undefined
    const position = item.position || 0; // Use 0 as fallback if position is undefined

    // Extract year and month (e.g., "2024-10")
    const [year, month] = date.split("-");
    const monthKey = `${year}-${month}`;

    if (!monthData[monthKey]) {
      monthData[monthKey] = {
        clicks: 0,
        impressions: 0,
        positionSum: 0,
        count: 0,
      };
    }

    // Sum up the metrics for the month
    monthData[monthKey].clicks += clicks;
    monthData[monthKey].impressions += impressions;
    monthData[monthKey].positionSum += position;
    monthData[monthKey].count += 1; // Count the number of records for average position
  });

  // Convert the aggregated object to an array
  return Object.entries(monthData).map(([month, data]) => ({
    month,
    clicks: data.clicks,
    impressions: data.impressions,
    ctr: data.impressions > 0 ? data.clicks / data.impressions : 0, // CTR = clicks / impressions
    position: data.count > 0 ? data.positionSum / data.count : 0, // Average position
  }));
}

const isTokenExpired = (expiry: string | number): boolean => {
  const expiryTime = typeof expiry === "string" ? parseInt(expiry) : expiry;
  return Date.now() >= expiryTime;
};

export async function refreshGoogleAccessToken(campaignId: string) {
  const campaign = await Campaign.findById({ _id: campaignId });
  if (!campaign) throw new Error("Campaign not found");

  const refresh_token = campaign.googleRefreshToken;

  const body = new URLSearchParams({
    client_id: client_id ?? "",
    client_secret: client_secret ?? "",
    refresh_token,
    grant_type: "refresh_token",
  });

  const res = await fetch(`${process.env.NEXT_PUBLIC_GOOGLE_AUTH_TOKEN}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const json: any = await res.json();

  // console.log(json, "json Refresh token data");

  if (!json) {
    throw new Error(`Refresh failed: ${json}`);
  }

  // Calculate new expiry time in ms
  const newExpiry = Date.now() + json.expires_in * 1000;

  // // Save updated token
  const updatedCampaign = await Campaign.findByIdAndUpdate(
    { _id: campaignId },
    {
      $set: {
        googleAccessToken: json.access_token,
        googleAccessTokenExpiry: newExpiry,
      },
    }
  );

  return updatedCampaign;
}

interface GoogleAnalyticsAccount {
  name: string; // e.g. "accounts/8095231"
  createTime: string;
  updateTime: string;
  displayName: string;
  regionCode: string;
}

interface SimplifiedAccount {
  accountId: string;
  displayName: string;
  region: string;
}
type AccountItem = {
  accountId: string;
  displayName: string;
  region: string;
};


function isSubsequence(small: string, large: string): boolean {
  let i = 0;
  for (let j = 0; j < large.length && i < small.length; j++) {
    if (small[i] === large[j]) i++;
  }
  return i === small.length;
}

function cleanName(name: string): string {
  return name
    .toLowerCase()
    .replace(/^www\./, "")
    .replace(/\.[^.\s]+$/, "")
    .replace(/\s+/g, "");
}

function findMatchingAccounts(accounts: any[], nameMatch: string) {
  const cleanedTarget = cleanName(nameMatch);

  return (
    accounts.find((account: any) => {
      const cleanedDisplayName = cleanName(
        account.displayName || account.name || ""
      );
      return isSubsequence(cleanedDisplayName, cleanedTarget);
    }) || null
  );
}

export async function googleAnalyticsAccountID(
  access_token: string,
  nameMatch: string
) {
  try {
    // const payload = { startDate, endDate, dimensions };

    const res = await fetch(
   `${ process.env.NEXT_PUBLIC_ANALYTICS_ADMIN}accounts`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // console.table({ access_token, nameMatch });
    const AccountIdData: any = await res.json();
    // console.log(AccountIdData, "AccountIdData");

    const accountsData: SimplifiedAccount[] = AccountIdData?.accounts?.map(
      (acc: { name: string; displayName: string; regionCode: string }) => ({
        accountId: acc.name.split("/")[1],
        displayName: acc.displayName,
        region: acc.regionCode,
      })
    );

    // console.log(accountsData, "accountsData");

    const matchForAcountId = findMatchingAccounts(accountsData, nameMatch);

    // console.log(matchForAcountId, "matchForAcountId");

    const firstMatch = Array.isArray(matchForAcountId)
      ? matchForAcountId[0]
      : matchForAcountId;

    const accountId = firstMatch?.accountId || "";
    const accountName = firstMatch?.displayName || "";


    // console.log({ accountId, accountName }, "accountIdok");
    return {
      accountId,
      accountName,
    };
  } catch (error: any) {
    console.error(
      "getGoogleAnalyticsDataByDate error:",
      error?.message ?? error
    );
    return;
  }
}

interface PropertiesResponse {
  properties?: Property[];
}

// Function to fetch GA4 properties for an account

type Property = {
  name: string;
  displayName: string;
  parent: string;
};

function findMatchingProperty(
  properties: Property[],
  accountId: string,
  nameMatch: string
): Property[] {
  const normalizedName = nameMatch.replace(/\s+/g, "").toLowerCase();

  return properties.filter((property) => {
    const normalizedDisplayName = property.displayName
      .replace(/\s+/g, "")
      .toLowerCase();
    return (
      property.parent.endsWith(accountId) &&
      normalizedDisplayName.includes(normalizedName)
    );
  });
}

export async function googleAnalyticsPropertyID(
  accountId: string,
  accessToken: string,
  nameMatch: string
): Promise<Property[]> {
  try {
    // Validate inputs
    if (!accountId || !accessToken) {
      throw new Error("Account ID and access token are required");
    }

    const url = new URL(
      `${ process.env.NEXT_PUBLIC_ANALYTICS_ADMIN}properties`
    );
    url.searchParams.append("filter", `parent:accounts/${accountId}`);

    // Make the API request
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    // Check for HTTP errors
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API call failed with status ${response.status}: ${errorText}`
      );
    }

    // Parse the response
    const data: any = await response.json();

    // Validate response structure
    if (!data.properties || !Array.isArray(data.properties)) {
      console.warn("No properties found or invalid response structure:", data);
      return [];
    }

    // Map properties to a simplified format
    const properties: Property[] = data.properties.map((prop: any) => ({
      name: prop.name,
      displayName: prop.displayName,
      parent: prop.parent,
    }));

    const propertiesDataID = findMatchingProperty(
      properties,
      accountId,
      nameMatch
    );

    return propertiesDataID;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("googleAnalyticsPropertyID error:", errorMessage);
    return []; // Return null to indicate failure
  }
}

export async function getAnalyticsData(
  access_token: string,
  rawpropertiesID: string
) {
  function extractPropertyId(rawpropertiesID: string): string {
    return rawpropertiesID.replace("properties/", "");
  }

  // const propertyId = 424145640;
  const propertyId = extractPropertyId(rawpropertiesID);

  try {
    const requestBody = {
      dateRanges: [
        {
          startDate: "30daysAgo",
          endDate: "today",
        },
      ],
      dimensions: [{ name: "country" }],
      metrics: [{ name: "activeUsers" }],
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ANALYTICS_DATA}properties/${propertyId}:runReport`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response:", errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const report = await response.json();
    return report;
  } catch (error: any) {
    console.error("Error fetching analytics data:", error?.message ?? error);
  }
}
