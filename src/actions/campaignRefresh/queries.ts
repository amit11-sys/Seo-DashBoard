import { getUserFromToken } from "@/app/utils/auth";
import { connectToDB } from "@/lib/db";
import Keyword from "@/lib/models/keyword.model";

interface campaignId {
    campaignId:string
}
export const refreshCampaign = async (campaignId:campaignId) => {
  
try {
     await connectToDB();
    
        const user = await getUserFromToken();
        if (!user) {
          return { error: "Unauthorized" };
        }
        // console.log(user);
        
        const refreshCampaign = await Keyword.find({ campaignId: campaignId });
        if (!refreshCampaign) {
          return { error: "Error while refresh campaign" };
        }
        // if (campaign) {
        return {
          success: true,
          message: "Campaign Successfully refresh",
          refreshCampaign
        };
    
} catch (error) {
    
     console.log(error);

    return { error: "Internal Server Error." };
}



}

