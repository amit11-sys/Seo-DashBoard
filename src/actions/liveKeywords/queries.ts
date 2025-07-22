import { getUserFromToken } from "@/app/utils/auth";
import { connectToDB } from "@/lib/db";
import { getTrackingData } from "../keywordTracking";
import Campaign from "@/lib/models/campaign.model";
import keworddata from  "@/lib/KeywordApi.json"

const username = process.env.NEXT_PUBLIC_DATAFORSEO_USERNAME;
const password = process.env.NEXT_PUBLIC_DATAFORSEO_PASSWORD;

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

export const getLiveData = async (
  CampaignId: string
): Promise<KeywordResponse[] | ErrorResponse> => {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized" };
    }

    const keywordsData = await getTrackingData({ CampaignId });

    if (!keywordsData?.campaignKeywords?.length) {
      return { error: "No keywords found" };
    }

    const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");

    const payload: KeywordPayload[] = keywordsData.campaignKeywords.map(
      (keywordObj: any) => ({
        keyword: keywordObj?.keywords,
        location_name:
          keywordObj?.searchLocation?.charAt(0).toUpperCase() +
          keywordObj.searchLocation?.slice(1).toLowerCase(),
        language_name:
          keywordObj?.language?.charAt(0).toUpperCase() +
          keywordObj.language?.slice(1).toLowerCase(),
          target: keywordObj?.url,

      })
    );
// console.log(payload,"livekeywordspayload")

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

    // console.log(responses,"api ka response") 
    return responses;
  } catch (error) {
    console.error(error);
    return { error: "Internal Server Error." };
  }
};

export const getUserKeywordData = async () => {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    // console.log(user,"user")

    if (!user) {
      return { error: "Unauthorized" };
    }
    // console.log(user);

    const keywordData = await Campaign.find({ userId: user?.id });

    // console.log(keywordData,"keyworddata")

    if (!keywordData) {
      return { error: "Error while getting UserKeywordData" };
    }
    // if (UserKeywordData) {
    return {
      success: true,
      message: "UserKeywordData Successfully Found",
      keywordData,
    };
    // }
  } catch (error) {
    console.log(error);

    return { error: "Internal Server Error." };
  }
};
