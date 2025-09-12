// import { useCampaignData } from "@/app/context/CampaignContext";
import { getUserFromToken } from "@/app/utils/auth";
import { connectToDB } from "@/lib/db";
import Keyword from "@/lib/models/keyword.model";
// import User from "@/lib/models/user.model";
// import { getUserCampaign } from "../campaign";
import KeywordTracking from "@/lib/models/keywordTracking.model";
import { keywordQueue } from "@/lib/queue/keywordQueue";
import { getRedis } from "@/lib/redis";
// import { getLocation_languageData } from "../locations_Language";
// import { getKewordRank, getRankIntent, getVolumnRank } from ".";
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

// export const saveMultipleKeyword = async (
//   formData: any,
//   campaign: compaigntype
// ) => {
//   try {
//     await connectToDB();
//     const user = await getUserFromToken();
//     if (!user) {
//       return { error: "Unauthorized" };
//     }

//     const addKeyword = await Promise.all(
//       formData?.keyword?.map(async (singleKeyword: string) => {
//         const { keywords, ...rest } = formData;
//         return await Keyword.create({
//           ...rest,
//           keywords: singleKeyword,
//           userId: user?.id,
//           CampaignId: campaign?._id,
//         });
//       })
//     );

//     console.log(addKeyword, "campgin kewywords");

//     const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");

//     const rankPayload: KeywordPayload[] = addKeyword.map((keywordObj: any) => ({
//       keyword: keywordObj.keywords,
//       location_code: Number(keywordObj.searchLocationCode),
//       language_name: keywordObj.language,
//       target: keywordObj.url,
//       device: keywordObj.deviceType,
//       se_domain: keywordObj.SearchEngine,
//     }));
//     const volumnPayload = addKeyword.map((keywordObj: any) => ({
//       keywords: [keywordObj.keywords],
//       location_code: Number(keywordObj.volumeLocationCode),
//       language_name: keywordObj.language,
//       target: keywordObj.url,
//       device: keywordObj.deviceType,
//       se_domain: keywordObj.SearchEngine,
//     }));
//     // const intentPayload = addKeyword.map((keywordObj: any) => ({
//     //   keywords: [keywordObj.keywords],
//     //   location_code: Number(keywordObj.searchLocationCode),
//     //   language_name: keywordObj.language,
//     //   target: keywordObj.url,
//     //   device: keywordObj.deviceType,
//     //   se_domain: keywordObj.SearchEngine,
//     // }));

//     // console.log(volumnPayload, "vaoumn payload");

//     console.log(rankPayload, "rank payload compaign");
//     // console.log(intentPayload, "intent payload compaign");

//     const rankResponses: KeywordResponse[] = [];
//     const volumnResponses: KeywordResponse[] = [];
//     // const intentResponses: KeywordResponse[] = [];

//     for (const item of rankPayload) {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_DATAFORSEO_URL}${"serp/google/organic/live/advanced"}`,
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
//           `Request failed for ${item.keyword}: ${res.status} - ${errorBody}`
//         );
//         rankResponses.push({ keyword: item.keyword, response: null });
//       } else {
//         const result = await res.json();

//         rankResponses.push({ keyword: item.keyword, response: result });
//       }
//     }
//     for (const item of volumnPayload) {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_DATAFORSEO_URL}${"keywords_data/google/search_volume/live"}`,
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
//         volumnResponses.push({ keyword: item.keywords, response: null });
//       } else {
//         const result = await res.json();

//         volumnResponses.push({ keyword: item.keywords, response: result });
//       }
//     }

//     // for (const item of intentPayload) {
//     //   const res = await fetch(
//     //     `${process.env.NEXT_PUBLIC_DATAFORSEO_URL}${"keywords_data/google/search_volume/live"}`,
//     //     {
//     //       method: "POST",
//     //       headers: {
//     //         "Content-Type": "application/json",
//     //         Authorization: `Basic ${basicAuth}`,
//     //       },
//     //       body: JSON.stringify([item]),
//     //     }
//     //   );

