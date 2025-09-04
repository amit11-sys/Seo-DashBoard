"use server";

import { getDbTopLiveKeywordData } from "../keywordTracking";

// Haversine distance (miles)
function getDistanceFromLatLonInMi(lat1: number, lon1: number, lat2: number, lon2: number): string {
  const R = 3958.8; // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(2);
}

export async function MapsData(
// formData:any
) {
  try {
    const username = process.env.NEXT_PUBLIC_DATAFORSEO_USERNAME as string;
    const password = process.env.NEXT_PUBLIC_DATAFORSEO_PASSWORD as string;
    const auth = Buffer.from(`${username}:${password}`).toString("base64");


    // const keyworddata = await getDbTopLiveKeywordData()
    // const campignFristData = keyworddata?.TopLiveKeywordDbData?.[0]
    // Build request payload
    const payload = [
      {
        keyword :"custom bathroom remodeling fort wayne"  ,
        location_code: 1017108 , 
        language_code: "en",
        device: "desktop",
      },
    ];

    // Call DataForSEO
    const res = await fetch(
      "https://api.dataforseo.com/v3/serp/google/maps/live/advanced",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      }
    );

    const apiRes = await res.json();

    const task = apiRes.tasks?.[0];
    const result = task?.result?.[0];
    if (!result) throw new Error("No results found");

    const items = result.items || [];
    const center = items[0]; // pick first result as "center"
    const centerLat = center?.latitude || 0;
    const centerLng = center?.longitude || 0;

    // Transform into custom JSON format
    const transformed = {
      status: 1,
      mapzoom: 12,
      keyword:"custom bathroom remodeling fort wayne",
      lat: centerLat,
      long: centerLng,
      title: center?.rank_group || 0,
      firstImageUrl:
        "https://seomavericks.agencydashboard.io/public/images/green.svg",
      graphLatLong: items.map((item: any) => ({
        lat: item.latitude,
        lng: item.longitude,
        title: item.rank_group,
        image:
          item.rank_group <= 3
            ? "https://seomavericks.agencydashboard.io/public/images/green.svg"
            : item.rank_group <= 10
            ? "https://seomavericks.agencydashboard.io/public/images/orange.svg"
            : "https://seomavericks.agencydashboard.io/public/images/red.svg",
        distance: getDistanceFromLatLonInMi(
          centerLat,
          centerLng,
          item.latitude,
          item.longitude
        ),
        id: `https://google.com/maps/search/${encodeURIComponent(
          "custom bathroom remodeling fort wayne"
        )}/@${item.latitude},${item.longitude},12z?hl=en&gl=US`,
      })),
      id: result.check_url,
      pendingSync: 0,
    };

    console.log(transformed, "transformed");
    // return transformed;
  } catch (err: any) {
    console.error("DataForSEO Error:", err.message);
    return { status: 0, error: err.message };
  }
}
