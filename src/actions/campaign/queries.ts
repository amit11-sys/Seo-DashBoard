"use server";
import { getUserFromToken } from "@/app/utils/auth";
import { connectToDB } from "@/lib/db";
import Campaign from "@/lib/models/campaign.model";
import Keyword from "@/lib/models/keyword.model";
import KeywordTracking from "@/lib/models/keywordTracking.model";
import User from "@/lib/models/user.model";

export const newCampaign = async (formData: any) => {
  try {
    await connectToDB();
    // console.log("finding user");

    const user = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized" };
    }
    // const nameExists = await Campaign.findOne({ campaignName: formData?.name });
    // const urlExists = await Campaign.findOne({ projectUrl: formData?.url });

    // if (nameExists) {
    //   return { error: "Campaign name must be unique" };
    // }
    // if (urlExists) {
    //   return { error: "Domain must be unique" };
    // }
    const campaign = await Campaign.create({
      //   data: {
      campaignName: formData?.name,
      projectUrl: formData?.url,
      userId: user?.id, // ✅ saving user ID here
      //   },
    });
    if (!campaign) {
      return { error: "Error while creating campaign" };
    }
    // if (campaign) {
    return {
      success: true,
      message: "Campaign Created successfully",
      campaign,
    };
    // }
  } catch (error) {
    console.log(error);

    return { error: "Internal Server Error." };
  }
};

export const getCampaign = async () => {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized" };
    }
    // console.log(user);

    // const campaign = await Campaign.find({ userId: user?.id });
    const campaign = await Campaign.find({
      userId: user?.id,
      status: 1,
    });
    if (!campaign) {
      return { error: "Error while getting campaign" };
    }
    // if (campaign) {
    return {
      success: true,
      message: "Campaign Successfully Found",
      campaign,
    };
    // }
  } catch (error) {
    console.log(error);

    return { error: "Internal Server Error." };
  }
};
export const GetCampaignByid = async (campaignId: string) => {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized" };
    }
    // console.log(user);

    // const campaign = await Campaign.find({ userId: user?.id });
    const campaign = await Campaign.findById({
      _id: campaignId,
    });
    if (!campaign) {
      return { error: "Error while getting Single with Id campaign" };
    }
    // if (campaign) {
    return {
      success: true,
      message: "Campaign Successfully Found with Id",
      campaign,
    };
    // }
  } catch (error) {
    console.log(error);

    return { error: "Internal Server Error." };
  }
};
export const CampaignStatus2 = async () => {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized" };
    }
    // console.log(user);

    // const campaign = await Campaign.find({ userId: user?.id });
    const allcampaignStatus2 = await Campaign.find({
      status: 2,
    });
    if (!allcampaignStatus2) {
      return { error: "Error while getting campaign" };
    }
    // if (campaign) {
    return {
      success: true,
      message: "Campaign Successfully Found",
      allcampaignStatus2,
    };
    // }
  } catch (error) {
    console.log(error);

    return { error: "Internal Server Error." };
  }
};

// export const deleteCampaign = async (CompaignId: string) => {
//   try {
//     await connectToDB();

//     const user = await getUserFromToken();
//     if (!user) {
//       return { error: "Unauthorized" };
//     }
//     console.log(CompaignId, "CompaignId delete");

//     const compaignDataDelete = await Campaign.findByIdAndUpdate({_id:CompaignId}, {
//       status: 2,
//     });

//     // const KeywordTrackingDataDelete = await KeywordTracking.findOne(
//     //   { campaignId: CompaignId },
//     //   { status: 2 }
//     // );

//     // const KeywordDataDelete = await Keyword.findOne(
//     //   { CampaignId: CompaignId },
//     //   { status: 2 }
//     // );

//     if (!CompaignId) {
//       return { error: " Not Find Id Error while deleting campaign" };
//     }
//     // if (campaign) {
//     return {
//       success: true,
//       message: "Campaign Successfully Deleted",
//       compaignDataDelete,
//       // KeywordTrackingDataDelete,
//       // KeywordDataDelete,
//     };
//     // }
//   } catch (error) {
//     console.log(error);

