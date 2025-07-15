"use server";
import { getUserFromToken } from "@/app/utils/auth";
import { connectToDB } from "@/lib/db";
import Keyword from "@/lib/models/keyword.model";
import KeywordTracking from "@/lib/models/keywordTracking.model";
import { QRCode } from "antd";
import { getLocation_languageData } from "../locations_Language";
const username = process.env.NEXT_PUBLIC_DATAFORSEO_USERNAME;
const password = process.env.NEXT_PUBLIC_DATAFORSEO_PASSWORD;

interface campaignId {
  campaignId: string;
}
interface compaigntype {
  _id: string;
}
interface KeywordPayload {
  keyword: string;
  location_code: number;
  language_name: string;
  target: string;
}

interface KeywordResponse {
  keyword: string;
  response: any;
}

interface ErrorResponse {
  error: string;
}
export const refreshAddedKeywords = async (campaignId: string) => {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized" };
    }
    // console.log(user);
    console.log(campaignId, "refresh id");

    const refreshCampaign = await Keyword.find({ CampaignId: campaignId });

    console.log(refreshCampaign, "refreshed db data");
    const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");

    const payload: KeywordPayload[] = refreshCampaign.map(
      (keywordObj: any) => ({
        keyword: keywordObj.keywords,
        location_code: Number(keywordObj.searchLocationCode),

        language_name:
          keywordObj.language.charAt(0).toUpperCase() +
          keywordObj.language.slice(1).toLowerCase(),
        target: keywordObj.url,
        device: keywordObj.deviceType,
        se_domain: keywordObj.SearchEngine,
      })
    );

    console.log(payload, "refresh payload");
    const responses: KeywordResponse[] = [];

    for (const item of payload) {
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
        responses.push({ keyword: item.keyword, response: null });
      } else {
        const result = await res.json();

        responses.push({ keyword: item.keyword, response: result });
      }
    }
    console.log(responses, "refresh response Api");
    const createdRecords: any[] = [];
    const res = await getLocation_languageData();
    const locationData = res?.allLocations;
    responses.forEach((item: any) => {
      // console.log(item?.response?.tasks, "response a gyea task");

      item?.response?.tasks?.forEach((task: any) => {
        const keyword = task?.data?.keyword;

        const results = task?.result?.flatMap((data: any) => {
          // Find the matching keyword document
          const matchedKeyword = refreshCampaign.find(
            (addDataKeyword) => addDataKeyword.keywords === keyword
          );
          const matchLangName = locationData?.find((lang) => {
            return lang.locationCode === data?.location_code;
          });

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
              campaignId: campaignId,
              keywordId: matchedKeyword._id,
            },
          ];
        });

        if (results?.length) {
          createdRecords.push(...results);
        }
      });
    });

    console.log(createdRecords, "all refresh pushed ✅");

    const updatedRecords: any[] = [];

    for (const record of createdRecords) {
      const updated = await KeywordTracking.findOneAndUpdate(
        { keywordId: record.keywordId },
        { $set: record },
        { new: true, upsert: true }
      );

      if (updated) updatedRecords.push(updated);
    }

    console.log("refresh All records updated:", updatedRecords);

    if (!updatedRecords) {
      return { error: "Error while refreshing keyword" };
    }
    return {
      success: true,
      message: "Keyword Refresh Successfully",
      updatedRecords,
    };
  } catch (error) {
    console.log(error);

    return { error: "Internal Server Error." };
  }
};
