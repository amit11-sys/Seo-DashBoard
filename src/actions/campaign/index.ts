"use server";

import { archivedCampaign, ArchivedCampaignCreate, CampaignStatus2, CompaignCount, CurrentCampaignIdData, DbCompaignDataUpdate, DBcompaignGoogleData, getCampaign, GetCampaignByid, newCampaign, propertyIdForDB } from "./queries";
import { addMultipleKeyword } from "../keyword";
import {
  // createNewKeywordTrackingData,
  getTrackingData,
} from "../keywordTracking";
import Campaign from "@/lib/models/campaign.model";
import { CloudCog } from "lucide-react";
// import { getKeywordLiveData } from "../liveKeywords";

export const createCampaign = async (formData: any) => {
  console.log(formData);

  const campaign = await newCampaign(formData);
  // console.log(campaign,"from index")

  if (campaign) {
    if(formData?.keyword.length > 0){
      
      await addMultipleKeyword(formData, campaign);
    }else{
      return campaign;
    }

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

    //   // const dbResult = await createNewKeywordTrackingData(keywordData);

      
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

// export const getdeleteCampaign = async (CompaignId: string) => {
//   const data = await deleteCampaign(CompaignId);
//   return data;
// };
export const CreateArchivedCampaign = async (CompaignId: string,status:number ,topRankData?:any ) => {
  const data = await ArchivedCampaignCreate(CompaignId, status,topRankData);
  return data;
};
export const getArchivedCampaign = async () => {
  const data = await archivedCampaign();
  return data;
};
export const getCompaignCount = async () => {
  const data = await CompaignCount();
  return data;
};
export const getCampaignStatus2 = async () => {
  const data = await CampaignStatus2();
  return data;
};
export const getGetCampaignByid = async (campaignid: string) => {
  const data = await GetCampaignByid(campaignid);
  return data;
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

