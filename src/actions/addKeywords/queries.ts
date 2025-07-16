import { getUserFromToken } from "@/app/utils/auth";
import { connectToDB } from "@/lib/db";
import Keyword from "@/lib/models/keyword.model";
import KeywordTracking from "@/lib/models/keywordTracking.model";
import { getDbLiveKeywordData } from "../keywordTracking";
import { getLocation_languageData } from "../locations_Language";
interface KeywordPayload {
  keyword: string;
  location_code: number;
  language_name: string;
}
interface KeywordResponse {
  keyword: any;
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
    // console.log(formData, "formdata");
    const campaignId = formData?.campaignId?.campaignId; // ✅ FIXED
    // console.log(campaignId, "formdat id");
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

    // console.log(newAddKeyword,"response for id")
    // const
    // const payload: KeywordPayload[] = newAddKeyword.map((keywordObj: any) => ({
    //   keyword: keywordObj.keywords,
    //   location_code:Number(keywordObj.searchLocationCode),
       
    //   language_name:
    //     keywordObj.language.charAt(0).toUpperCase() +
    //     keywordObj.language.slice(1).toLowerCase(),
    //   target: keywordObj.url,
    // device:keywordObj.deviceType,
    //    se_domain:keywordObj.SearchEngine

    // }));
      const rankPayload: KeywordPayload[] = newAddKeyword.map((keywordObj: any) => ({
      keyword: keywordObj.keywords,
      location_code: Number(keywordObj.searchLocationCode),
      language_name: keywordObj.language,
      target: keywordObj.url,
      device: keywordObj.deviceType,
      se_domain: keywordObj.SearchEngine,
    }));
    const volumnPayload = newAddKeyword.map((keywordObj: any) => ({
      keywords: [keywordObj.keywords],
      location_code: Number(keywordObj.volumeLocationCode),
      language_name: keywordObj.language,
      target: keywordObj.url,
      device: keywordObj.deviceType,
      se_domain: keywordObj.SearchEngine,
    }));

    // console.log(payload, "new payload");
    const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");


      const rankResponses: KeywordResponse[] = [];
    const volumnResponses: KeywordResponse[] = [];

     for (const item of rankPayload) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DATAFORSEO_URL}${"serp/google/organic/live/advanced"}`,
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
        rankResponses.push({ keyword: item.keyword, response: null });
      } else {
        const result = await res.json();

        rankResponses.push({ keyword: item.keyword, response: result });
      }
    }
    for (const item of volumnPayload) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DATAFORSEO_URL}${"keywords_data/google/search_volume/live"}`,
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
          `Request failed for ${item.keywords}: ${res.status} - ${errorBody}`
        );
        volumnResponses.push({ keyword: item.keywords, response: null });
      } else {
        const result = await res.json();

        volumnResponses.push({ keyword: item.keywords, response: result });
      }
    }
    // console.log(responses.response, "response a gyea ");

    const createdRecords: any[] = [];
const res = await getLocation_languageData();
          const locationData = res?.allLocations;
     

 volumnResponses.forEach((vol) => {
      rankResponses.forEach((item: any) => {
        console.log(item?.response?.tasks, "response a gyea task");

        item?.response?.tasks?.forEach((task: any) => {
          const keyword = task?.data?.keyword;

          const results = task?.result?.flatMap((data: any) => {
            console.log(task?.result, "locations check");

            // Find the matching keyword document
            const matchedKeyword = newAddKeyword.find(
              (newAddKeyword) => newAddKeyword.keywords === keyword
            );

            const matchLangName = locationData?.find(
              (lang) => lang.locationCode === data?.location_code
            );

            // Find the corresponding search volume for the keyword and location
            const matchSearchVolumn =
              vol?.response?.tasks?.flatMap((vTask: any) =>
                vTask?.result?.filter(
                  (volData: any) =>
                    volData.keyword === keyword &&
                    volData.location_code === data?.location_code
                )
              )[0]?.search_volume || 0;
            const matchcompetition =
              vol?.response?.tasks?.flatMap((vTask: any) =>
                vTask?.result?.filter(
                  (volData: any) =>
                    volData.keyword === keyword &&
                    volData.location_code === data?.location_code
                )
              )[0]?.competition || 0;

            console.log(matchedKeyword, "during campaign match data");

            return [
              {
                type: task?.data?.se_type,
                location_code: data?.location_code || 2124,
                language_code: data?.language_code || "en",
                location_name: matchLangName?.locationName || "",
                url: task?.data?.target || "no ranking",
                rank_group: data?.items?.[0]?.rank_group || 0,
                rank_absolute: data?.items?.[0]?.rank_absolute || 0,
                keyword: keyword || "",
                searchVolumn: matchSearchVolumn,
                competition: matchcompetition,
                // SearchEngine:  task?.data?.se_domain,
                // language: task?.data?.language_name,
                // deviceType:task?.data?.device,
                campaignId: campaignId,
                keywordId: matchedKeyword?._id,
              },
            ];
          });

          if (results?.length) {
            createdRecords.push(...results);
          }
        });
      });
    });


    // console.log(createdRecords, "all records pushed ✅");

    // console.log(createdRecords, "one keyword add");

    const addedKeywords = await KeywordTracking.insertMany(createdRecords);
    // console.log(addedKeywords,"return keywrods")

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
