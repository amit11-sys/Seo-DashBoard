import { useCampaignData } from "@/app/context/CampaignContext";
import { getUserFromToken } from "@/app/utils/auth";
import { connectToDB } from "@/lib/db";
import Keyword from "@/lib/models/keyword.model";
import User from "@/lib/models/user.model";
import { getUserCampaign } from "../campaign";
import KeywordTracking from "@/lib/models/keywordTracking.model";
const username = process.env.NEXT_PUBLIC_DATAFORSEO_USERNAME;
const password = process.env.NEXT_PUBLIC_DATAFORSEO_PASSWORD;

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
interface KeywordPayload {
  keyword: string;
  location_name: string;
  language_name: string;
}

interface KeywordResponse {
  keyword: string;
  response: any;
}

interface ErrorResponse {
  error: string;
}

export const saveMultipleKeyword = async (
  formData: any,
  campaign: compaigntype
) => {
  try {
    await connectToDB();
    const user = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized" };
    }

  
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

    console.log(addKeyword,"campgin kewywords")

    const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");

    const payload: KeywordPayload[] = addKeyword.map((keywordObj: any) => ({
      keyword: keywordObj.keywords,
      location_name:
        keywordObj.searchLocation.charAt(0).toUpperCase() +
        keywordObj.searchLocation.slice(1).toLowerCase(),
      language_name:
        keywordObj.language.charAt(0).toUpperCase() +
        keywordObj.language.slice(1).toLowerCase(),
      target: keywordObj.url,
    }));

    console.log(payload,"payload compaign")

    const responses: KeywordResponse[] = [];

    for (const item of payload) {
    
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DATAFORSEO_URL}${"serp/google/organic/live/advanced"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${basicAuth}`,
          },
          body: JSON.stringify([item]),
        }
      );

      if (!res.ok) {
        const errorBody = await res.text();
        console.error(
          `Request failed for ${item.keyword}: ${res.status} - ${errorBody}`
        );
        responses.push({ keyword: item.keyword, response: null });
      } else {
        const result = await res.json();

        responses.push({ keyword: item.keyword, response: result });
      }
    }

    console.log(responses,"comapgin response")
    const createdRecords: any[] = [];

    responses.forEach((item: any) => {
      // console.log(item?.response?.tasks, "response a gyea task");

      item?.response?.tasks?.forEach((task: any) => {
        const keyword = task?.data?.keyword;

        const results = task?.result?.flatMap((data: any) => {
          // Find the matching keyword document
          const matchedKeyword = addKeyword.find(
            (addDataKeyword) => addDataKeyword.keywords === keyword
          );

          return [
            {
              type: task?.data?.se_type,
              location_code: data?.location_code || 2124,
              language_code: data?.language_code || "en",
              location_name: task?.data?.location_name || "",
              url: task?.data?.target || "no ranking",
              rank_group: data?.items?.[0]?.rank_group || 0,
              rank_absolute: data?.items?.[0]?.rank_absolute || 0,
              keyword: keyword || "",
              campaignId: campaign?._id,
              keywordId: matchedKeyword._id,
            },
          ];
        });

        if (results?.length) {
          createdRecords.push(...results);
        }
      });
    });

    console.log(createdRecords, "campaign all records pushed ✅");

    // console.log(createdRecords, "one keyword add");

    const addedKeywords = await KeywordTracking.insertMany(createdRecords);
    console.log(addedKeywords, "campagign return keywrods");

    if (!addKeyword) {
      return { error: "Error while adding keyword" };
    }
    return {
      success: true,
      message: "Keyword Added Successfully",
      addKeyword,
    };
  } catch (error) {
    console.log(error);

    return { error: "Internal Server Error." };
  }
};

type KeywordUpdateData = {
  keywords?: string; // NOTE: your DB expects this as string (not array)
  SearchEngine?: string;
  deviceType?: string;
  keywordTag?: string;
  language?: string;
  searchLocation?: string;
  serpType?: string;
  url?: string;
  volumeLocation?: string;
  campaignId?: string;
  keywordId: string;
};

const capitalize = (str: string = "") =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const updateKeywordById = async (updatedData: KeywordUpdateData) => {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized" };
    }

    const { keywordId, campaignId } = updatedData;

    // ✅ Update keyword document
    const updatedKeyword = await Keyword.findByIdAndUpdate(
      keywordId,
      { $set: updatedData },
      { new: true }
    );

    if (!updatedKeyword) {
      return { error: "Keyword not found" };
    }

    // ✅ Prepare DataForSEO Payload
    const payload = [
      {
        keyword: updatedKeyword.keywords,
        location_name: capitalize(updatedKeyword.searchLocation),
        language_name: capitalize(updatedKeyword.language),
        target: updatedKeyword.url,
      },
    ];

    const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");
    const responses: any[] = [];

    for (const item of payload) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DATAFORSEO_URL}${"serp/google/organic/live/advanced"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${basicAuth}`,
          },
          body: JSON.stringify([item]),
        }
      );

      const result = res.ok ? await res.json() : null;

      responses.push({
        keyword: item.keyword,
        response: result,
      });
    }

    // ✅ Parse response and generate tracking data
    const createdRecords: any[] = [];

    responses.forEach((item) => {
      item?.response?.tasks?.forEach((task: any) => {
        const keyword = task?.data?.keyword;

        task?.result?.forEach((data: any) => {
          createdRecords.push({
            type: task?.data?.se_type,
            location_code: data?.location_code || 2124,
            language_code: data?.language_code || "en",
            location_name: task?.data?.location_name || "",
            url: task?.data?.target || "no ranking",
            rank_group: data?.items?.[0]?.rank_group || 0,
            rank_absolute: data?.items?.[0]?.rank_absolute || 0,
            keyword: keyword || "",
            campaignId: campaignId,
            keywordId: updatedKeyword._id,
          });
        });
      });
    });

    // ✅ Optional: Clear previous tracking records for this keyword
    await KeywordTracking.deleteMany({ keywordId: updatedKeyword._id });

    // ✅ Save new tracking data
    const addedTracking = await KeywordTracking.insertMany(createdRecords);

    return {
      success: true,
      message: "Keyword updated and tracking data refreshed",
      editedKeyword: updatedKeyword,
      tracking: addedTracking,
    };
  } catch (error: any) {
    console.error("Update failed:", error);
    return {
      error: "Internal Server Error",
    };
  }
};

export const deleteKeywordById = async (deletedData: { keywordId: string }) => {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized" };
    }

    const { keywordId } = deletedData;
    console.log(keywordId, "delet id");

    // ✅ Update keyword document status to 2 (soft delete)
    const modifiedStatusKeyword = await KeywordTracking.findOneAndUpdate(
      { keywordId },
      { $set: { status: 2 } },
      { new: true }
    );

    console.log(modifiedStatusKeyword, "status del");

    if (!modifiedStatusKeyword) {
      return { error: "Keyword delete failed" };
    }

    return {
      success: true,
      message: "Keyword deleted successfully",
    };
  } catch (error: any) {
    console.error("Delete failed:", error);
    return {
      error: "Internal Server Error",
    };
  }
};
