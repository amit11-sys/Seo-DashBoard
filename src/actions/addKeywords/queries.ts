import { getUserFromToken } from "@/app/utils/auth";
import { connectToDB } from "@/lib/db";
import Keyword from "@/lib/models/keyword.model";
import KeywordTracking from "@/lib/models/keywordTracking.model";
import { getDbLiveKeywordData } from "../keywordTracking";
interface KeywordPayload {
  keyword: string;
  location_name: string;
  language_name: string;
}
interface KeywordResponse {
  keyword: string;
  response: any;
}

interface ErrorResponse {
  error: string;
}
const username = process.env.NEXT_PUBLIC_DATAFORSEO_USERNAME;
const password = process.env.NEXT_PUBLIC_DATAFORSEO_PASSWORD;
export const addkeywords = async (formData: any) => {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized" };
    }
    console.log(formData, "formdata");
    const campaignId = formData?.campaignId?.campaignId; // ✅ FIXED
    console.log(campaignId, "formdat id");
    const { keywords, ...rest } = formData;

    const newAddKeyword = await Promise.all(
      keywords.map(async (singleKeyword: string) => {
        return await Keyword.create({
          ...rest,
          keywords: singleKeyword,
          userId: user.id,
          CampaignId: campaignId, // ✅ FIXED
        });
      })
    );

    console.log(newAddKeyword,"response a gyea")
    // const
    const payload: KeywordPayload[] = newAddKeyword.map((keywordObj: any) => ({
      keyword: keywordObj.keywords,
      location_name:
        keywordObj.searchLocation.charAt(0).toUpperCase() +
        keywordObj.searchLocation.slice(1).toLowerCase(),
      language_name:
        keywordObj.language.charAt(0).toUpperCase() +
        keywordObj.language.slice(1).toLowerCase(),
      target: keywordObj.url,
    }));
    console.log(payload, "new payload");
    const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");
    const responses: any = [];
    for (const item of payload) {
      //  `${process.env.NEXT_PUBLIC_API_URL}${"serp/google/organic/live/advanced"}`,
      const res = await fetch(
        "https://api.dataforseo.com/v3/serp/google/organic/live/advanced",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${basicAuth}`,
          },
          body: JSON.stringify([item]),
        }
      );

      if (!res.ok) {
        const errorBody = await res.text();
        console.error(
          `Request failed for ${item.keyword}: ${res.status} - ${errorBody}`
        );
        responses.push({ keyword: item.keyword, response: null });
      } else {
        const result = await res.json();

        responses.push({ keyword: item.keyword, response: result });
      }
    }

    console.log(responses.response, "response a gyea ");

    const createdRecords: any[] = [];

    responses.forEach((item: any) => {
      console.log(item?.response?.tasks, "response a gyea task");

      item?.response?.tasks?.forEach((task: any) => {
        const keyword = task?.data?.keyword;

        const results = task?.result?.map((data: any) => {
          return {
            type: task?.data?.se_type,
            location_code: data?.location_code || 2124,
            language_code: data?.language_code || "en",
            location_name: task?.data?.location_name || "",
            url: task?.data?.target || "no ranking",
            rank_group: data?.items?.[0]?.rank_group || 0,
            rank_absolute: data?.items?.[0]?.rank_absolute || 0,
            keyword: keyword || "",
            campaignId: campaignId,
          };
        });

        // ✅ Push each record from the results array
        if (results?.length) {
          createdRecords.push(...results); // spread to avoid nested arrays
        }
      });
    });

    console.log(createdRecords, "all records pushed ✅");

    console.log(createdRecords, "one keyword add");

    const addedKeywords = await KeywordTracking.insertMany(createdRecords);

    return {
      success: true,
      message: "New keywords successfully added",
      addedKeywords,
    };
  } catch (error) {
    console.log(error);
    return { error: "Internal Server Error." };
  }
};
