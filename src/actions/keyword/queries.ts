import { getUserFromToken } from "@/app/utils/auth";
import { connectToDB } from "@/lib/db";
import Keyword from "@/lib/models/keyword.model";

import KeywordTracking from "@/lib/models/keywordTracking.model";
import { keywordQueue } from "@/lib/queue/keywordQueue";
import { getRedis } from "@/lib/redis";

const username = process.env.NEXT_PUBLIC_DATAFORSEO_USERNAME;
const password = process.env.NEXT_PUBLIC_DATAFORSEO_PASSWORD;


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

export const getVolumnRank = async (KeywordData: any) => {
  try {
    await connectToDB();
    const user = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized" };
    }

    

    const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");

    const volumnPayload = KeywordData.map((keywordObj: any) => ({
      keywords: [keywordObj.keywords],
      location_code: Number(keywordObj.volumeLocationCode),
      language_name: keywordObj.language,
      target: keywordObj.url,
      device: keywordObj.deviceType,
      se_domain: keywordObj.SearchEngine,
    }));

    const volumnResponses: KeywordResponse[] = [];

    for (const item of volumnPayload) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DATAFORSEO_URL}${"keywords_data/google/search_volume/liveee"}`,
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

    // console.log(volumnResponses, "volumn response");

    if (!KeywordData) {
      return { error: "Error while adding keyword" };
    }
    return {
      success: true,
      message: "volumn data  Successfully",
      volumnResponses,
    };
  } catch (error) {
    console.log(error);

    return { error: "Internal Server Error." };
  }
};
// export const getRankIntent = async (KeywordData: any) => {
//   try {
//     await connectToDB();
//     const user = await getUserFromToken();
//     if (!user) {
//       return { error: "Unauthorized" };
//     }

  

//     const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");

//     const intentPayload = KeywordData.map((keywordObj: any) => ({
//       keywords: [keywordObj.keywords],
//       location_code: Number(keywordObj.searchLocationCode),
//       language_name: keywordObj.language,
//       target: keywordObj.url,
//       device: keywordObj.deviceType,
//       se_domain: keywordObj.SearchEngine,
//     }));

//     // console.log(intentPayload, "intent payload compaign");

//     const intentResponses: KeywordResponse[] = [];

//     for (const item of intentPayload) {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_DATAFORSEO_URL}${"dataforseo_labs/google/search_intent/live"}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Basic ${basicAuth}`,
//           },
//           body: JSON.stringify([item]),
//         }
//       );

//       if (!res.ok) {
//         const errorBody = await res.text();
//         console.error(
//           `Request failed for ${item.keywords}: ${res.status} - ${errorBody}`
//         );
//         intentResponses.push({ keyword: item.keywords, response: null });
//       } else {
//         const result = await res.json();

//         intentResponses.push({ keyword: item.keywords, response: result });
//       }
//     }

//     console.log(intentResponses, "intent response");

    
//     if (!KeywordData) {
//       return { error: "Error while adding keyword" };
//     }
//     return {
//       success: true,
//       message: "intent Responses Successfully",
//       intentResponses,
//     };
//   } catch (error) {
//     console.log(error);

//     return { error: "Internal Server Error." };
//   }
// };

