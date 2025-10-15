import { callApi, initTokens } from "@/lib/tokenManager";
import { getGetCampaignByid } from "../campaign";
import { connectToDB } from "@/lib/db";
import { getUserFromToken } from "@/app/utils/auth";
import Campaign from "@/lib/models/campaign.model";
import GoogleAccount from "@/lib/models/googleAccount.model";
import GoogleSites from "@/lib/models/gscSites.model";
import GoogleProperty from "@/lib/models/ga4Properties.model";
import { getCampaignDataWithGoogleData } from "../google";
import { updateGoogleAccessToken } from "../google/queries";

export const fetchLievKeyword = async (url: string) => {
  const username = process.env.NEXT_PUBLIC_DATAFORSEO_USERNAME!;
  const password = process.env.NEXT_PUBLIC_DATAFORSEO_PASSWORD!;

  const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");
  const post_array = [];
  post_array.push({
    target: url,
    language_name: "English",
    location_code: 2840,
    // filters: [
    //   ["keyword_data.keyword_info.search_volume", "<>", 0],
    //   "and",
    //   [
    //     ["ranked_serp_element.serp_item.type", "<>", "paid"],
    //     "or",
    //     ["ranked_serp_element.serp_item.is_paid", "=", false],
    //   ],
    // ],
    // limit: 3,
  });

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DATAFORSEO_URL}${"serp/google/organic/live/regular"}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${basicAuth}`,
        },
        body: JSON.stringify(post_array),
      }
    );

    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`Request failed: ${res.status} - ${errorBody}`);
    }

    const data = await res.json();
    // console.log(data?.tasks[0]?.result, "output");

    return data?.tasks || [];
  } catch (err: any) {
    console.error("Fetch error:", err);
    throw new Error("Failed to fetch ranked keywords");
  }
};

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

function normalizeString(str: string = ""): string {
  return str.toLowerCase().replace(/\s+/g, ""); // lowercase + remove spaces
}

function findMatchingAccounts(
  data: AccountItem[] = [],
  nameMatch: string = ""
): AccountItem[] {
  const normalizedMatch = normalizeString(nameMatch);

  return data.filter((item) => {
    const normalizedName = normalizeString(item.displayName ?? "");

    // ✅ Match if either contains the other OR shares a common prefix
    return (
      normalizedName.includes(normalizedMatch) ||
      normalizedMatch.includes(normalizedName) ||
      normalizedName.startsWith(normalizedMatch) ||
      normalizedMatch.startsWith(normalizedName)
    );
  });
}

function refineUrl(url: string): string {
  // Remove protocol and "www."
  let clean = url.replace(/^https?:\/\//, "").replace(/^www\./, "");

  // Take only the first part before the first dot
  return clean.split(".")[0];
}

export async function googleAnalyticsAccountID(
  access_token: string,
  nameMatch: string
) {
  try {
    // const payload = { startDate, endDate, dimensions };
    // console.log(nameMatch, "nameMatch in googleAnalyticsAccountID");
    // console.log(access_token, "access_token in googleAnalyticsAccountID");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ANALYTICS_ADMIN}accounts`,
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
    //
    const accountsData: SimplifiedAccount[] = AccountIdData?.accounts?.map(
      (acc: { name: string; displayName: string; regionCode: string }) => ({
        accountId: acc?.name.split("/")[1],
        displayName: acc?.displayName,
        region: acc?.regionCode,
      })
    );

    // console.log(accountsData, "accountsDatauI");
    const nameMatchRefined = refineUrl(nameMatch);
    // console.log(nameMatchRefined, "nameMatchRefined");

    const matchForAcountId = findMatchingAccounts(
      accountsData,
      nameMatchRefined
    );

    // console.log(matchForAcountId, "matchForAcountId");

    const accountId = matchForAcountId[0]?.accountId;
    const accountName = matchForAcountId[0]?.displayName;
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
  // Split into individual words (ignoring spaces and case)
  const words = nameMatch.trim().toLowerCase().split(/\s+/).filter(Boolean);

  return properties.filter((property) => {
    const normalizedDisplayName = property.displayName.toLowerCase();

    return (
      property.parent.endsWith(accountId) &&
      // Every word must be included in the display name
      words.every((word) => normalizedDisplayName.includes(word))
    );
  });
}