//     //   if (!res.ok) {
//     //     const errorBody = await res.text();
//     //     console.error(
//     //       `Request failed for ${item.keywords}: ${res.status} - ${errorBody}`
//     //     );
//     //     intentResponses.push({ keyword: item.keywords, response: null });
//     //   } else {
//     //     const result = await res.json();

//     //     intentResponses.push({ keyword: item.keywords, response: result });
//     //   }
//     // }

//     console.log(rankResponses, "rank response");
//     console.log(volumnResponses, "volumn response");
//     // console.log(intentResponses, "intent response");

//     const createdRecords: any[] = [];
//     const res = await getLocation_languageData();
//     const locationData = res?.allLocations;

//     // intentResponses.forEach((int)=>{

//     // })

//     volumnResponses.forEach((vol) => {
//       rankResponses.forEach((item: any) => {
//         console.log(item?.response?.tasks, "response a gyea task");

//         item?.response?.tasks?.forEach((task: any) => {
//           console.log(task, "task in response");
//           const keyword = task?.data?.keyword;

//           const results = task?.result?.flatMap((data: any) => {
//             console.log(task?.result, "locations check");

//             // Find the matching keyword document
//             const matchedKeyword = addKeyword.find(
//               (addDataKeyword) => addDataKeyword.keywords === keyword
//             );

//             const matchLangName = locationData?.find(
//               (lang) => lang.locationCode === data?.location_code
//             );

//             // Find the corresponding search volume for the keyword and location
//             const matchSearchVolumn =
//               vol?.response?.tasks?.flatMap((vTask: any) =>
//                 vTask?.result?.filter(
//                   (volData: any) =>
//                     volData.keyword === keyword &&
//                     volData.location_code === data?.location_code
//                 )
//               )[0]?.search_volume || 0;
//             console.log(matchSearchVolumn, "match serach location");
//             // const matchcompetition =
//             //   vol?.response?.tasks?.flatMap((vTask: any) =>
//             //     vTask?.result?.filter(
//             //       (volData: any) =>
//             //         volData.keyword === keyword &&
//             //         volData.location_code === data?.location_code
//             //     )
//             //   )[0]?.competition || 0;

//             console.log(matchedKeyword, "during campaign match data");
//             // const matchIntent =
//   return [
//     {
//       type: task?.data?.se_type,
//       location_code: data?.location_code || 2124,
//       language_code: data?.language_code || "en",
//       location_name: matchLangName?.locationName || "",
//       url: task?.data?.target || "no ranking",
//       rank_group: data?.items?.[0]?.rank_group || 0,
//       rank_absolute: data?.items?.[0]?.rank_absolute || 0,
//       keyword: keyword || "",
//       searchVolumn: matchSearchVolumn,
//       // competition: matchcompetition,
//       // intent: matchIntent ,
//       // SearchEngine:  task?.data?.se_domain,
//       // language: task?.data?.language_name,
//       // deviceType:task?.data?.device,
//       campaignId: campaign?._id,
//       keywordId: matchedKeyword?._id,
//     },
//   ];
// });

//           if (results?.length) {
//             createdRecords.push(...results);
//           }
//         });
//       });
//     });

//     // rankResponses.forEach((item: any) => {
//     //   console.log(item?.response?.tasks, "response a gyea task");

//     //   item?.response?.tasks?.forEach((task: any) => {
//     //     const keyword = task?.data?.keyword;
//     //     const results = task?.result?.flatMap((data: any) => {
//     //       console.log(task?.result, "locations check");

//     //       // const location_name =
//     //       // Find the matching keyword document
//     //       const matchedKeyword = addKeyword.find(
//     //         (addDataKeyword) => addDataKeyword.keywords === keyword
//     //       );
//     //       const matchLangName = locationData?.find((lang) => {
//     //         return lang.locationCode === data?.location_code;
//     //       });
//     //       // const matchSearchVolumn =