export const getRankIntent = async (KeywordData: any) => {
  try {
    await connectToDB();
    const user = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized" };
    }

    // const addKeyword = await Promise.all(
    //   formData?.keyword?.map(async (singleKeyword: string) => {
    //     const { keywords, ...rest } = formData;
    //     return await Keyword.create({
    //       ...rest,
    //       keywords: singleKeyword,
    //       userId: user?.id,
    //       CampaignId: campaign?._id,
    //     });
    //   })
    // );

    // console.log(addKeyword, "campgin kewywords");

    const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");

    const intentPayload = KeywordData.map((keywordObj: any) => ({
      keywords: [keywordObj.keywords],
      location_code: Number(keywordObj.searchLocationCode),
      language_name: keywordObj.language,
      target: keywordObj.url,
      device: keywordObj.deviceType,
      se_domain: keywordObj.SearchEngine,
    }));

    console.log(intentPayload, "intent payload compaign");

    const intentResponses: KeywordResponse[] = [];

    for (const item of intentPayload) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DATAFORSEO_URL}${"dataforseo_labs/google/search_intent/live"}`,
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
        intentResponses.push({ keyword: item.keywords, response: null });
      } else {
        const result = await res.json();

        intentResponses.push({ keyword: item.keywords, response: result });
      }
    }

       console.log(intentResponses, "intent response");
    // const intentJson: any = await intentResponse.json();
  const intentTask = intentResponses[0].response?.tasks?.[0];
  const intentResult = intentTask?.result?.[0];
  const intentItem = intentResult?.items?.[0];

  const intentData = intentItem?.keyword_intent?.label ?? ""
    
  
    // const res = await getLocation_languageData();
    // const locationData = res?.allLocations;

    // intentResponses.forEach((int)=>{

    // })

    // volumnResponses.forEach((vol) => {
    //   rankResponses.forEach((item: any) => {
    //     console.log(item?.response?.tasks, "response a gyea task");

    //     item?.response?.tasks?.forEach((task: any) => {
    //       console.log(task, "task in response");
    //       const keyword = task?.data?.keyword;

    //       const results = task?.result?.flatMap((data: any) => {
    //         console.log(task?.result, "locations check");

    //         // Find the matching keyword document
    //         const matchedKeyword = addKeyword.find(
    //           (addDataKeyword) => addDataKeyword.keywords === keyword
    //         );

    //         const matchLangName = locationData?.find(
    //           (lang) => lang.locationCode === data?.location_code
    //         );

    //         // Find the corresponding search volume for the keyword and location
    //         const matchSearchVolumn =
    //           vol?.response?.tasks?.flatMap((vTask: any) =>
    //             vTask?.result?.filter(
    //               (volData: any) =>
    //                 volData.keyword === keyword &&
    //                 volData.location_code === data?.location_code
    //             )
    //           )[0]?.search_volume || 0;
    //           console.log(matchSearchVolumn,"match serach location")
    //         // const matchcompetition =
    //         //   vol?.response?.tasks?.flatMap((vTask: any) =>
    //         //     vTask?.result?.filter(
    //         //       (volData: any) =>
    //         //         volData.keyword === keyword &&
    //         //         volData.location_code === data?.location_code
    //         //     )
    //         //   )[0]?.competition || 0;

    //         console.log(matchedKeyword, "during campaign match data");
    //         // const matchIntent =
    //         return [
    //           {
    //             type: task?.data?.se_type,
    //             location_code: data?.location_code || 2124,
    //             language_code: data?.language_code || "en",
    //             location_name: matchLangName?.locationName || "",
    //             url: task?.data?.target || "no ranking",
    //             rank_group: data?.items?.[0]?.rank_group || 0,
    //             rank_absolute: data?.items?.[0]?.rank_absolute || 0,
    //             keyword: keyword || "",
    //             searchVolumn: matchSearchVolumn,
    //             // competition: matchcompetition,
    //             // intent: matchIntent ,
    //             // SearchEngine:  task?.data?.se_domain,
    //             // language: task?.data?.language_name,
    //             // deviceType:task?.data?.device,
    //             campaignId: campaign?._id,
    //             keywordId: matchedKeyword?._id,
    //           },
    //         ];
    //       });

    //       if (results?.length) {
    //         createdRecords.push(...results);
    //       }
    //     });
    //   });
    // });

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

    // const addedKeywords = await KeywordTracking.insertMany(createdRecords);
    // console.log(addedKeywords, "campagign return keywrods");

    if (!KeywordData) {
      return { error: "Error while adding keyword" };
    }
    return {
      success: true,
      message: "intent Responses Successfully",
      intentData,
    };
  } catch (error) {
    console.log(error);

    return { error: "Internal Server Error." };
  }
};
export const getKewordRank = async (KeywordData: any) => {
  try {
    await connectToDB();
    const user = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized" };
    }

    // console.log(addKeyword, "campgin kewywords");

    const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");
    const payload = [
      {
        keyword: KeywordData.keywords,
        location_code: Number(KeywordData.searchLocationCode),
        language_name: KeywordData.language,
        target: `*${KeywordData.url}*`,
        device: KeywordData.deviceType,
        se_domain: KeywordData.SearchEngine,
      },
    ];
    // const rankPayload: KeywordPayload[] = KeywordData.map(

    // );
    console.log(payload, "payload check");

    // console.log(rankPayload, "rank payload compaign");

    // const rankResponses: KeywordResponse[] = [];

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DATAFORSEO_URL}${"serp/google/organic/live/advanced"}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${basicAuth}`,
        },
        body: JSON.stringify(payload),
      }
    );
    let result;
    if (!res.ok) {
      const errorBody = await res.json();
      // console.error(
      //   `Request failed for ${item.keyword}: ${res.status} - ${errorBody}`
      // );
      // rankResponses.push({ keyword: item.keyword, response: null });
    } else {
      result = await res.json();

      // rankResponses.push({ keyword: item.keyword, response: result });
    }

    // console.log(rankResponses[0].response.tasks[0].result, "rank response");

    // const res = await getLocation_languageData();
    // const locationData = res?.allLocations;

    // intentResponses.forEach((int)=>{

    // })

    
    // console.log(addedKeywords, "campagign return keywrods");

    if (!KeywordData) {
      return { error: "Error while adding keyword" };
    }
    return {
      success: true,
      message: "rank Data Successfully",
      result,
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

export const deleteKeywordById = async (selectedKeywords: string[]) => {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized" };
    }

    if (!Array.isArray(selectedKeywords) || selectedKeywords.length === 0) {
      return { error: "No keywords selected" };
    }

    const result = await KeywordTracking.updateMany(
      {
        keywordId: { $in: selectedKeywords },
      },
      { $set: { status: 3 } }
    );
    // console.log(result, "delete result");

    if (result.modifiedCount === 0) {
      return { error: "No keywords were updated" };
    }
    // console.log(selectedKeywords, "delete keyword");
    return {
      success: true,
      // message: `${result.modifiedCount} keyword(s) deleted successfully`,
    };
  } catch (error: any) {
    console.error("Delete failed:", error);
    return { error: "Internal Server Error" };
  }
};
export const updateKeywordById = async (updatedData: KeywordUpdateData) => {
  try {
    await connectToDB();
    // console.log(updatedData, "update data backend");
    const user = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized " };
    }

    const { keywordId, campaignId } = updatedData;
    // console.log(updatedData,"edit data backend new")
    // console.log(keywordId,campaignId,"idsies")
    // console.log(updatedData,"edit form data ")

  

    // console.log(updatedKeyword, "updated keywoerds");
    // if (!updatedKeyword) {
    //   return { error: "Keyword not found" };
    // }

    const rankdata = await getKewordRank(updatedData);

    const item = rankdata?.result?.tasks?.[0]?.result?.[0]?.items?.[0];
     const meta = rankdata?.result?.tasks?.[0]?.result?.[0];
    //  console.log(item,"item update")
    //  console.log(meta,"meta update")
    const editedKeyword = await KeywordTracking.findOneAndUpdate(
      { keywordId },
      {
        $set: {
          rank_group: item?.rank_group ?? 0,
          rank_absolute: item?.rank_absolute ?? 0,
          type: updatedData?.serpType,
          userId: user?.id,
          location_code: meta?.location_code,
            language_code: meta?.language_code,
          url: item?.url.trim() || "no ranking",
          keyword: updatedData?.keywords || "",
         
          updatedAt: new Date(),
        },
      },
      { new: true }
    );
    // console.log(editedKeyword,"edited keyword")
   
    // console.log(finalData, "final data");

    return {
      success: true,
      message: "Keyword updated ",
      editedKeyword,
      // tracking: addedTracking,
    };
  } catch (error: any) {
    console.error("Update failed:", error);
    return {
      error: "Internal Server Error",
    };
  }
};