// export async function googleAnalyticsPropertyID(
//   accountId: string,
//   accessToken: string,
//   nameMatch: string
// ): Promise<Property[]> {
//   console.log(accountId,"accountId in googleAnalyticsPropertyID");
//   console.log(accessToken,"accessToken in googleAnalyticsPropertyID");
//   console.log(nameMatch,"nameMatch in googleAnalyticsPropertyID");
//   try {
//     // Validate inputs
//     if (!accountId || !accessToken) {
//       throw new Error("Account ID and access token are required");
//     }

//     // Log inputs for debugging (optional)
//     // console.table({ accessToken, accountId });

//     // Construct the API URL with filter for properties under the account
//     const url = new URL(
//     );
//     url.searchParams.append("filter", `parent:accounts/${accountId}`);

//     // Make the API request
//     const response = await fetch(url.toString(), {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//       },
//     });

//     // Check for HTTP errors
//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(
//         `API call failed with status ${response.status}: ${errorText}`
//       );
//     }

//     // Parse the response
//     const data: any = await response.json();

//     // Validate response structure
//     if (!data.properties || !Array.isArray(data.properties)) {
//       console.warn("No properties found or invalid response structure:", data);
//       return [];
//     }

//     // Map properties to a simplified format
//     const properties: Property[] = data.properties.map((prop: any) => ({
//       name: prop.name,
//       displayName: prop.displayName,
//       parent: prop.parent,
//     }));

//     console.log(properties,"propertiesId");//[
// //   {
// //     name: 'properties/424145640',
// //     displayName: 'SEO Quartz',
// //     parent: 'accounts/299633390'
// //   },
// //   {
// //     name: 'properties/468876035',
// //     displayName: 'Health Connect Daily',
// //     parent: 'accounts/299633390'
// //   }
// // ] consoleLog propertiesId

// //match displayname with nameMatch

//     return propertiesDataID;
//   } catch (error: unknown) {
//     const errorMessage =
//       error instanceof Error ? error.message : "Unknown error occurred";
//     console.error("googleAnalyticsPropertyID error:", errorMessage);
//     return []; // Return null to indicate failure
//   }
// }

