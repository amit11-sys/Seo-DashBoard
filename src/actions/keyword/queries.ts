import { useCampaignData } from "@/app/context/CampaignContext";
import { getUserFromToken } from "@/app/utils/auth";
import { connectToDB } from "@/lib/db";
import Keyword from "@/lib/models/keyword.model";
// import User from "@/lib/models/user.model";
// import { getUserCampaign } from "../campaign";
import KeywordTracking from "@/lib/models/keywordTracking.model";
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
      intentResponses,
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
        target: keywordObj.url,
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

    console.log(rankResponses, "rank response");

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

export const updateKeywordById = async (updatedData: KeywordUpdateData) => {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized" };
    }

    const { keywordId, campaignId } = updatedData;
    // console.log(updatedData,"edit data backend")
    console.log(keywordId,campaignId,"idsies")

    // Update keyword document
    const updatedKeyword = await Keyword.findByIdAndUpdate(
      { _id: keywordId },
      { $set: updatedData },
      { new: true }
    );


    console.log(updatedKeyword, "updated keywoerds");
    if (!updatedKeyword) {
      return { error: "Keyword not found" };
    }
    console.log(updatedKeyword, ";updatedKeyword");

    const rankdata = await getKewordRank([updatedKeyword]);
    const VolumnData = await getVolumnRank([updatedKeyword]);
    const intentData = await getRankIntent([updatedKeyword]);

    console.log(rankdata?.rankResponses, "rankdata");
    console.log(VolumnData?.volumnResponses, "volumn data");
    console.log(intentData?.intentResponses, "intent data");

    // const finalData =
    //   rankdata && "rankResponses" in rankdata
    //     ? rankdata?.rankResponses?.map((rankItem: any) => {
    //         const task = rankItem?.response?.tasks?.[0];
    //         const data = task?.result?.[0];
    //         const newKeyword = rankItem?.keyword;
    //         const keyword = data?.keyword;

    //         const matchedKeyword = [updatedKeyword].find(
    //           (k: any) =>
    //             k.keywords?.toLowerCase() === newKeyword?.toLowerCase()
    //         );
    //         console.log(matchedKeyword, "indie map edit key");
    //         // Get corresponding volume data for this keyword
    //         const volumnResponse = VolumnData?.volumnResponses?.find(
    //           (v) => v.keyword?.[0]?.toLowerCase() === keyword?.toLowerCase()
    //         );
    //         const volumeItem =
    //           volumnResponse?.response?.tasks?.[0]?.result?.find(
    //             (v: any) => v.keyword?.toLowerCase() === keyword?.toLowerCase()
    //           );
    //         const matchSearchVolumn = volumeItem?.search_volume ?? 0;
    //         const matchcompetition = volumeItem?.competition ?? 0;

    //         // Get corresponding intent data for this keyword
    //         const intentResponse = intentData?.intentResponses?.find(
    //           (i) => i.keyword?.[0]?.toLowerCase() === keyword?.toLowerCase()
    //         );
    //         const intentItem =
    //           intentResponse?.response?.tasks?.[0]?.result?.[0]?.items?.find(
    //             (i: any) => {
    //               console.log(i, "inside intemt items");
    //               return i.keyword?.toLowerCase() === keyword?.toLowerCase();
    //             }
    //           );
    //         console.log(intentResponse, "intent itmes");
    //         console.log(intentItem, "intent item itmes");
    //         const matchIntent = intentItem?.keyword_intent?.label ?? "";

    //         return {
    //           type: task?.data?.se_type,
    //           location_code: matchedKeyword?.searchLocationCode || 2124,
    //           language_code: data?.language_code || "en",

    //           url: task?.data?.target?.trim() || "no ranking",
    //           rank_group: data?.items?.[0]?.rank_group || 0,
    //           rank_absolute: data?.items?.[0]?.rank_absolute || 0,
    //           keyword: matchedKeyword?.keywords || "",
    //           searchVolumn: matchSearchVolumn,
    //           intent: matchIntent,
    //           competition: matchcompetition,
    //           campaignId: campaignId,
    //           keywordId: matchedKeyword?._id,
    //         };
    //       })
    //     : [];
