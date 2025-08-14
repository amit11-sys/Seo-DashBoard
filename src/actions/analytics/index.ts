"use server"

// import { fetchLievKeyword } from "./queries";
import { AnalyticsData, fetchLievKeyword, googleAnalyticsAccountID, googleAnalyticsPropertyID } from "./queries";

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
export const getAnalyticsData = async (access_token: string,propertyId:string ) => {
  const data = await AnalyticsData(access_token,propertyId);

  return data;
};