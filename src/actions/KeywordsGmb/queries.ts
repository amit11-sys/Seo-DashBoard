import { cookies } from "next/headers";



type Metric = "VIEWS_SEARCH" | "VIEWS_MAPS";
type Device = "DESKTOP" | "MOBILE";

// export async function fetchGmbMetrics(accountId: string, locationId : string,access_token: string) {


//         console.log(accountId,locationId,access_token,"accountId,locationId,access_token");
//   const body = {
//     locationNames: [`accounts/${accountId}/locations/${locationId}`],
//     metrics: ["VIEWS_SEARCH", "VIEWS_MAPS"],
//     dimensions: ["DEVICE"],
//     timeRange: {
//       startDate: "2025-07-01",
//       endDate: "2025-07-31"
//     },
//     aggregation: "DAILY"
//   };

//   const res = await fetch(url, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${access_token}`,
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify(body)
//   });

//   if (!res.ok) {
//     const error = await res.text();
//     throw new Error(`GMB API error: ${error}`);
//   }

//   const data = await res.json();
//     console.log(data,"data in fetchGmbMetrics");
//   const results: Record<string, number> = {
//     "Search - mobile": 0,
//     "Search - desktop": 0,
//     "Maps - mobile": 0,
//     "Maps - desktop": 0,
//   };

//   for (const series of data.timeSeries) {
//     const metric = series.metric;
//     const deviceDimension = series.dimensionValues.find((d: any) => d.dimension === "DEVICE");
//     if (!deviceDimension) continue;

//     const device = deviceDimension.value.toLowerCase();

//     const total = series.points.reduce((acc: number, point: any) => acc + (point.value || 0), 0);

//     if (metric === "VIEWS_SEARCH") {
//       results[`Search - ${device}`] += total;
//     } else if (metric === "VIEWS_MAPS") {
//       results[`Maps - ${device}`] += total;
//     }
//   }

//   return results;
// }




export async function fetchLocationId(locationName: string,access_token: string) {
  const url = `${process.env.NEXT_PUBLIC_GOOGLE_MY_BUSINESS}${locationName}:getInsights`;

  const body = {
    basicRequest: {
      metricRequests: [
        { metric: "VIEWS_SEARCH" },
        { metric: "VIEWS_MAPS" },
        { metric: "ACTIONS_WEBSITE" },
        { metric: "ACTIONS_PHONE" },
        { metric: "ACTIONS_DRIVING_DIRECTIONS" }
      ],
      timeRange: {
        startTime: "2025-07-01T00:00:00Z",
        endTime: "2025-07-31T23:59:59Z"
      }
    }
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`GMB API error: ${error}`);
  }

  const data = await res.json();
  return data;
}
// app/actions/fetchLocations.ts
export async function fetchLocations(
    accessToken: string,
//   accountId: string,
//   pageSize: number = 100,
//   pageToken?: string
) {
    console.log(accessToken,"accountId,accessToken");
  const baseUrl = `${process.env.NEXT_PUBLIC_GOOGLE_MY_BUSINESS_ACCOUNT}accounts`;
  const params = new URLSearchParams();
//   params.append("pageSize", pageSize.toString());
//   if (pageToken) params.append("pageToken", pageToken);

//   const url = `${baseUrl}?${params.toString()}`;

  const res = await fetch(baseUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error fetching locations: ${errorText}`);
  }

  const data = await res.json();
  console.log(data,"data in fetchLocations");
  return {
    locations: data.locations,
    
  };
}

