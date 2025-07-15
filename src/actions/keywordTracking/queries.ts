"use server";
import { getUserFromToken } from "@/app/utils/auth";
import { connectToDB } from "@/lib/db";
import Keyword from "@/lib/models/keyword.model";
import KeywordTracking from "@/lib/models/keywordTracking.model";
import mongoose from "mongoose";

export const createKeywordTracking = async (keywordData: any) => {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    // console.log(user, "user");

    if (!user) {
      return { error: "Unauthorized" };
    }

    console.log(keywordData, "createlivedata");

    const createdRecords: any[] = [];
    //  console.log(keywordData,"new")

    keywordData.forEach((item: any) => {
      const keyword = item?.keyword;
      const campaignId = item?.campaignId;

      const task = item?.response?.[0]; // Access first task
      const result = task?.result?.[0]; // Access first result
      const resultItem = result?.items?.[0]; // Access first item
      // console.log(task,"task")
      const record = {
        type: "organic",
        location_code: result?.location_code || 2124,
        language_code: result?.language_code || "en",
        location_name: task?.data?.location_name || "",
        url: resultItem?.url || "no ranking",
        rank_group: resultItem?.rank_group || 0,
        rank_absolute: resultItem?.rank_absolute || 0,
        keyword: keyword || "",
        campaignId: campaignId,
        keywordId: item,
      };

      createdRecords.push(record);
    });

    console.log(createdRecords, "orignal");

    const KeywordTrackingData =
      await KeywordTracking.insertMany(createdRecords);

    return {
      success: true,
      message: "KeywordTrackingData Successfully created",
      KeywordTrackingData,
    };

    // if (createdRecords.length === 0) {
    //   return { error: "Error while creating KeywordTrackingData" };
    // }

    // return {
    //   success: true,
    //   message: "KeywordTrackingData Successfully created",
    //   KeywordTrackingData: createdRecords,
    // };
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
    console.log(newCompaignId,"newkeywordCampaign")
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

export const DbLiveKeywordData = async (newCompaignId: string) => {
  try {
    await connectToDB();

    // const user = await getUserFromToken();
    // if (!user) {
    //   return { error: "Unauthorized" };
    // }
    // console.log(user);
    // console.log(newCompaignId,"newkeywordCampaign")
    const LiveKeywordDbData = await KeywordTracking.find({
      campaignId: newCompaignId,
      status: 1,
    });

    // console.log(campaignKeywords,"fromkeywordtracking")

    if (!LiveKeywordDbData) {
      return { error: "Error while getting LiveKeywordDbData" };
    }
    // if (campaign) {
    return {
      success: true,
      message: "LiveKeywordDbData Successfully Found",
      LiveKeywordDbData,
    };
    // }
  } catch (error) {
    console.log(error);

    return { error: "Internal Server Error." };
  }
};
