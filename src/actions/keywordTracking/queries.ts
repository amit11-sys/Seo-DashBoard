import { getUserFromToken } from "@/app/utils/auth";
import { connectToDB } from "@/lib/db";
import Keyword from "@/lib/models/keyword.model";
import KeywordTracking from "@/lib/models/keywordTracking.model";

export const createKeywordTracking = async (keywordData: any) => {
  try {
   await connectToDB();

const user = await getUserFromToken();
// console.log(user, "user");

if (!user) {
  return { error: "Unauthorized" };
}

const createdRecords = [];

for (const element of keywordData) {
  createdRecords.push({
    type: "organic",
    location_code: 2124,
    language_code: "en",
    url:
      element?.Response?.items?.[0]?.url ||
      "https://www.handonawhiteboard.com/locations/toronto",
    rank_group: element?.Response?.items?.[0]?.rank_group || 2,
    rank_absolute: element?.Response?.items?.[0]?.rank_absolute || 1,
    keyword: element?.Keyword || "",
  });
}


const KeywordTrackingData = await KeywordTracking.insertMany(createdRecords);

return {
  success: true,
  message: "KeywordTrackingData Successfully created",
  KeywordTrackingData,
};

if (createdRecords.length === 0) {
  return { error: "Error while creating KeywordTrackingData" };
}

return {
  success: true,
  message: "KeywordTrackingData Successfully created",
  KeywordTrackingData: createdRecords,
};

  } catch (error) {
    console.log(error);

    return { error: "Internal Server Error." };
  }
};

// interface getUserKeywordData {
//     newCompaignId:String,
// }

export const getUserKeywordData = async (newCompaignId: any) => {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized" };
    }
    // console.log(user);
    // console.log(newCompaignId,"newkeywordCampaign")
    const campaignKeywords = await Keyword.find({
      CampaignId: newCompaignId?.CampaignId,
    });

    // console.log(campaignKeywords,"fromkeywordtracking")

    if (!campaignKeywords) {
      return { error: "Error while getting keywords" };
    }
    // if (campaign) {
    return {
      success: true,
      message: "keyword Successfully Found",
      campaignKeywords,
    };
    // }
  } catch (error) {
    console.log(error);

    return { error: "Internal Server Error." };
  }
};