const finalData =
      rankdata && "rankResponses" in rankdata
        ? rankdata?.rankResponses?.map((rankItem: any) => {
            console.log(rankItem, "rankItem");
            const task = rankItem?.response?.tasks?.[0];
            const data = task?.result?.[0];
            const newKeyword = rankItem?.keyword;
            const keyword = data?.keyword;
            console.log(keyword, "keyword");
            const matchedKeyword = [updatedKeyword].find(
              (k) => k.keywords?.toLowerCase() === newKeyword?.toLowerCase()
            );
            console.log(matchedKeyword, "matchedKeyword");
            // Get corresponding volume data for this keyword
            const volumnResponse = VolumnData?.volumnResponses?.find(
              (v) => v.keyword?.[0]?.toLowerCase() === keyword?.toLowerCase()
            );
            const volumeItem =
              volumnResponse?.response?.tasks?.[0]?.result?.find(
                (v: any) => v.keyword?.toLowerCase() === keyword?.toLowerCase()
              );
            const matchSearchVolumn = volumeItem?.search_volume ?? 0;
            const matchcompetition = volumeItem?.competition ?? 0;

            // Get corresponding intent data for this keyword
            const intentResponse = intentData?.intentResponses?.find(
              (i) => i.keyword?.[0]?.toLowerCase() === keyword?.toLowerCase()
            );
            const intentItem =
              intentResponse?.response?.tasks?.[0]?.result?.[0]?.items?.find(
                (i: any) => {
                  console.log(i, "inside intemt items");
                  return i.keyword?.toLowerCase() === keyword?.toLowerCase();
                }
              );
            console.log(intentResponse, "intent itmes");
            console.log(intentItem, "intent item itmes");
            const matchIntent = intentItem?.keyword_intent?.label ?? "";

            // const matchLangName = locationData?.find(loc => loc.location_code === data?.location_code);

            return {
              type: task?.data?.se_type,
              location_code: matchedKeyword?.searchLocationCode || 2124,
              language_code: data?.language_code || "en",
              // location_name: matchLangName?.locationName || "",
              url: task?.data?.target?.trim() || "no ranking",
              rank_group: data?.items?.[0]?.rank_group || 0,
              rank_absolute: data?.items?.[0]?.rank_absolute || 0,
              keyword: newKeyword || "",
              searchVolumn: matchSearchVolumn || 0,
              intent: matchIntent || "",
              competition: matchcompetition || 0,
              campaignId: campaignId || "",
              keywordId: matchedKeyword?._id || "",
              // start: data?.items?.[0]?.rank_group || 0,
            };
          })
        : [];


            const data = finalData?.[0]
    const addedTracking = await KeywordTracking.findOneAndUpdate(
      { keywordId: keywordId },
      { $set: data },
      { new: true }
    );
    console.log(finalData, "final data");

    return {
      success: true,
      message: "Keyword updated ",
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

    const rankdata = await getKewordRank(addKeyword);
    const VolumnData = await getVolumnRank(addKeyword);
    const intentData = await getRankIntent(addKeyword);

    console.log(rankdata?.rankResponses, "rankdata");
    console.log(VolumnData?.volumnResponses, "volumn data");
    console.log(intentData?.intentResponses, "intent data");

    const finalData =
      rankdata && "rankResponses" in rankdata
        ? rankdata?.rankResponses?.map((rankItem: any) => {
            console.log(rankItem, "rankItem");
            const task = rankItem?.response?.tasks?.[0];
            const data = task?.result?.[0];
            const newKeyword = rankItem?.keyword;
            const keyword = data?.keyword;
            console.log(keyword, "keyword");
            const matchedKeyword = addKeyword.find(
              (k) => k.keywords?.toLowerCase() === newKeyword?.toLowerCase()
            );
            console.log(matchedKeyword, "matchedKeyword");
            // Get corresponding volume data for this keyword
            const volumnResponse = VolumnData?.volumnResponses?.find(
              (v) => v.keyword?.[0]?.toLowerCase() === keyword?.toLowerCase()
            );
            const volumeItem =
              volumnResponse?.response?.tasks?.[0]?.result?.find(
                (v: any) => v.keyword?.toLowerCase() === keyword?.toLowerCase()
              );
            const matchSearchVolumn = volumeItem?.search_volume ?? 0;
            const matchcompetition = volumeItem?.competition ?? 0;

            // Get corresponding intent data for this keyword
            const intentResponse = intentData?.intentResponses?.find(
              (i) => i.keyword?.[0]?.toLowerCase() === keyword?.toLowerCase()
            );
            const intentItem =
              intentResponse?.response?.tasks?.[0]?.result?.[0]?.items?.find(
                (i: any) => {
                  console.log(i, "inside intemt items");
                  return i.keyword?.toLowerCase() === keyword?.toLowerCase();
                }
              );
            console.log(intentResponse, "intent itmes");
            console.log(intentItem, "intent item itmes");
            const matchIntent = intentItem?.keyword_intent?.label ?? "";

            // const matchLangName = locationData?.find(loc => loc.location_code === data?.location_code);

            return {
              type: task?.data?.se_type,
              location_code: matchedKeyword?.searchLocationCode || 2124,
              language_code: data?.language_code || "en",
              // location_name: matchLangName?.locationName || "",
              url: task?.data?.target?.trim() || "no ranking",
              rank_group: data?.items?.[0]?.rank_group || 0,
              rank_absolute: data?.items?.[0]?.rank_absolute || 0,
              keyword: newKeyword || "",
              searchVolumn: matchSearchVolumn,
              intent: matchIntent,
              competition: matchcompetition,
              campaignId: campaign?._id,
              keywordId: matchedKeyword?._id,
              start: data?.items?.[0]?.rank_group || 0,
            };
          })
        : [];

    // const createdRecords: any[] = [];
    // const res = await getLocation_languageData();
    // const locationData = res?.allLocations;

    console.log(finalData, "data records ✅");

    const addedKeywords = await KeywordTracking.insertMany(finalData);
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
