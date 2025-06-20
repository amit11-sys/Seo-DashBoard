import { getUserFromToken } from "@/app/utils/auth";
import { connectToDB } from "@/lib/db";
import Campaign from "@/lib/models/campaign.model";
import Keyword from "@/lib/models/keyword.model";
import User from "@/lib/models/user.model";
export const saveKeyword=async (keyword:string)=>{
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
        const addKeyword = await Keyword.create({
          //   data: {
            keyword,
          userId: user?.id, // ✅ saving user ID here
          //   },
        });
        if (!addKeyword) {
          return { error: "Error while adding keyword" };
        }
        // if (campaign) {
        return {
          success: true,
          message: "Keyword Added Successfully",
        };
        // }
      } catch (error) {
        console.log(error);
    
        return { error: "Internal Server Error." };
      }
}

export const saveMultipleKeyword=async (keyword:[])=>{
    try {
        await connectToDB();
        const user = await getUserFromToken();
        if (!user) {
          return { error: "Unauthorized" };
        }
        const addKeyword = await Keyword.create({
            keyword,
          userId: user?.id,
        });
        if (!addKeyword) {
          return { error: "Error while adding keyword" };
        }
        return {
          success: true,
          message: "Keyword Added Successfully",
        };
      } catch (error) {
        console.log(error);
    
        return { error: "Internal Server Error." };
      }
}