//     return { error: "Internal Server Error." };
//   }
// };
export const archivedCampaign = async () => {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized" };
    }

    const KeywordTrackingDataArchied = await Campaign.find({ status: 2 });

    if (!KeywordTrackingDataArchied) {
      return { error: " Not Find Id Error while deleting campaign" };
    }
    // if (campaign) {
    return {
      success: true,
      message: "Archived Campaign Successfully Found",
      // compaignDataDelete,
      KeywordTrackingDataArchied,
      // KeywordDataDelete,
    };
    // }
  } catch (error) {
    console.log(error);

    return { error: "Internal Server Error." };
  }
};
// export const ArchivedCampaignCreate = async (CompaignId: string,topRankData:any) => {
//   try {
//     await connectToDB();

//     const user = await getUserFromToken();
//     if (!user) {
//       return { error: "Unauthorized" };
//     }
//     console.log(topRankData, "topRankData in server");

//     const KeywordTrackingDataArchied = await Campaign.findByIdAndUpdate(
//       { _id: CompaignId},
//       { status: 2 }
//     );

//     const addedCompignData =await KeywordTracking.findOneAndUpdate(
//       { campaignId: CompaignId },
//       {topRankData}

//     )

//     console.log(addedCompignData,"addedCompignData ok");

//     if (!CompaignId) {
//       return { error: " Not Find data Error while Arching campaign" };
//     }
//     // if (campaign) {
//     return {
//       success: true,
//       message: "Archived Campaign Successfully Added",
//       // compaignDataDelete,
//       KeywordTrackingDataArchied,
//       // KeywordDataDelete,
//     };
//     // }
//   } catch (error) {
//     console.log(error);

//     return { error: "Internal Server Error." };
//   }
// };

export const ArchivedCampaignCreate = async (
  CompaignId: string,
  status: number,
  topRankData?: any
) => {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized" };
    }

    if (!CompaignId) {
      return { error: "Campaign ID is missing." };
    }

    console.log(topRankData, "topRankData in server");
    console.log(status, "statusin");

    // delete campaign
    if (status === 3) {
      const KeywordTrackingDataArchied = await Campaign.findByIdAndUpdate(
        { _id: CompaignId },
        { status: 3 }
      );
    }
    if (status === 3) {
      const updatedKeywords = await KeywordTracking.updateMany(
        { campaignId: CompaignId },
        { $set: { status: 3 } }
      );
    }

    // restore campaign
    if (status === 1) {
      await Campaign.findByIdAndUpdate(
        CompaignId,
        { status: 1 },
        { new: true }
      ).setOptions({ timestamps: false });

      await KeywordTracking.updateMany(
        { campaignId: CompaignId },
        { $set: { status: 1 } }
      ).setOptions({ timestamps: false });
    }

    // ARCHIVED campaign
    if (status === 2) {
      const KeywordTrackingDataArchied = await Campaign.findByIdAndUpdate(
        { _id: CompaignId },
        { status: 2 }
      );
    }
    if (status === 2) {
      const updatedKeywords = await KeywordTracking.updateMany(
        { campaignId: CompaignId },
        { $set: { status: 2 } }
      );
    }

    //  if(topRankData){

    //    const topRankUpdate = {
    //      keywordsUp: topRankData?.data?.find((item: any) => item.title === "Keywords Up")?.data || 0,
    //      top3: topRankData?.data?.find((item: any) => item.title === "In Top 3")?.data || 0,
    //      top10: topRankData?.data?.find((item: any) => item.title === "In Top 10")?.data || 0,
    //      top20: topRankData?.data?.find((item: any) => item.title === "In Top 20")?.data || 0,
    //      top30: topRankData?.data?.find((item: any) => item.title === "In Top 30")?.data || 0,
    //      top100: topRankData?.data?.find((item: any) => item.title === "In Top 100")?.data || 0,

    //    };
    //    console.log(topRankUpdate, "topRankUpdate");

    //    const updatedKeywordTracking = await KeywordTracking.updateMany(
    //      { campaignId: CompaignId },
    //      { $set: topRankUpdate },
    //       { new: true }
    //    );

    //  }

    return {
      success: true,
      message: "Archived Campaign Successfully",
      // KeywordTrackingDataArchied,
      CompaignId,
    };
  } catch (error) {
    console.error(error);
    return { error: "Internal Server Error." };
  }
};

export const CompaignCount = async () => {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized" };
    }

    const campaignCount = await Campaign.find({
      status: { $in: [1, 2] },
    });
    console.log(campaignCount, "campaignCount");
    return {
      success: true,
      message: "Campaign Count Successfully",
      campaignCount,
    };
  } catch (error) {
    console.error(error);
    return { error: "Internal Server Error." };
  }
};
