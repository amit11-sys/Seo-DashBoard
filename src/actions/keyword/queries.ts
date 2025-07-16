import { useCampaignData } from "@/app/context/CampaignContext";
import { getUserFromToken } from "@/app/utils/auth";
import { connectToDB } from "@/lib/db";
import Keyword from "@/lib/models/keyword.model";
import User from "@/lib/models/user.model";
import { getUserCampaign } from "../campaign";
import KeywordTracking from "@/lib/models/keywordTracking.model";
import { getLocation_languageData } from "../locations_Language";
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
  location_code: number;
  language_name: string;
}

interface KeywordResponse {
  keyword: any;
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

    console.log(addKeyword, "campgin kewywords");

    const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");

    const rankPayload: KeywordPayload[] = addKeyword.map((keywordObj: any) => ({
      keyword: keywordObj.keywords,
      location_code: Number(keywordObj.searchLocationCode),
      language_name: keywordObj.language,
      target: keywordObj.url,
      device: keywordObj.deviceType,
      se_domain: keywordObj.SearchEngine,
    }));
    // const volumnPayload = addKeyword.map((keywordObj: any) => ({
    //   keywords: [keywordObj.keywords],
    //   location_code: Number(keywordObj.volumeLocationCode),
    //   language_name: keywordObj.language,
    //   target: keywordObj.url,
    //   device: keywordObj.deviceType,
    //   se_domain: keywordObj.SearchEngine,
    // }));
    // const intentPayload = addKeyword.map((keywordObj: any) => ({
    //   keywords: [keywordObj.keywords],
    //   location_code: Number(keywordObj.searchLocationCode),
    //   language_name: keywordObj.language,
    //   target: keywordObj.url,
    //   device: keywordObj.deviceType,
    //   se_domain: keywordObj.SearchEngine,
    // }));

    // console.log(volumnPayload, "vaoumn payload");

    console.log(rankPayload, "rank payload compaign");
    // console.log(intentPayload, "intent payload compaign");

    const rankResponses: KeywordResponse[] = [];
    // const volumnResponses: KeywordResponse[] = [];
    // const intentResponses: KeywordResponse[] = [];

    for (const item of rankPayload) {
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
        rankResponses.push({ keyword: item.keyword, response: null });
      } else {
        const result = await res.json();

        rankResponses.push({ keyword: item.keyword, response: result });
      }
    }
    // for (const item of volumnPayload) {
    //   const res = await fetch(
    //     `${process.env.NEXT_PUBLIC_DATAFORSEO_URL}${"keywords_data/google/search_volume/live"}`,
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Basic ${basicAuth}`,
    //       },
    //       body: JSON.stringify([item]),
    //     }
    //   );

    //   if (!res.ok) {
    //     const errorBody = await res.text();
    //     console.error(
    //       `Request failed for ${item.keywords}: ${res.status} - ${errorBody}`
    //     );
    //     volumnResponses.push({ keyword: item.keywords, response: null });
    //   } else {
    //     const result = await res.json();

    //     volumnResponses.push({ keyword: item.keywords, response: result });
    //   }
    // }
    // for (const item of intentPayload) {
    //   const res = await fetch(
    //     `${process.env.NEXT_PUBLIC_DATAFORSEO_URL}${"keywords_data/google/search_volume/live"}`,
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Basic ${basicAuth}`,
    //       },
    //       body: JSON.stringify([item]),
    //     }
    //   );

    //   if (!res.ok) {
    //     const errorBody = await res.text();
    //     console.error(
    //       `Request failed for ${item.keywords}: ${res.status} - ${errorBody}`
    //     );
    //     intentResponses.push({ keyword: item.keywords, response: null });
    //   } else {
    //     const result = await res.json();

    //     intentResponses.push({ keyword: item.keywords, response: result });
    //   }
    // }

    console.log(rankResponses, "rank response");
    // console.log(volumnResponses, "volumn response");
    // console.log(intentResponses, "intent response");

    const createdRecords: any[] = [];
    const res = await getLocation_languageData();
    const locationData = res?.allLocations;

    // intentResponses.forEach((int)=>{

      // volumnResponses.forEach((vol) => {
        
      // });

    // })

