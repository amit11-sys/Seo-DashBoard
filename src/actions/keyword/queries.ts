import { useCampaignData } from "@/app/context/CampaignContext";
import { getUserFromToken } from "@/app/utils/auth";
import { connectToDB } from "@/lib/db";
import Keyword from "@/lib/models/keyword.model";
import User from "@/lib/models/user.model";
import { getUserCampaign } from "../campaign";
// export const saveKeyword = async (keyword: {}) => {
//   try {
//     await connectToDB();
//     // console.log("finding user");

//     const user = await getUserFromToken();
//     if (!user) {
//       return { error: "Unauthorized" };
//     }
//     // const nameExists = await Campaign.findOne({ campaignName: formData?.name });
//     // const urlExists = await Campaign.findOne({ projectUrl: formData?.url });

//     // if (nameExists) {
//     //   return { error: "Campaign name must be unique" };
//     // }
//     // if (urlExists) {
//     //   return { error: "Domain must be unique" };
//     // }
//     const addKeyword = await Keyword.create({
//       //   data: {
//       ...keyword,
//       userId: user?.id, // ✅ saving user ID here
//       //   },
//     });
//     console.log("addkeuwords", addKeyword);
//     if (!addKeyword) {
//       return { error: "Error while adding keyword" };
//     }
//     // if (campaign) {
//     return {
//       success: true,
//       message: "Keyword Added Successfully",
//     };
//     // }
//   } catch (error) {
//     console.log(error);

//     return { error: "Internal Server Error." };
//   }
// };
interface compaigntype {
  _id: string;
}

export const saveMultipleKeyword = async (
  formData: any,
  campaign: compaigntype
) => {
  // console.log("formData", formData);
  // const convertdFormdata = [formData].map((c) => {
  //   console.log("convertdFormdata", c);
  //   return {
  //     name: c.name.toString(),
  //     url: "https://www.asd.com/",
  //     keywordTag: "GOGGOed",
  //     SearchEngine: "",
  //     searchLocation: "",
  //     volumeLocation: "",
  //     language: "",
  //     serpType: "",
  //     deviceType: "",
  //     keywords: ["sadsdfs"],
  //   };
  // });

  try {
    await connectToDB();
    const user = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized" };
    }
    // const addKeyword = await Keyword.create({
    //   ...formData,
    //   keyword: formData.keywords
    //   userId: user?.id,
    // });
    //  const campaignData = await getUserCampaign();

    // const userCompaignId = campaignData?.campaign?.filter((userIdData)=>{
    //   // console.log(userIdData,"userIdData")

    //   return(
    //       userIdData.userId == user?.id
    //   )
    // })
    // console.log(campaignData,"campaignData")
    // console.log(userCompaignId,"userCompaignId")
    // console.log(campaign?._id,"campaign id")
    const addKeyword = await Promise.all(
      formData?.keyword?.map(async (singleKeyword: string) => {
        const { keywords, ...rest } = formData;
        return await Keyword.create({
          ...rest,
          keywords: singleKeyword,
          userId: user?.id,
          CampaignId: campaign?._id,
        });
      })
    );

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
};
