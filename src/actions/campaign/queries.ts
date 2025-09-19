"use server";
import { getUserFromToken } from "@/app/utils/auth";
import { connectToDB } from "@/lib/db";
import Campaign from "@/lib/models/campaign.model";
import Keyword from "@/lib/models/keyword.model";
import KeywordTracking from "@/lib/models/keywordTracking.model";
import User from "@/lib/models/user.model";
import { getRefreshGoogleAccessToken } from "../googleConsole";
import {
  googleAnalyticsAccountID,
  googleAnalyticsPropertyID,
} from "../analytics/queries";
// import { fetchLocations } from "../KeywordsGmb/queries";
import { refreshGoogleAccessToken } from "../googleConsole/queries";

export const newCampaign = async (formData: any) => {
  try {
    await connectToDB();
    // console.log("finding user");

    const user: any = await getUserFromToken();
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

    const user: any = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized please login" };
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

    // const user = await getUserFromToken();
    // if (!user) {
    //   return { error: "Unauthorized" };
    // }
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
      return { error: "Unauthorized please login" };
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
      return { error: "Unauthorized please login" };
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
        { status: 3 },
        { new: true }
      );
      const updatedKeywords = await KeywordTracking.updateMany(
        { campaignId: CompaignId },
        { $set: { status: 3 } }
      );
    }

    // restore campaign

    if (status === 1) {
      const KeywordTrackingDataArchied = await Campaign.findByIdAndUpdate(
        { _id: CompaignId },
        { status: 1 },
        { new: true }
      );

      const updatedKeywords = await KeywordTracking.updateMany(
        { campaignId: CompaignId, status: { $ne: 3 } }, // ✅ exclude status 3
        { $set: { status: 1 } }
      );
    }

    // ARCHIVED campaign
    if (status === 2) {
      const KeywordTrackingDataArchived = await Campaign.findByIdAndUpdate(
        { _id: CompaignId },
        { status: 2 },
        { new: true }
      );

      const updatedKeywords = await KeywordTracking.updateMany(
        { campaignId: CompaignId, status: { $ne: 3 } }, // ✅ exclude status 3
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
      return { error: "Unauthorized please login" };
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

type GoogleTokenResult = {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: "Bearer" | string;
  id_token: string;
  refresh_token_expires_in?: number;
};
export const DbCompaignDataUpdate = async (
  newCompaignId: string,
  tokenResult: {}
) => {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized" };
    }

    const {
      access_token,
      expires_in,
      refresh_token,
      id_token,
      refresh_token_expires_in,
    } = tokenResult as GoogleTokenResult;
    console.log(tokenResult, "tokenResultIN DB update");

    const now = Date.now();

    // convert to absolute timestamps (in ms)
    const googleAccessTokenExpiry = now + expires_in * 1000;
    const googleRefreshTokenExpiry =
      now + (refresh_token_expires_in ?? 0) * 1000;

    const campaignGoogleData = await Campaign.findByIdAndUpdate(
      { _id: newCompaignId },
      {
        $set: {
          googleAccessToken: access_token,
          googleAccessTokenExpiry: googleAccessTokenExpiry,
          googleRefreshToken: refresh_token,
          googleRefreshTokenExpiry: googleRefreshTokenExpiry,
          googleId_token: id_token,
        },
      },
      { new: true }
    );

// const campaignGoogleData = await Campaign.findByIdAndUpdate(
//   newCompaignId, // ✅ only ID
//   {
//     $set: {
//       googleAccessToken: access_token,
//       googleAccessTokenExpiry,
//       googleRefreshToken: refresh_token,
//       googleRefreshTokenExpiry,
//       googleId_token: id_token,
//     },
//   },
//   { new: true } // return updated doc
// );

console.log("Updated campaign:", campaignGoogleData);





    if (!campaignGoogleData) {
      return { error: "Error while getting and update compaign" };
    }

    return {
      success: true,
      message: "capmaignData Successfully updated with token",
      campaignGoogleData,
    };
  } catch (error) {
    console.log(error);

    return { error: "Internal Server Error." };
  }
};

export const DBcompaignGoogleData = async (newCompaignId: string) => {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized" };
    }

    const compaignGoogleData = await Campaign.findById({
      _id: newCompaignId,
    }).lean();

    // console.log(compaignGoogleData, "live datat from db with token");

    if (!compaignGoogleData) {
      return { error: "Error while getting compaign for token data" };
    }

    return {
      success: true,
      message: "compaign Google Data Successfully find",
      compaignGoogleData,
    };
  } catch (error) {
    console.log(error);

    return { error: "Internal Server Error." };
  }
};

