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