export const saveMultipleKeyword = async (formData: any, campaign: any) => {
  await connectToDB();
  const user = await getUserFromToken();
  if (!user) return { error: "Unauthorized" };

  
  // console.log(addedKeywords, "added keywords");

  formData.keyword = Array.from(new Set(formData?.keyword || []));

  const existingKeywords = await Keyword.find({
    keywords: { $in: formData.keyword },
    userId: user.id,
    CampaignId: campaign._id,
  }).distinct("keywords");

  // console.log(existingKeywords, "existingKeywords");

  formData.keyword = formData.keyword.filter(
    (kwStr: any) => !existingKeywords.includes(kwStr)
  );

  const createdKeywords =
    formData.keyword.length > 0
      ? await Keyword.insertMany(
          formData.keyword.map((kwStr: string) => ({
            ...formData,
            keywords: kwStr,
            userId: user.id,
            CampaignId: campaign._id,
          }))
        )
      : [];

  // console.log(createdKeywords, "created keywords");

  // Filter out nulls (duplicates)
  // const filteredKeywords = addedKeywords.filter((kw) => kw !== null);

  // console.log(filteredKeywords, "addedFilterkeywords");

  // Initialize progress in Redis

  const redis = getRedis();
  const progressKey = `campaign:${campaign._id.toString()}:progress`;
  await redis.hset(progressKey, {
    total: String(createdKeywords.length),
    processed: "0",
    lastUpdated: String(Date.now()),
  });
  await redis.expire(progressKey, 60 * 60);

  // Enqueue jobs for each keyword
  await Promise.all(
    createdKeywords.map((kw) =>
      keywordQueue.add("fetchKeywordRanking", {
        keywordId: kw._id.toString(),
        keyword: kw.keywords, // must match what you stored
        location_code: kw.searchLocationCode,
        language_code: kw.language,
        target: kw.url,

        device: kw.deviceType,
        se_domain: kw.SearchEngine,
        campaignId: campaign._id.toString(),
        userId: user.id.toString(),
      })
    )
  );

  const counts = await keywordQueue.getJobCounts();

  return {
    success: true,
    message: "Keywords queued for live ranking",
    queued: createdKeywords.length,
    counts,
  };
};
