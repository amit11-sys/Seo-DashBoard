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

export const deleteCampaign = async (CompaignId: string) => {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized" };
    }
    console.log(CompaignId, "CompaignId delete");

    const compaignDataDelete = await Campaign.findByIdAndUpdate({_id:CompaignId}, {
      status: 2,
    });

    const KeywordTrackingDataDelete = await KeywordTracking.findOne(
      { campaignId: CompaignId },
      { status: 2 }
    );

    const KeywordDataDelete = await Keyword.findOne(
      { CampaignId: CompaignId },
      { status: 2 }
    );

    

    if (!CompaignId) {
      return { error: " Not Find Id Error while deleting campaign" };
    }
    // if (campaign) {
    return {
      success: true,
      message: "Campaign Successfully Deleted",
      compaignDataDelete,
      KeywordTrackingDataDelete,
      KeywordDataDelete,
    };
    // }
  } catch (error) {
    console.log(error);

    return { error: "Internal Server Error." };
  }
};
export const archivedCampaign = async (CompaignId: string) => {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized" };
    }
    console.log(CompaignId, "CompaignId delete");

    

    const KeywordTrackingDataDelete = await KeywordTracking.find(
      { status: 2}
    );

   

    

    if (!CompaignId) {
      return { error: " Not Find Id Error while deleting campaign" };
    }
    // if (campaign) {
    return {
      success: true,
      message: "Campaign Successfully Deleted",
      // compaignDataDelete,
      KeywordTrackingDataDelete,
      // KeywordDataDelete,
    };
    // }
  } catch (error) {
    console.log(error);

    return { error: "Internal Server Error." };
  }
};

