"use server";
import { getUserFromToken } from "@/app/utils/auth";
import { connectToDB } from "@/lib/db";
import Campaign from "@/lib/models/campaign.model";
import Keyword from "@/lib/models/keyword.model";
import KeywordTracking from "@/lib/models/keywordTracking.model";
import Location from "@/lib/models/Location.model";

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
    console.log(newCompaignId, "newkeywordCampaign");
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
    console.log(LiveKeywordDbData, "live datat from db to table");

    //  add location in data
    // const newLiveKeywordDbData = await Promise.all(
    //   LiveKeywordDbData.map(async (item) => {
    //     const locationName = await fetchDBlocationData(item.location_code);
    //     console.log(item, "location map");
    //     return {
    //       ...item,
    //       location_name: locationName || "",
    //     };
    //   })
    // );
    const newLiveKeywordDbData = await Promise.all(
  LiveKeywordDbData.map(async (item) => {
    const locationName = await fetchDBlocationData(item.location_code);
    // console.log(item, "location map");

    const plainItem = item.toObject();  // convert to plain JS object

    return {
      ...plainItem,
      location_name: locationName || "",
    };
  })
);

    console.log(newLiveKeywordDbData, "realdata");

    if (!LiveKeywordDbData) {
      return { error: "Error while getting LiveKeywordDbData" };
    }
    // if (campaign) {
    return {
      success: true,
      message: "LiveKeywordDbData Successfully Found",
      newLiveKeywordDbData,
      // locationName,
    };
    // }
  } catch (error) {
    console.log(error);

    return { error: "Internal Server Error." };
  }
};
export const LiveKeywordDatabyKeyID = async (keywordId: string) => {
  try {
    await connectToDB();

    // const user = await getUserFromToken();
    // if (!user) {
    //   return { error: "Unauthorized" };
    // }
    // console.log(user);
    // console.log(newCompaignId,"newkeywordCampaign")

    const signleKeywordDbData = await KeywordTracking.find({
      keywordId: keywordId,
      status: 1,
    });
    console.log(signleKeywordDbData, "edit updq table data");

    //  add location in data
    // const newLiveKeywordDbData = await Promise.all(
    //   LiveKeywordDbData.map(async (item) => {
    //     const locationName = await fetchDBlocationData(item.location_code);
    //     console.log(item, "location map");
    //     return {
    //       ...item,
    //       location_name: locationName || "",
    //     };
    //   })
    // );
    const singleEditLiveKeywordDbData = await Promise.all(
  signleKeywordDbData.map(async (item) => {
    const locationName = await fetchDBlocationData(item.location_code);
    // console.log(item, "location map");

    const plainItem = item.toObject();  // convert to plain JS object

    return {
      ...plainItem,
      location_name: locationName || "",
    };
  })
);

    console.log(singleEditLiveKeywordDbData, "edit data");

    if (!signleKeywordDbData) {
      return { error: "Error while getting LiveKeywordDbData" };
    }
    // if (campaign) {
    return {
      success: true,
      message: "LiveKeywordDbData Successfully Found",
      singleEditLiveKeywordDbData,
      // locationName,
    };
    // }
  } catch (error) {
    console.log(error);

    return { error: "Internal Server Error." };
  }
};

export const fetchDBlocationData = async (locationcode: number) => {
  try {
    await connectToDB();

    // const user = await getUserFromToken();
    // if (!user) {
    //   return { error: "Unauthorized" };
    // }
    // console.log(user);
    // console.log(newCompaignId,"newkeywordCampaign")
    const locationName = await Location.findOne({
      locationCode: locationcode,
    });

    // console.log(campaignKeywords,"fromkeywordtracking")

    if (!locationName) {
      return { error: "Error while getting locationName" };
    }
    // if (campaign) {
    return {
      success: true,
      message: "locationName Successfully Found",
      locationName,
    };
    // }
  } catch (error) {
    console.log(error);

    return { error: "Internal Server Error." };
  }
};
export const getStartData = async (
  keywordId: string,
  newStartData: number
) => {
  try {
    await connectToDB();
    console.log(keywordId,newStartData,"data for start update") // 6879e81b47ed1758549aef75 2 data for start update
    
   
 
 const startUpdatedData = await KeywordTracking.findOneAndUpdate(
    { keywordId: keywordId },
    { $set: { start: newStartData } },
    { new: true }
  );
  console.log(startUpdatedData, "start updated data");

    if (!keywordId) {
      return { error: "Error while getting keywordId" };
    }

    return {
      success: true,
      message: "Start Successfully updated",
      startUpdatedData,
    };
  } catch (error) {
    console.log(error);

    return { error: "Internal Server Error." };
  }
};

// used for dashboard heading click function
export const firstCompaignData = async () => {
  try {
    await connectToDB();

    // const user = await getUserFromToken();
    // if (!user) {
    //   return { error: "Unauthorized" };
    // }
    // console.log(user);
    // console.log(newCompaignId,"newkeywordCampaign")
    const firstCompagin = await Campaign.findOne()
    console.log(firstCompagin,"first compaign")
     

    // console.log(campaignKeywords,"fromkeywordtracking")

    if (!firstCompagin) {
      return { error: "Error while getting First compaign" };
    }
    // if (campaign) {
    return {
      success: true,
      message: "First Compaign Successfully Found",
      firstCompagin,
    };
    // }
  } catch (error) {
    console.log(error);

    return { error: "Internal Server Error." };
  }
};