// export async function getValidGoogleToken(campaignId: string) {
//   const campaign = await Campaign.findById({ _id: campaignId });

//   if (!campaign) throw new Error("Campaign not found");

//   // If expired, refresh token
//   if (Date.now() > Number(campaign.googleAccessTokenExpiry)) {
//     return await getRefreshGoogleAccessToken(campaignId);
//   }

//   return campaign;
// }

export async function getValidGoogleToken(campaignId: string) {
  const campaign = await Campaign.findById({ _id: campaignId });
  if (!campaign) throw new Error("Campaign not found");

  const now = Date.now();

  // If token is expired or missing → refresh it
  if (
    !campaign.googleAccessToken ||
    !campaign.googleAccessTokenExpiry ||
    now > Number(campaign.googleAccessTokenExpiry)
  ) {
    return await refreshGoogleAccessToken(campaignId);
  }

  // Otherwise return the campaign with the valid token
  return campaign;
}
export const CurrentCampaignIdData = async (campaignId: string) => {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized" };
    }

    const CurrentCampaignIdData = await Campaign.findById({ _id: campaignId });

    if (!campaignId) {
      return { error: "Error while getting campaign New Id" };
    }

    return {
      success: true,
      message: "New CompaignId Successfully Found",
      CurrentCampaignIdData,
    };
  } catch (error) {
    console.log(error);

    return { error: "Internal Server Error." };
  }
};
type Property = {
  name: string;
  displayName: string;
  parent: string;
};

function findMatchingProperty(
  properties: Property[],
  accountId: string,
  nameMatch: string
): Property[] {
  const normalizedName = nameMatch.replace(/\s+/g, "").toLowerCase();

  return properties.filter((property) => {
    const normalizedDisplayName = property.displayName
      .replace(/\s+/g, "")
      .toLowerCase();
    return (
      property.parent.endsWith(accountId) &&
      normalizedDisplayName.includes(normalizedName)
    );
  });
}
function extractDomain(url: string): string | null {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname; // e.g. 'www.handonawhiteboard.com'
    const parts = hostname.split(".");
    // Drop 'www' or subdomain if present
    return parts.length > 2 ? parts[parts.length - 2] : parts[0];
  } catch {
    return null;
  }
}
export const propertyIdForDB = async (
  campaignId: string,
  tokenResult: {},
  nameMatch: any
) => {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized" };
    }

    // console.log(campaignId,"campaignId in propertyId");
    // console.log(tokenResult,"tokenResult in propertyId");
    // console.log(nameMatch,"campaignData in propertyId");

    const { access_token } = tokenResult as GoogleTokenResult;

    const acoountNameforMatch = extractDomain(nameMatch);

    console.log(acoountNameforMatch,"acoountNameforMatch in propertyId");

    const data = await googleAnalyticsAccountID(
      access_token,
      acoountNameforMatch ?? ""
    );
console.log(data,"data in propertyId");
    // console.log(data,"data in propertyId");
    const accountId = Array.isArray(data)
      ? data[0]?.accountId
      : (data?.accountId ?? "");


    console.log(accountId, "accountId in propertyId");

    // const location = await fetchLocations(access_token);

    // console.log(location, "locaion in propertyId");

    const propertiesID = await googleAnalyticsPropertyID(
      accountId,
      access_token,
      acoountNameforMatch ?? ""
    );

    console.log(propertiesID,"propertiesID in propertyId");

    //  const propertyId = propertiesID[0]?.name ?? "";

    const propertyId = propertiesID.split("/")[1];

    // console.log(propertyId,"proepertyId in propertyId");

    const campaignDataWithPropertyIdData = await Campaign.findByIdAndUpdate(
      { _id: campaignId },
      { $set: { propertyId: propertyId,accountId:accountId } },
      { new: true }
    );
    console.log(campaignDataWithPropertyIdData,"campaignDataWithPropertyIdData in propertyId");

    return {
      success: true,
      message: "New CompaignData with propertyId Successfully Found",
      campaignDataWithPropertyIdData,
    };
  } catch (error) {
    console.log(error);

    return { error: "Internal Server Error." };
  }
};