export async function googleAnalyticsPropertyID(
  accountId: string,
  accessToken: string,
  nameMatch: string
): Promise<any> {
  // console.log(accountId, "accountId in googleAnalyticsPropertyID");
  // console.log(accessToken, "accessToken in googleAnalyticsPropertyID");
  // console.log(nameMatch, "nameMatch in googleAnalyticsPropertyID");

  try {
    if (!accountId || !accessToken) {
      throw new Error("Account ID and access token are required");
    }

    const url = new URL(`${process.env.NEXT_PUBLIC_ANALYTICS_ADMIN}properties`);
    // url.searchParams.append("filter", `parent:accounts/${accountId}`);
    url.searchParams.append("filter", `parent:${accountId}`);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API call failed with status ${response.status}: ${errorText}`
      );
    }

    const data: any = await response.json();

    if (!data.properties || !Array.isArray(data.properties)) {
      console.warn("No properties found or invalid response structure:", data);
      return [];
    }

    const properties: Property[] = data.properties.map((prop: any) => ({
      name: prop.name,
      displayName: prop.displayName,
      parent: prop.parent,
    }));
    //  console.log(properties,"okkkidd");
    const search = nameMatch.trim().toLowerCase();
    const propertiesDataID = properties[0]?.name ?? "";
    // {
    //   name: 'properties/424145640',
    //   displayName: 'SEO Quartz',
    //   parent: 'accounts/299633390'
    // } loopproperty
    // {
    //   name: 'properties/468876035',
    //   displayName: 'Health Connect Daily',
    //   parent: 'accounts/299633390'
    // } loopproperty

    // console.log(propertiesDataID, "okoookID");

    return propertiesDataID;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("googleAnalyticsPropertyID error:", errorMessage);
    return [];
  }
}

export const FetchGoogleAnalyticsData = async (
  integrationType: string,
  selectedGmail: string
) => {
  try {
    await connectToDB();

    // 1️⃣ Get token for this Gmail
    const tokensDetails = await GoogleAccount.findOne({
      googleEmail: selectedGmail,
    });
    if (!tokensDetails?.googleAccessToken) {
      throw new Error("No access token found for this Gmail");
    }

    // 2️⃣ Fetch account list from Google
    // let accountAnalyticsData: any = {};
    // if (integrationType === "gsc" || integrationType === "ga") {
    let accountAnalyticsData = await listAnalyticsAccounts(
      tokensDetails.googleAccessToken
    );
    // }

    // if (
    //   !accountConsoleData?.siteEntry ||
    //   !Array.isArray(accountConsoleData.siteEntry) ||
    //   accountConsoleData.siteEntry.length === 0
    // ) {
    //   throw new Error("No account data found from Google API");
    // }

    // 3️⃣ Fetch all campaigns from DB
    const campaigns = await Campaign.find();

    // 4️⃣ Helper function to normalize URLs
    const normalizeUrl = (url: string) =>
      url
        ?.toLowerCase()
        .replace(/^https?:\/\//, "") // remove http:// or https://
        .replace(/^www\./, "") // remove www.
        .replace(/\/$/, ""); // remove trailing slash

    // 5️⃣ Match each campaign’s projectUrl with siteEntry.siteUrl
    const matchedCampaigns = campaigns
      .map((campaign: any) => {
        const projectUrls = Array.isArray(campaign.projectUrl)
          ? campaign.projectUrl
          : campaign.projectUrl
            ? [campaign.projectUrl]
            : [];

        const normalizedProjectUrls = projectUrls.map(normalizeUrl);

        const matchingAccounts = accountAnalyticsData.accounts.filter(
          (account: any) => {
            const normalizedSiteUrl = normalizeUrl(account.displayName || "");

            // ✅ Compare normalized URLs (either contains the other)
            return normalizedProjectUrls.some(
              (url: string) =>
                normalizedSiteUrl.includes(url) ||
                url.includes(normalizedSiteUrl)
            );
          }
        );

        // Keep only campaigns that actually matched
        if (matchingAccounts.length > 0) {
          return {
            campaignId: campaign._id,
            campaignName: campaign.campaignName || "Unnamed Campaign",
            projectUrls,
            matchingAccounts,
          };
        }

        return null;
      })
      .filter(Boolean);

    // 6️⃣ Return final result
    return {
      success: true,
      message: "Successfully fetched Google data and matched campaigns",
      data: {
        gmail: selectedGmail,
        integrationType,
        matchedCampaigns,
        accountAnalyticsData,
      },
    };
  } catch (error: any) {
    console.error("Error fetching Google login details:", error);
    return {
      success: false,
      message: error.message || "Error fetching Gmail login details",
    };
  }
};

export const SaveGoogleAnalyticsData = async (
  displayName: string,
  RawAccountId: string,
  googleEmail: string,
  campaignId: string
) => {
  try {
    await connectToDB();
    const extractAccountNumber = (accountName: string): string => {
      const match = accountName.match(/\d+$/);
      return match ? match[0] : "";
    };

    const accountId = extractAccountNumber(RawAccountId);

    const googleAccount = await GoogleAccount.findOne({ googleEmail });
    if (!googleAccount) {
      throw new Error("Google Account not found for this email");
    }

    // const testing:any = await getCampaignDataWithGoogleData(campaignId);
    // console.log(testing?.campaignWithAccountData?.projectUrl,"googleTestingDataokok")
    // const campaignGoogleData: any = await getValidGoogleToken(campaignId);
    // const access_token = googleAccount?.googleAccessToken;
    // const campaignUrl = testing?.campaignWithAccountData?.projectUrl;

    const tokenData = await updateGoogleAccessToken(
      googleAccount.googleAccessToken,
      googleAccount.googleRefreshToken,
      googleAccount.googleAccessTokenExpiry
    );

    const propertiesID = await googleAnalyticsPropertyID(
      RawAccountId,
      tokenData.data?.access_token,
      displayName
    );
    // console.log(propertiesID, "propertiesID in propertyId");

    const propertyId = extractAccountNumber(propertiesID);
    const googleAnalyticsData = await GoogleProperty.findOne({ displayName });

    if (!googleAnalyticsData?.displayName) {
      const googleAnalticsData = await GoogleProperty.create({
        displayName,
        accountId,
        propertyId,
        googleAccountId: googleAccount._id,
      });

      // set campaign id to google account
      await Campaign.findByIdAndUpdate(
        { _id: campaignId },
        { $set: { gaPropertyId: googleAnalticsData._id } }
      );

      if (!googleAnalticsData) {
        throw new Error("Failed to save Google console details");
      }

      return {
        success: true,
        message: "Successfully saved Google analytics details",
        googleAnalticsData,
      };
    }

    return {
      success: true,
      message: "Successfully saved Google console details",
      googleAnalyticsData,
    };
  } catch (error) {
    console.error("Error saving Google console details:", error);
    return {
      success: false,
      error: "Error saving Google console details",
    };
  }
};

// export async function AnalyticsData(access_token: string, propertyId: string) {
//   //   function extractPropertyId(rawpropertiesID: string): string {
//   //   return rawpropertiesID.replace('properties/', '');
//   // }

//   // const propertyId = 424145640;
//   // const propertyId = extractPropertyId(rawpropertiesID);

//   try {
//     // const requestBody = {
//     //   dateRanges: [
//     //     {
//     //       startDate: "30daysAgo",
//     //       endDate: "today",
//     //     },
//     //   ],
//     //   dimensions: [
//     //     { name: "country" },
//     //     // { name: "pageTitle" },
//     //     // { name: "sessionDefaultChannelGrouping" },
//     //   ],
//     //   metrics: [
//     //     { name: "activeUsers" },
//     //     // { name: "newUsers" },
//     //     // { name: "averageSessionDuration" }, // Average engagement time (in seconds)
//     //     // { name: "userEngagementDuration" },
//     //     // { name: "eventsPerSession" }, // Events per session
//     //     // { name: "engagementRate" }, // Engagement rate
//     //     // { name: "eventCount" }, // Event count
//     //     // { name: "totalRevenue" },
//     //   ],
//     // };

//     const getUserPayload = {
//       dateRanges: [
//         {
//           startDate: "30daysAgo",
//           endDate: "today",
//         },
//       ],
//       dimensions: [
//         // { name: "country" },
//         // { name: "pageTitle" },
//         { name: "sessionDefaultChannelGrouping" },
//       ],
//       metrics: [
//         // { name: 'screenPageViews' }, // Page views
//         { name: 'sessions' }, // Total sessions
//         // metrics: [
//         { name: 'activeUsers' }, // Active users
//         { name: 'newUsers' }, // New users
//         { name: 'averageSessionDuration' }, // Average engagement time (in seconds)
//         { name: 'userEngagementDuration' }, // Total engagement time (in seconds)
//       ],
//     };
//     const countryPayload = {
//       dateRanges: [
//         {
//           startDate: "30daysAgo",
//           endDate: "today",
//         },
//       ],
//       dimensions: [
//         { name: "country" },
//         // { name: "pageTitle" },
//         // { name: "sessionDefaultChannelGrouping" },
//       ],
//       metrics: [
//         { name: "activeUsers" },
//         // { name: "newUsers" },
//         // { name: "averageSessionDuration" }, // Average engagement time (in seconds)
//         // { name: "userEngagementDuration" },
//         // { name: "eventsPerSession" }, // Events per session
//         // { name: "engagementRate" }, // Engagement rate
//         // { name: "eventCount" }, // Event count
//         // { name: "totalRevenue" },
//       ],
//     };
//     const pageTitlePayload = {
//       dateRanges: [
//         {
//           startDate: "30daysAgo",
//           endDate: "today",
//         },
//       ],
//       dimensions: [
//         // { name: "country" },
//         { name: "pageTitle" },
//         // { name: "sessionDefaultChannelGrouping" },
//       ],
//       metrics: [
//         { name: "activeUsers" },
//         // { name: "newUsers" },
//         // { name: "averageSessionDuration" }, // Average engagement time (in seconds)
//         // { name: "userEngagementDuration" },
//         // { name: "eventsPerSession" }, // Events per session
//         // { name: "engagementRate" }, // Engagement rate
//         // { name: "eventCount" }, // Event count
//         // { name: "totalRevenue" },
//       ],
//     };
//     const keyDataPayload = {
//       dateRanges: [
//         {
//           startDate: "30daysAgo",
//           endDate: "today",
//         },
//       ],
//       dimensions: [
//         { name: 'sessionDefaultChannelGrouping' }, // Traffic source (organic search, paid search, etc.)
//       ],
//       metrics: [
//         { name: 'activeUsers' }, // Users
//         { name: 'sessions' }, // Sessions
//         { name: 'engagedSessions' }, // Engaged sessions
//         { name: 'averageSessionDuration' }, // Average engagement time (in seconds)
//         // { name: 'engagedSessionsPerUser' }, // Engaged sessions per user
//         { name: 'eventsPerSession' }, // Events per session
//         { name: 'engagementRate' }, // Engagement rate
//         { name: 'eventCount' }, // Event count
//         { name: 'totalRevenue' }, // Total revenue
//       ],
//     };

//     const response = await fetch(
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${access_token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(getUserPayload),
//       }
//     );

//     if (!response.ok) {
//       const errorData = await response.json();
//       console.error("Error response:", errorData);
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const report = await response.json();
//     return report;
//   } catch (error: any) {
//     console.error("Error fetching analytics data:", error?.message ?? error);
//   }
// }

export async function AnalyticsData(
  // access_token: string,
  date: any,
  // propertyId: string,
  campaignId: string
) {

    
       const campaignWithAccountData: any = await Campaign.findById(campaignId)
            .populate({
              path: "gaPropertyId",
              model: "GoogleProperty",
              populate: {
                path: "googleAccountId",
                model: "GoogleAccount",
              },
            })
            .lean();
                const googleAccount = campaignWithAccountData?.gaPropertyId?.googleAccountId;
                const propertiesID = Number(campaignWithAccountData?.gaPropertyId?.propertyId);

            
    const {
      googleAccessToken,
      googleAccessTokenExpiry,
      googleRefreshToken,
      googleEmail,
    } = googleAccount;

      const tokenData = await updateGoogleAccessToken(
      googleAccessToken,
      googleRefreshToken,
      googleAccessTokenExpiry
    );


  const today1 = new Date();
  const todayFormatted = today1.toISOString().split("T")[0];

  const today2 = new Date();
  const threeMonthsAgo = new Date(today2.setMonth(today2.getMonth() - 3));

  const threeMonthsAgoFormatted = threeMonthsAgo.toISOString().split("T")[0];

  // const payload = {
  //   startDate: date.startDate || threeMonthsAgoFormatted,
  //   endDate: date.endDate || todayFormatted,
  //   dimensions: ["date"],
  // };

  if (propertiesID === null || propertiesID === undefined) return null;
  const baseUrl = `${process.env.NEXT_PUBLIC_ANALYTICS_DATA}properties/${propertiesID}:runReport`;

  // Define all the payloads to loop through
  // const payloads: { name: string; payload: any }[] = [
  //   { name: "getUserData", payload: {
  //       dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
  //       dimensions: [{ name: "sessionDefaultChannelGrouping" }],
  //       metrics: [
  //         { name: 'sessions' },
  //         { name: 'activeUsers' },
  //         { name: 'newUsers' },
  //         { name: 'averageSessionDuration' },
  //         { name: 'userEngagementDuration' },
  //       ],
  //     }
  //   },
  //   { name: "countryData", payload: {
  //       dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
  //       dimensions: [{ name: "country" }],
  //       metrics: [{ name: "activeUsers" }],
  //     }
  //   },
  //   { name: "pageTitleData", payload: {
  //       dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
  //       dimensions: [{ name: "pageTitle" }],
  //       metrics: [{ name: "activeUsers" }],
  //     }
  //   },
  //   { name: "keyData", payload: {
  //       dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
  //       dimensions: [{ name: 'sessionDefaultChannelGrouping' }],
  //       metrics: [
  //         { name: 'activeUsers' },
  //         { name: 'sessions' },
  //         { name: 'engagedSessions' },
  //         { name: 'averageSessionDuration' },
  //         { name: 'eventsPerSession' },
  //         { name: 'engagementRate' },
  //         { name: 'eventCount' },
  //         { name: 'totalRevenue' },
  //       ],
  //     }
  //   }
  // ];

  // Suppose you have startDate and endDate as strings in YYYY-MM-DD format
  const startDate = date.startDate || threeMonthsAgoFormatted;
  const endDate = date.endDate || todayFormatted;
  const prevStartDate = date?.compare?.startDate || "";
  const prevEndDate = date?.compare?.endDate || "";

  let payloads: { name: string; payload: any }[]; // declare with type

  if (date.compare === undefined) {
    payloads = [
      {
        name: "getUserData",
        payload: {
          dateRanges: [{ startDate, endDate }], // current selection
          dimensions: [{ name: "sessionDefaultChannelGrouping" }],
          metrics: [
            { name: "sessions" },
            { name: "activeUsers" },
            { name: "newUsers" },
            { name: "averageSessionDuration" },
            { name: "userEngagementDuration" },
          ],
        },
      },
      {
        name: "countryData",
        payload: {
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: "country" }],
          metrics: [{ name: "activeUsers" }],
        },
      },
      {
        name: "pageTitleData",
        payload: {
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: "pageTitle" }],
          metrics: [{ name: "activeUsers" }],
        },
      },
      {
        name: "keyData",
        payload: {
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: "sessionDefaultChannelGrouping" }],
          metrics: [
            { name: "activeUsers" },
            { name: "sessions" },
            { name: "engagedSessions" },
            { name: "averageSessionDuration" },
            { name: "eventsPerSession" },
            { name: "engagementRate" },
            { name: "eventCount" },
            { name: "totalRevenue" },
          ],
        },
      },
    ];
  } else {
    payloads = [
      {
        name: "getUserData",
        payload: {
          dateRanges: [
            { startDate, endDate }, // current selection
            { startDate: prevStartDate, endDate: prevEndDate }, // previous period
          ],
          dimensions: [{ name: "sessionDefaultChannelGrouping" }],
          metrics: [
            { name: "sessions" },
            { name: "activeUsers" },
            { name: "newUsers" },
            { name: "averageSessionDuration" },
            { name: "userEngagementDuration" },
          ],
        },
      },
      {
        name: "countryData",
        payload: {
          dateRanges: [
            { startDate, endDate },
            { startDate: prevStartDate, endDate: prevEndDate },
          ],
          dimensions: [{ name: "country" }],
          metrics: [{ name: "activeUsers" }],
        },
      },
      {
        name: "pageTitleData",
        payload: {
          dateRanges: [
            { startDate, endDate },
            { startDate: prevStartDate, endDate: prevEndDate },
          ],
          dimensions: [{ name: "pageTitle" }],
          metrics: [{ name: "activeUsers" }],
        },
      },
      {
        name: "keyData",
        payload: {
          dateRanges: [
            { startDate, endDate },
            { startDate: prevStartDate, endDate: prevEndDate },
          ],
          dimensions: [{ name: "sessionDefaultChannelGrouping" }],
          metrics: [
            { name: "activeUsers" },
            { name: "sessions" },
            { name: "engagedSessions" },
            { name: "averageSessionDuration" },
            { name: "eventsPerSession" },
            { name: "engagementRate" },
            { name: "eventCount" },
            { name: "totalRevenue" },
          ],
        },
      },
    ];
  }

  const results: Record<string, any> = {};

  // const campaignDataForToken = await getGetCampaignByid(campaignId);

  // 2. Initialize token manager with this campaign's tokens
  // initTokens(
  //   campaignId,
  //   campaignDataForToken?.campaign?.googleAccessToken,
  //   campaignDataForToken?.campaign?.googleRefreshToken,
  //   campaignDataForToken?.campaign?.googleAccessTokenExpiry
  // );
  // const CompaignUrl = campaignDataForToken?.campaign?.projectUrl;

  // 3. Call Google Search API using centralized token manager
  // const res: any = await callApi(
  //   `${process.env.NEXT_PUBLIC_GOOGLE_CONSOLE_URL}${encodeURIComponent(CompaignUrl)}/searchAnalytics/query`,
  //   {
  //     method: "POST",
  //     body: JSON.stringify(payload),

  //   }
  // );

  for (const { name, payload } of payloads) {
    try {
     const res:any = await fetch(baseUrl, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${googleAccessToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(payload),
});


      if (!res) {
        const errorData = await res.json();
        console.error(`Error in payload ${name}:`, errorData);
        results[name] = { error: errorData };
        continue;
      }

      // const data = await res.json();
      // console.log(data.rows[0].metricValues,"ananlyticss")
      results[name] = await res.json();
    } catch (error: any) {
      console.error(`Exception in payload ${name}:`, error?.message ?? error);
      results[name] = { error: error?.message ?? error };
    }
  }
  // console.log(results, "resultsok");

  return { results, date };
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

export const propertyIdForDB = async (
  campaignId: string,
  tokenResult: {},
  nameMatch: any
) => {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized" };
    }

    // console.log(campaignId,"campaignId in propertyId");
    // console.log(tokenResult,"tokenResult in propertyId");
    // console.log(nameMatch,"campaignData in propertyId");

    const { access_token } = tokenResult as any;

    const acoountNameforMatch = extractDomain(nameMatch);

    // console.log(acoountNameforMatch, "acoountNameforMatch in propertyId");

    const data = await googleAnalyticsAccountID(
      access_token,
      acoountNameforMatch ?? ""
    );
    // console.log(data, "data in propertyId");
    // console.log(data,"data in propertyId");
    const accountId = Array.isArray(data)
      ? data[0]?.accountId
      : (data?.accountId ?? "");

    // console.log(accountId, "accountId in propertyId");

    // const location = await fetchLocations(access_token);

    // console.log(location, "locaion in propertyId");

    const propertiesID = await googleAnalyticsPropertyID(
      accountId,
      access_token,
      acoountNameforMatch ?? ""
    );

    // console.log(propertiesID, "propertiesID in propertyId");

    //  const propertyId = propertiesID[0]?.name ?? "";

    const propertyId = propertiesID.split("/")[1];

    // console.log(propertyId,"proepertyId in propertyId");

    const campaignDataWithPropertyIdData = await Campaign.findByIdAndUpdate(
      { _id: campaignId },
      { $set: { propertyId: propertyId, accountId: accountId } },
      { new: true }
    );
    // console.log(
    //   campaignDataWithPropertyIdData,
    //   "campaignDataWithPropertyIdData in propertyId"
    // );

    return {
      success: true,
      message: "New CompaignData with propertyId Successfully Found",
      campaignDataWithPropertyIdData,
    };
  } catch (error) {
    console.log(error);

    return { error: "Internal Server Error." };
  }
};

export async function listAnalyticsAccounts(accessToken: string) {
  const url = `${process.env.NEXT_PUBLIC_ANALYTICS_ADMIN}accounts`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Analytics API responded with ${res.status}: ${errText}`);
  }

  const body = await res.json();
  // console.log(body, "listAnalyticsAccounts");
  return body;
}


export const disableSearchAnalytics = async (campaignId: string) => {
  try {
    await connectToDB();

    const campaign = await Campaign.findById({_id: campaignId});
    if (!campaign) {
      throw new Error("Campaign not found");
    }

    const gaPropertyId = campaign.gaPropertyId;

    if (gaPropertyId) {
      await GoogleProperty.findByIdAndDelete({_id:gaPropertyId});
    }

    const updatedCampaign = await Campaign.findByIdAndUpdate(
      {_id: campaignId},
      { $unset: { gaPropertyId: "" } },
      { new: true }
    );

    return {
      success: true,
      message: "Search Console disconnected and Google Site deleted successfully",
      data: updatedCampaign,
    };
  } catch (error) {
    console.error("Error disabling Search Console:", error);
    return {
      success: false,
      message: "Failed to disable Search Console",
      error: (error as Error).message,
    };
  }
};