//     //       console.log(matchedKeyword, "during capmaign match data");
//     //       return [
//     //         {
//     //           type: task?.data?.se_type,
//     //           location_code: data?.location_code || 2124,
//     //           language_code: data?.language_code || "en",
//     //           location_name: matchLangName?.locationName || "",
//     //           url: task?.data?.target || "no ranking",
//     //           rank_group: data?.items?.[0]?.rank_group || 0,
//     //           rank_absolute: data?.items?.[0]?.rank_absolute || 0,
//     //           keyword: keyword || "",
//     //           searchVolumn: matchSearchVolumn || 0,
//     //           // SearchEngine:  task?.data?.se_domain,
//     //           // language: task?.data?.language_name, // "en"
//     //           // deviceType:task?.data?.device,
//     //           campaignId: campaign?._id,
//     //           keywordId: matchedKeyword._id,
//     //         },
//     //       ];
//     //     });

//     //     if (results?.length) {
//     //       createdRecords.push(...results);
//     //     }
//     //   });
//     // });

//     // intentResponses.forEach((int) => {

//     // volumnResponses.forEach((vol) => {

//     // });

//     // });

//     //  rankResponses.forEach((item: any) => {
//     //       item?.response?.tasks?.forEach((task: any) => {
//     //         const keyword = task?.data?.keyword;

//     //         const results = task?.result?.flatMap((data: any) => {
//     //           // Matching keyword from initial input
//     //           const matchedKeyword = addKeyword.find(
//     //             (addDataKeyword) => addDataKeyword.keywords === keyword
//     //           );

//     //           const matchLangName = locationData?.find(
//     //             (lang) => lang.locationCode === data?.location_code
//     //           );

//     //           // Get search volume & competition
//     //           // const volumeMatch = vol?.response?.tasks?.flatMap((vTask: any) =>
//     //           //   vTask?.result?.filter(
//     //           //     (volData: any) =>
//     //           //       volData.keyword === keyword &&
//     //           //       volData.location_code === data?.location_code
//     //           //   )
//     //           // )[0];

//     //           // const matchSearchVolumn = volumeMatch?.search_volume || 0;
//     //           // const matchCompetition = volumeMatch?.competition || 0;

//     //           // Get intent from intentResponses
//     //           // const intentMatch = int?.response?.tasks?.flatMap(
//     //           //   (intentTask: any) =>
//     //           //     intentTask?.result?.flatMap((intentResult: any) =>
//     //           //       intentResult?.items?.filter(
//     //           //         (intentItem: any) => intentItem.keyword === keyword
//     //           //       )
//     //           //     )
//     //           // )[0];

//     //           // const matchIntent =
//     //           //   intentMatch?.keyword_intent?.label || "unknown";

//     //           return [
//     //             {
//     //               type: task?.data?.se_type,
//     //               location_code: data?.location_code || 2124,
//     //               language_code: data?.language_code || "en",
//     //               location_name: matchLangName?.locationName || "",
//     //               url: task?.data?.target || "no ranking",
//     //               rank_group: data?.items?.[0]?.rank_group || 0,
//     //               rank_absolute: data?.items?.[0]?.rank_absolute || 0,
//     //               keyword: keyword || "",
//     //               // searchVolumn: matchSearchVolumn,
//     //               // competition: matchCompetition,
//     //               // intent: matchIntent,
//     //               campaignId: campaign?._id,
//     //               keywordId: matchedKeyword?._id,
//     //             },
//     //           ];
//     //         });

//     //         if (results?.length) {
//     //           createdRecords.push(...results);
//     //         }
//     //       });
//     //     });

//     console.log(createdRecords, "campaign all records pushed ✅");

//     // console.log(createdRecords, "one keyword add");

//     const addedKeywords = await KeywordTracking.insertMany(createdRecords);
//     console.log(addedKeywords, "campagign return keywrods");