rankResponses.forEach((item: any) => {
          console.log(item?.response?.tasks, "response a gyea task");

          item?.response?.tasks?.forEach((task: any) => {
            console.log(task,"task in response")
            const keyword = task?.data?.keyword;

            const results = task?.result?.flatMap((data: any) => {
              console.log(task?.result, "locations check");

              // Find the matching keyword document
              const matchedKeyword = addKeyword.find(
                (addDataKeyword) => addDataKeyword.keywords === keyword
              );

              const matchLangName = locationData?.find(
                (lang) => lang.locationCode === data?.location_code
              );

              // Find the corresponding search volume for the keyword and location
              // const matchSearchVolumn =
              //   vol?.response?.tasks?.flatMap((vTask: any) =>
              //     vTask?.result?.filter(
              //       (volData: any) =>
              //         volData.keyword === keyword &&
              //         volData.location_code === data?.location_code
              //     )
              //   )[0]?.search_volume || 0;
              // const matchcompetition =
              //   vol?.response?.tasks?.flatMap((vTask: any) =>
              //     vTask?.result?.filter(
              //       (volData: any) =>
              //         volData.keyword === keyword &&
              //         volData.location_code === data?.location_code
              //     )
              //   )[0]?.competition || 0;

              console.log(matchedKeyword, "during campaign match data");
                  // const matchIntent =
              return [
                {
                  type: task?.data?.se_type,
                  location_code: data?.location_code || 2124,
                  language_code: data?.language_code || "en",
                  location_name: matchLangName?.locationName || "",
                  url: task?.data?.target || "no ranking",
                  rank_group: data?.items?.[0]?.rank_group || 0,
                  rank_absolute: data?.items?.[0]?.rank_absolute || 0,
                  keyword: keyword || "",
                  // searchVolumn: matchSearchVolumn,
                  // competition: matchcompetition,
                    // intent: matchIntent ,
                  // SearchEngine:  task?.data?.se_domain,
                  // language: task?.data?.language_name,
                  // deviceType:task?.data?.device,
                  campaignId: campaign?._id,
                  keywordId: matchedKeyword?._id,
                },
              ];
            });

            if (results?.length) {
              createdRecords.push(...results);
            }
          });
        });






    // rankResponses.forEach((item: any) => {
    //   console.log(item?.response?.tasks, "response a gyea task");

    //   item?.response?.tasks?.forEach((task: any) => {
    //     const keyword = task?.data?.keyword;
    //     const results = task?.result?.flatMap((data: any) => {
    //       console.log(task?.result, "locations check");

    //       // const location_name =
    //       // Find the matching keyword document
    //       const matchedKeyword = addKeyword.find(
    //         (addDataKeyword) => addDataKeyword.keywords === keyword
    //       );
    //       const matchLangName = locationData?.find((lang) => {
    //         return lang.locationCode === data?.location_code;
    //       });
    //       // const matchSearchVolumn =

    //       console.log(matchedKeyword, "during capmaign match data");
    //       return [
    //         {
    //           type: task?.data?.se_type,
    //           location_code: data?.location_code || 2124,
    //           language_code: data?.language_code || "en",
    //           location_name: matchLangName?.locationName || "",
    //           url: task?.data?.target || "no ranking",
    //           rank_group: data?.items?.[0]?.rank_group || 0,
    //           rank_absolute: data?.items?.[0]?.rank_absolute || 0,
    //           keyword: keyword || "",
    //           searchVolumn: matchSearchVolumn || 0,
    //           // SearchEngine:  task?.data?.se_domain,
    //           // language: task?.data?.language_name, // "en"
    //           // deviceType:task?.data?.device,
    //           campaignId: campaign?._id,
    //           keywordId: matchedKeyword._id,
    //         },
    //       ];
    //     });

    //     if (results?.length) {
    //       createdRecords.push(...results);
    //     }
    //   });
    // });

    // intentResponses.forEach((int) => {

    // volumnResponses.forEach((vol) => {

    // });

    // });

    //  rankResponses.forEach((item: any) => {
    //       item?.response?.tasks?.forEach((task: any) => {
    //         const keyword = task?.data?.keyword;

    //         const results = task?.result?.flatMap((data: any) => {
    //           // Matching keyword from initial input
    //           const matchedKeyword = addKeyword.find(
    //             (addDataKeyword) => addDataKeyword.keywords === keyword
    //           );

    //           const matchLangName = locationData?.find(
    //             (lang) => lang.locationCode === data?.location_code
    //           );

    //           // Get search volume & competition
    //           // const volumeMatch = vol?.response?.tasks?.flatMap((vTask: any) =>
    //           //   vTask?.result?.filter(
    //           //     (volData: any) =>
    //           //       volData.keyword === keyword &&
    //           //       volData.location_code === data?.location_code
    //           //   )
    //           // )[0];

    //           // const matchSearchVolumn = volumeMatch?.search_volume || 0;
    //           // const matchCompetition = volumeMatch?.competition || 0;

    //           // Get intent from intentResponses
    //           // const intentMatch = int?.response?.tasks?.flatMap(
    //           //   (intentTask: any) =>
    //           //     intentTask?.result?.flatMap((intentResult: any) =>
    //           //       intentResult?.items?.filter(
    //           //         (intentItem: any) => intentItem.keyword === keyword
    //           //       )
    //           //     )
    //           // )[0];

    //           // const matchIntent =
    //           //   intentMatch?.keyword_intent?.label || "unknown";

    //           return [
    //             {
    //               type: task?.data?.se_type,
    //               location_code: data?.location_code || 2124,
    //               language_code: data?.language_code || "en",
    //               location_name: matchLangName?.locationName || "",
    //               url: task?.data?.target || "no ranking",
    //               rank_group: data?.items?.[0]?.rank_group || 0,
    //               rank_absolute: data?.items?.[0]?.rank_absolute || 0,
    //               keyword: keyword || "",
    //               // searchVolumn: matchSearchVolumn,
    //               // competition: matchCompetition,
    //               // intent: matchIntent,
    //               campaignId: campaign?._id,
    //               keywordId: matchedKeyword?._id,
    //             },
    //           ];
    //         });

    //         if (results?.length) {
    //           createdRecords.push(...results);
    //         }
    //       });
    //     });

   



    console.log(createdRecords, "campaign all records pushed ✅");

    // console.log(createdRecords, "one keyword add");

    const addedKeywords = await KeywordTracking.insertMany(createdRecords);
    console.log(addedKeywords, "campagign return keywrods");

    if (!addKeyword) {
      return { error: "Error while adding keyword" };
    }
    return {
      success: true,
      message: "Keyword & compaign Added Successfully",
      addedKeywords,
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
    // console.log(updatedData,"edit data backend")

    // ✅ Update keyword document
    const updatedKeyword = await Keyword.findByIdAndUpdate(
      keywordId,
      { $set: updatedData },
      { new: true }
    );
    console.log(updatedKeyword, "updated keywoerds");
    if (!updatedKeyword) {
      return { error: "Keyword not found" };
    }

    // ✅ Prepare DataForSEO Payload
    // const payload = [
    //   {
    //     keyword: updatedKeyword.keywords,
    //     location_code: updatedKeyword.searchLocationCode,
    //     language_name: capitalize(updatedKeyword.language),
    //     target: updatedKeyword.url,
    //     device: updatedKeyword.deviceType,
    //     se_domain: updatedKeyword.SearchEngine,
    //   },
    // ];
    const rankPayload: KeywordPayload[] = updatedKeyword.map(
      (keywordObj: any) => ({
        keyword: keywordObj.keywords,
        location_code: Number(keywordObj.searchLocationCode),
        language_name: keywordObj.language,
        target: keywordObj.url,
        device: keywordObj.deviceType,
        se_domain: keywordObj.SearchEngine,
      })
    );
    const volumnPayload = updatedKeyword.map((keywordObj: any) => ({
      keywords: [keywordObj.keywords],
      location_code: Number(keywordObj.volumeLocationCode),
      language_name: keywordObj.language,
      target: keywordObj.url,
      device: keywordObj.deviceType,
      se_domain: keywordObj.SearchEngine,
    }));

    // console.log(payload, "edit uploaded payload");

    const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");

    const rankResponses: KeywordResponse[] = [];
    const volumnResponses: KeywordResponse[] = [];

    for (const item of rankPayload) {
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
        rankResponses.push({ keyword: item.keyword, response: null });
      } else {
        const result = await res.json();

        rankResponses.push({ keyword: item.keyword, response: result });
      }
    }
    for (const item of volumnPayload) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DATAFORSEO_URL}${"keywords_data/google/search_volume/live"}`,
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
          `Request failed for ${item.keywords}: ${res.status} - ${errorBody}`
        );
        volumnResponses.push({ keyword: item.keywords, response: null });
      } else {
        const result = await res.json();

        volumnResponses.push({ keyword: item.keywords, response: result });
      }
    }

    // console.log(responses, "edit response");

    // ✅ Parse response and generate tracking data
    const createdRecords: any[] = [];

    const res = await getLocation_languageData();
    const locationData = res?.allLocations;

    volumnResponses.forEach((vol) => {
      rankResponses.forEach((item: any) => {
        console.log(item?.response?.tasks, "response a gyea task");

        item?.response?.tasks?.forEach((task: any) => {
          const keyword = task?.data?.keyword;

          const results = task?.result?.flatMap((data: any) => {
            console.log(task?.result, "locations check");

            // Find the matching keyword document
            const matchedKeyword = updatedKeyword.find(
              (updatedKeyword: { keywords: string }) =>
                updatedKeyword.keywords === keyword
            );

            const matchLangName = locationData?.find(
              (lang) => lang.locationCode === data?.location_code
            );

            // Find the corresponding search volume for the keyword and location
            const matchSearchVolumn =
              vol?.response?.tasks?.flatMap((vTask: any) =>
                vTask?.result?.filter(
                  (volData: any) =>
                    volData.keyword === keyword &&
                    volData.location_code === data?.location_code
                )
              )[0]?.search_volume || 0;
            const matchcompetition =
              vol?.response?.tasks?.flatMap((vTask: any) =>
                vTask?.result?.filter(
                  (volData: any) =>
                    volData.keyword === keyword &&
                    volData.location_code === data?.location_code
                )
              )[0]?.competition || 0;

            console.log(matchedKeyword, "during campaign match data");

            return [
              {
                type: task?.data?.se_type,
                location_code: data?.location_code || 2124,
                language_code: data?.language_code || "en",
                location_name: matchLangName?.locationName || "",
                url: task?.data?.target || "no ranking",
                rank_group: data?.items?.[0]?.rank_group || 0,
                rank_absolute: data?.items?.[0]?.rank_absolute || 0,
                keyword: keyword || "",
                searchVolumn: matchSearchVolumn,
                competition: matchcompetition,
                // SearchEngine:  task?.data?.se_domain,
                // language: task?.data?.language_name,
                // deviceType:task?.data?.device,
                campaignId: campaignId,
                keywordId: matchedKeyword?._id,
              },
            ];
          });

          if (results?.length) {
            createdRecords.push(...results);
          }
        });
      });
    });

    // ✅ Optional: Clear previous tracking records for this keyword
    await KeywordTracking.deleteMany({ keywordId: updatedKeyword._id });

    console.log(createdRecords, "edit created records");
    // ✅ Save new tracking data
    const addedTracking = await KeywordTracking.insertMany(createdRecords);

    return {
      success: true,
      message: "Keyword updated ",
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
