"use server";

import { CurrentCampaignIdData, DbCompaignDataUpdate, DBcompaignGoogleData, getCampaign, newCampaign, propertyIdForDB } from "./queries";
import { addMultipleKeyword } from "../keyword";
import {
  // createNewKeywordTrackingData,
  getTrackingData,
} from "../keywordTracking";
// import { getKeywordLiveData } from "../liveKeywords";

export const createCampaign = async (formData: any) => {
  console.log(formData,"in index campaign");

  const campaign = await newCampaign(formData);
  // console.log(campaign,"from index")

  if (campaign) {
    // await addMultipleKeyword(formData?.keywords)
    await addMultipleKeyword(formData, campaign);

    // const newCompaignId = campaign?.campaign?._id;
    // console.log(newCompaignId,"nreeeeeee")

    // await getTrackingData(newCompaignId);

    // const liveKeywordsDataAPI = await getKeywordLiveData(newCompaignId);

    // // console.log(JSON.stringify(liveKeywordsDataAPI, null, 2), "liveKeywordsDataAPI");

    // if (Array.isArray(liveKeywordsDataAPI)) {
    //   const keywordData = liveKeywordsDataAPI.map((item) => {
    //     const tasks = item?.response?.tasks || [];

    //     return {
    //       keyword: item?.keyword, // use lowercase for consistency
    //       response: tasks, // pass the array of tasks
    //       campaignId: newCompaignId, // keep _id as is (ObjectId)
    //     };
    //   });

    //   const dbResult = await createNewKeywordTrackingData(keywordData);

      
    //   console.log(dbResult, "Tracking DB Result");

    // } else {
    //   console.error("Invalid response format:", liveKeywordsDataAPI);
    // }


  }


  return campaign;
};

export const getUserCampaign = async () => {
  const campaign = await getCampaign();

  return campaign;
};
export const getDbCompaignDataUpdate = async (newCompaignId: string,tokenResult:{}) => {
  const updatedcampaign = await DbCompaignDataUpdate(newCompaignId,tokenResult);

  return updatedcampaign;
};
export const getDBcompaignGoogleData = async (newCompaignId: string) => {
  const data = await DBcompaignGoogleData(newCompaignId);

  return data;
};

export const getCurrentCampaignIdData = async (campaignId: string) => {
  const data = await CurrentCampaignIdData(campaignId);

  return data;
};
export const setPropertyIdForDB = async (campaignId: string,tokenResult:{},projectUrl:any) => {
  const data = await propertyIdForDB(campaignId,tokenResult,projectUrl);

  return data;
};