//     if (!addKeyword) {
//       return { error: "Error while adding keyword" };
//     }
//     return {
//       success: true,
//       message: "Keyword & compaign Added Successfully",
//       addedKeywords,
//     };
//   } catch (error) {
//     console.log(error);

//     return { error: "Internal Server Error." };
//   }
// };

export const getVolumnRank = async (KeywordData: any) => {
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

    console.log(volumnResponses, "volumn response");

    // const createdRecords: any[] = [];
    // const res = await getLocation_languageData();
    // const locationData = res?.allLocations;

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

    // console.log(createdRecords, "volumn records ✅");

    // const addedKeywords = await KeywordTracking.insertMany(createdRecords);
    // console.log(addedKeywords, "campagign return keywrods");

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

    const rankPayload: KeywordPayload[] = KeywordData.map(
      (keywordObj: any) => ({
        keyword: keywordObj.keywords,
        location_code: Number(keywordObj.searchLocationCode),
        language_name: keywordObj.language,
        target: `*${keywordObj.url}*`,
        device: keywordObj.deviceType,
        se_domain: keywordObj.SearchEngine,
      })
    );

    console.log(rankPayload, "rank payload compaign");

    const rankResponses: KeywordResponse[] = [];

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

    console.log(rankResponses[0].response.tasks[0].result, "rank response");

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
      message: "rank Data Successfully",
      rankResponses,
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
    console.log(result, "delete result");

    if (result.modifiedCount === 0) {
      return { error: "No keywords were updated" };
    }
    console.log(selectedKeywords, "delete keyword");
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

    const user = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized" };
    }

    const { keywordId, campaignId } = updatedData;

    // ✅ Update keyword document
    const updatedKeyword = await Keyword.findByIdAndUpdate(
      { _id: keywordId },
      { $set: updatedData },
      { new: true }
    );

    if (!updatedKeyword) {
      return { error: "Keyword not found" };
    }

    // 📡 Fetch rank + intent data
    const rankdata = await getKewordRank([updatedKeyword]);
    const intentData = await getRankIntent([updatedKeyword]);

    // 🏗 Build finalData
    const finalData: any =
      rankdata && "rankResponses" in rankdata
        ? rankdata?.rankResponses?.map((rankItem: any) => {
            const task = rankItem?.response?.tasks?.[0];
            const data = task?.result?.[0];
            const newKeyword = rankItem?.keyword;

            const matchedKeyword = [updatedKeyword].find(
              (k: any) =>
                k.keywords?.toLowerCase() === newKeyword?.toLowerCase()
            );

            const rankGroup = data?.items?.[0]?.rank_group ?? 0;

            return {
              type: task?.data?.se_type ?? "organic",
              location_code: matchedKeyword?.searchLocationCode ?? 2124,
              language_code: data?.language_code ?? "en",
              url: data?.items?.[0]?.url?.trim() ?? "no ranking",
              rank_group: rankGroup,
              rank_absolute: data?.items?.[0]?.rank_absolute ?? 0,
              keyword: newKeyword ?? "",
              searchVolumn: 0,
              checkUrl: data?.check_url ?? "no url",
              intent: "",
              competition: 0,
              campaignId: campaignId ?? "",
              keywordId: matchedKeyword?._id ?? "",
              start: rankGroup,
              updatedAt: new Date(),
            };
          })
        : [];

    const data = finalData?.[0];
    console.log(data,"update data");
    if (!data) {
      return { error: "No keyword data to update" };
    }

    // 🔄 Find previous record
    const oldTracking = await KeywordTracking.findOne({ keywordId });
    const now = new Date();

    let rankChange = 0;
    let changeDirection: "up" | "down" | "" = "";

    if (oldTracking) {
      const oldRank = oldTracking.rank_group ?? 0;
      const newRank = data.rank_group ?? 0;

      const lastUpdate = oldTracking.lastUpdatedAt;
      const daysSinceUpdate = lastUpdate
        ? (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24)
        : 999;

      if (daysSinceUpdate >= 7) {
        // ✅ Only recalc if 7+ days passed
        const diff = oldRank - newRank;
        if (oldRank > 0 && newRank > 0 && oldRank !== newRank) {
          if (diff > 0) {
            rankChange = diff;
            changeDirection = "up";
          } else {
            rankChange = Math.abs(diff);
            changeDirection = "down";
          }
        }
        data.lastUpdatedAt = now;
      } else {
        // ❌ Less than 7 days → preserve old values
        rankChange = oldTracking.rankChange ?? 0;
        changeDirection = oldTracking.changeDirection ?? "";
        data.lastUpdatedAt = oldTracking.lastUpdatedAt ?? now;
      }
    } else {
      // 🟢 First-time tracking
      const newRank = data.rank_group ?? 0;
      if (newRank > 0) {
        rankChange = newRank;
        changeDirection = "up";
      }
      data.lastUpdatedAt = now;
    }

    data.rankChange = rankChange;
    data.changeDirection = changeDirection;

    // 🛑 Ensure no null values
    Object.keys(data).forEach((key) => {
      if (data[key] === null) {
        data[key] = typeof data[key] === "string" ? "" : 0;
      }
    });

    // 💾 Save KeywordTracking
    const addedTracking = await KeywordTracking.findOneAndUpdate(
      { keywordId },
      {
        $set: data,
        $setOnInsert: { createdAt: now },
      },
      { new: true, upsert: true }
    );

    return {
      success: true,
      message: "Keyword updated with 7-day tracking",
      editedKeyword: [updatedKeyword],
      tracking: addedTracking,
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

  // Save new keyword docs
  // const addedKeywords = await Promise.all(
  //   (formData?.keyword || []).map(async (kwStr: string) => {
  //     return await Keyword.create({
  //       ...formData, // includes language, device, location, etc.
  //       keywords: kwStr, // the actual keyword string
  //       userId: user.id,
  //       CampaignId: campaign._id,
  //     });
  //   })
  // );


  //   const addedKeywords = await Promise.all(
  //   (formData?.keyword || []).map(async (kwStr: string) => {
  //     // Check if keyword already exists for this user & campaign
  //     const exists = await Keyword.findOne({
  //       keywords: kwStr,
  //       userId: user.id,
  //       CampaignId: campaign._id,
  //     });
  //     console.log(exists, "exists keyword");

  //     if (exists) {
  //       // Skip duplicates, return null so it won’t be added
  //       return null;
  //     }

  //     return await Keyword.create({
  //       ...formData, // includes language, device, location, etc.
  //       keywords: kwStr, // the actual keyword string
  //       userId: user.id,
  //       CampaignId: campaign._id,
  //     });
  //   })
  // );

  // const addedKeywords = await Promise.all(
  //   (formData?.keyword || []).map(async (kwStr: string) => {
  //     // Check if keyword already exists for this user & campaign
  //     const exists = await Keyword.findOne({
  //       keywords: kwStr,
  //       // userId: user.id,
  //       CampaignId: campaign._id,
  //     });

  //     if (exists) {
  //       console.log(exists, "exists keyword if");

  //       console.log("duplicate entry", kwStr);
  //       return null;
  //     }
  //     console.log("exists keyword else", kwStr);
  //     const newKey = await Keyword.create({
  //       ...formData,
  //       keywords: kwStr,
  //       userId: user.id,
  //       CampaignId: campaign._id,
  //     });
  //     console.log(newKey);
  //   })
  // );

  // console.log(addedKeywords, "added keywords");



formData.keyword = Array.from(new Set(formData?.keyword || []));
 
  
  const existingKeywords = await Keyword.find({
    keywords: { $in: formData.keyword },
    userId: user.id,
    CampaignId: campaign._id,
  }).distinct("keywords");


 console.log(existingKeywords,"existingKeywords");

  formData.keyword = formData.keyword.filter(
    (kwStr:any) => !existingKeywords.includes(kwStr)
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
 
 
      console.log(createdKeywords, "created keywords");



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
