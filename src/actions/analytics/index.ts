"use server"

import { AnalyticsData, fetchLievKeyword, googleAnalyticsAccountID, googleAnalyticsPropertyID, propertyIdForDB } from "./queries";

export const getLiveKeywordData=async (url:string)=>{
    const keyword=await fetchLievKeyword(url)
    // console.log(keyword);
    
    return keyword
}


export const getGoogleAnalyticsAccountID = async (access_token: string,nameMatch : string) => {
  const data = await googleAnalyticsAccountID(access_token,nameMatch);

  return data;
};
export const getGoogleAnalyticsPropertyID = async (access_token: string , accountId: string,nameMatch : string) => {
  const data = await googleAnalyticsPropertyID(access_token, accountId,nameMatch);

  return data;
};
export const getAnalyticsData = async (access_token: string,date:any,propertyId:string,campaignId:string ) => {
  const data = await AnalyticsData(access_token,date,propertyId,campaignId);

  return data;
};

export const setPropertyIdForDB = async (
  campaignId: string,
  tokenResult: {},
  projectUrl: any
) => {
  const data = await propertyIdForDB(campaignId, tokenResult, projectUrl);

  return data;
};