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

    if (!user) {
      return { error: "Unauthorized" };
    }

    console.log(keywordData, "createlivedata");

    const createdRecords: any[] = [];

    keywordData.forEach((item: any) => {
      const keyword = item?.keyword;
      const campaignId = item?.campaignId;

      const task = item?.response?.[0]; // Access first task
      const result = task?.result?.[0]; // Access first result
      const resultItem = result?.items?.[0]; // Access first item
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



export const getUserKeywordData = async (newCompaignId: any) => {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized" };
    }
    console.log(newCompaignId, "newkeywordCampaign");
    const campaignKeywords = await Keyword.find({
      CampaignId: newCompaignId?.CampaignId,
    });


    if (!campaignKeywords) {
      return { error: "Error while getting keywords" };
    }
    return {
      success: true,
      message: "keyword Successfully Found",
      campaignKeywords,
    };
    
  } catch (error) {
    console.log(error);

    return { error: "Internal Server Error." };
  }
};

export const DbLiveKeywordData = async (newCompaignId: string) => {
  try {
    await connectToDB();

   

    const LiveKeywordDbData = await KeywordTracking.find({
      campaignId: newCompaignId,
      status: 1,
    }).populate('campaignId');
  

    console.log(LiveKeywordDbData,"populatedata");
    const cardCounts = {
      top3: 0,
      top10: 0,
      top20: 0,
      top30: 0,
      top100: 0,
    };

    LiveKeywordDbData.forEach((keyword) => {
      const rank = keyword.rank_group;

      if (rank > 0 && rank <= 3) cardCounts.top3 += 1;
      if (rank > 0 && rank <= 10) cardCounts.top10 += 1;
      if (rank > 0 && rank <= 20) cardCounts.top20 += 1;
      if (rank > 0 && rank <= 30) cardCounts.top30 += 1;
      if (rank > 0 && rank <= 100) cardCounts.top100 += 1;
    });

    // Format for card
    const topRankData = {
      title: "Keywords",
      data: [

        {
          title: "Keywords Up",
          data: cardCounts?.top100,
          id: 1,
        },
        {
          title: "In Top 3",
          data: cardCounts.top3,
          id: 2,
        },
        {
          title: "In Top 10",
          data: cardCounts.top10,
          id: 3,
        },
        {
          title: "In Top 20",
          data: cardCounts.top20,
          id: 4,
        },
        {
          title: "In Top 30",
          data: cardCounts.top30,
          id: 5,
        },
        {
          title: "In Top 100",
          data: cardCounts.top100,
          id: 6,
        },
      ],
      totalKeywords: LiveKeywordDbData.length,
      type: "card",
    };

  
    const newLiveKeywordDbData = await Promise.all(
      LiveKeywordDbData.map(async (item) => {
        const locationName = await fetchDBlocationData(item.location_code);

        const plainItem = item.toObject(); // convert to plain JS object

        return {
          ...plainItem,
          location_name: locationName || "",
        };
      })
    );


    if (!LiveKeywordDbData) {
      return { error: "Error while getting LiveKeywordDbData" };
    }
    return {
      success: true,
      message: "LiveKeywordDbData Successfully Found",
      newLiveKeywordDbData,
      topRankData,
    };
   
  } catch (error) {
    console.log(error);

    return { error: "Internal Server Error." };
  }
};
export const LiveKeywordDatabyKeyID = async (keywordId: string) => {
  try {
    await connectToDB();

  

    const signleKeywordDbData = await KeywordTracking.find({
      keywordId: keywordId,
      status: 1,
    });
    console.log(signleKeywordDbData, "edit updq table data");

    
    const singleEditLiveKeywordDbData = await Promise.all(
      signleKeywordDbData.map(async (item) => {
        const locationName = await fetchDBlocationData(item.location_code);

        const plainItem = item.toObject(); // convert to plain JS object

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
    return {
      success: true,
      message: "LiveKeywordDbData Successfully Found",
      singleEditLiveKeywordDbData,
    };
   
  } catch (error) {
    console.log(error);

    return { error: "Internal Server Error." };
  }
};

export const fetchDBlocationData = async (locationcode: number) => {
  try {
    await connectToDB();

  
    const locationName = await Location.findOne({
      locationCode: locationcode,
    });


    if (!locationName) {
      return { error: "Error while getting locationName" };
    }
    return {
      success: true,
      message: "locationName Successfully Found",
      locationName,
    };
    
  } catch (error) {
    console.log(error);

    return { error: "Internal Server Error." };
  }
};
export const getStartData = async (keywordId: string, newStartData: number) => {
  try {
    await connectToDB();
    console.log(keywordId, newStartData, "data for start update"); // 6879e81b47ed1758549aef75 2 data for start update

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

   
    const firstCompagin = await Campaign.findOne();
    

    if (!firstCompagin) {
      return { error: "Error while getting First compaign" };
    }
    return {
      success: true,
      message: "First Compaign Successfully Found",
      firstCompagin,
    };
  
  } catch (error) {
    console.log(error);

    return { error: "Internal Server Error." };
  }
};
export const editDataFetchDb = async (keywordId: string) => {
  try {
    await connectToDB();

    
    const keywordsData = await Keyword.findOne({ _id: keywordId });


    if (!keywordsData) {
      return { error: "Error while getting fetch keyword" };
    }
    return {
      success: true,
      message: "data Successfully Found for edit ",
      keywordsData,
    };
   
  } catch (error) {
    console.log(error);

    return { error: "Internal Server Error." };
  }
};

export const topKewordsData = async (campaignId: string) => {
  try {
    await connectToDB();

  
    const topRankkeywordsData = await KeywordTracking.find({
      campaignId: campaignId,
    });


    if (!topRankkeywordsData) {
      return { error: "Error while getting fetch keyword" };
    }
    return {
      success: true,
      message: "Top ranking keywords Successfully Found",
      topRankkeywordsData,
    };
    
  } catch (error) {
    console.log(error);

    return { error: "Internal Server Error." };
  }
};
export const DbTopLiveKeywordData = async () => {
  try {
    await connectToDB();

    const TopLiveKeywordDbData = await KeywordTracking.find();

   

    if (!TopLiveKeywordDbData) {
      return { error: "Error while getting LiveKeywordDbData" };
    }
    // if (campaign) {
    return {
      success: true,
      message: "TopLiveKeywordDbData Successfully Found",
      TopLiveKeywordDbData,
    };
    // }
  } catch (error) {
    console.log(error);

    return { error: "Internal Server Error." };
  }
};
export const DbKeywordStatusData = async (statusCode: number) => {
  try {
    await connectToDB();

    // 1. Get all campaigns with given status
    const campaignDatastatus = await Campaign.find({ status: statusCode });

    if (!campaignDatastatus || campaignDatastatus.length === 0) {
      return { error: "No campaigns found for given status." };
    }

    // 2. Extract campaign IDs
    const campaignIds = campaignDatastatus.map((c) => c._id);
    // 3. Get keyword data related to those campaign IDs
    const keywordDatastatus = await KeywordTracking.find({
      campaignId: { $in: campaignIds },
      status:1,
     
    });
    console.log(keywordDatastatus,"keywordDatastatus");

    return {
      success: true,
      message: "Status Data Successfully Found",
      campaignDatastatus,
      keywordDatastatus,
    };
  } catch (error) {
    console.error(error);
    return { error: "Internal Server Error." };
  }
};
