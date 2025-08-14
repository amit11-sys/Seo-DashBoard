export const fetchLievKeyword = async (url: string) => {
  const username = process.env.NEXT_PUBLIC_DATAFORSEO_USERNAME!;
  const password = process.env.NEXT_PUBLIC_DATAFORSEO_PASSWORD!;

  const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");
  const post_array = [];
  post_array.push({
    target: url,
    language_name: "English",
    location_code: 2840,
   
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

function normalizeString(str: string): string {
  return str.toLowerCase().replace(/\s+/g, "");
}

function findMatchingAccounts(
  data: AccountItem[],
  nameMatch: string
): AccountItem[] {
  const normalizedMatch = normalizeString(nameMatch);

  return data.filter((item) =>
    normalizeString(item.displayName).includes(normalizedMatch)
  );
}
function refineUrl(url: string): string {
  let clean = url.replace(/^https?:\/\//, "").replace(/^www\./, "");

  return clean.split(".")[0];
}

const username = process.env.NEXT_PUBLIC_DATAFORSEO_USERNAME;

export async function googleAnalyticsAccountID(
  access_token: string,
  nameMatch: string
) {
  try {
   
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

    const AccountIdData: any = await res.json();

    const accountsData: SimplifiedAccount[] = AccountIdData?.accounts?.map(
      (acc: { name: string; displayName: string; regionCode: string }) => ({
        accountId: acc.name.split("/")[1],
        displayName: acc.displayName,
        region: acc.regionCode,
      })
    );

    const nameMatchRefined = refineUrl(nameMatch);

    const matchForAcountId = findMatchingAccounts(accountsData, nameMatchRefined);


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
  const words = nameMatch
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  return properties.filter((property) => {
    const normalizedDisplayName = property.displayName.toLowerCase();

    return (
      property.parent.endsWith(accountId) &&
      words.every((word) => normalizedDisplayName.includes(word))
    );
  });
}




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
       console.log(properties,"okkkidd");
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






export async function AnalyticsData(access_token: string, propertyId: string) {

 
  if (!access_token || !propertyId) {
    throw new Error("Access token and property ID are required");
   
  }
  const baseUrl =  `${process.env.NEXT_PUBLIC_ANALYTICS_DATA}properties/${propertyId}:runReport`;

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


  return results;
}
