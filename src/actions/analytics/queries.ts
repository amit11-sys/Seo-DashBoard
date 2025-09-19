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
    console.log(data?.tasks[0]?.result, "output");

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
    console.log(access_token, "access_token in googleAnalyticsAccountID");
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
    console.log(AccountIdData, "AccountIdData");

    const accountsData: SimplifiedAccount[] = AccountIdData?.accounts?.map(
      (acc: { name: string; displayName: string; regionCode: string }) => ({
        accountId: acc?.name.split("/")[1],
        displayName: acc?.displayName,
        region: acc?.regionCode,
      })
    );

    console.log(accountsData, "accountsDatauI");
    const nameMatchRefined = refineUrl(nameMatch);
    console.log(nameMatchRefined, "nameMatchRefined");

    const matchForAcountId = findMatchingAccounts(accountsData, nameMatchRefined);

    console.log(matchForAcountId, "matchForAcountId");

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
  const words = nameMatch
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

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

    const url = new URL(
      `${process.env.NEXT_PUBLIC_ANALYTICS_ADMIN}properties`
    );
    url.searchParams.append("filter", `parent:accounts/${accountId}`);

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



export async function AnalyticsData(access_token: string, propertyId: string) {

  if(propertyId === null || propertyId === undefined) return null;
  const baseUrl = `${process.env.NEXT_PUBLIC_ANALYTICS_DATA}properties/${propertyId}:runReport`;

  // Define all the payloads to loop through
  const payloads: { name: string; payload: any }[] = [
    { name: "getUserData", payload: {
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        dimensions: [{ name: "sessionDefaultChannelGrouping" }],
        metrics: [
          { name: 'sessions' },
          { name: 'activeUsers' },
          { name: 'newUsers' },
          { name: 'averageSessionDuration' },
          { name: 'userEngagementDuration' },
        ],
      }
    },
    { name: "countryData", payload: {
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        dimensions: [{ name: "country" }],
        metrics: [{ name: "activeUsers" }],
      }
    },
    { name: "pageTitleData", payload: {
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        dimensions: [{ name: "pageTitle" }],
        metrics: [{ name: "activeUsers" }],
      }
    },
    { name: "keyData", payload: {
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        dimensions: [{ name: 'sessionDefaultChannelGrouping' }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'sessions' },
          { name: 'engagedSessions' },
          { name: 'averageSessionDuration' },
          { name: 'eventsPerSession' },
          { name: 'engagementRate' },
          { name: 'eventCount' },
          { name: 'totalRevenue' },
        ],
      }
    }
  ];

  const results: Record<string, any> = {};

  for (const { name, payload } of payloads) {
    try {
      const res = await fetch(baseUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error(`Error in payload ${name}:`, errorData);
        results[name] = { error: errorData };
        continue;
      }

      const data = await res.json();
      results[name] = data;
    } catch (error: any) {
      console.error(`Exception in payload ${name}:`, error?.message ?? error);
      results[name] = { error: error?.message ?? error };
    }
  }
  console.log(results, "resultsok");

  return results;
}
