import {
  // getAuthToken,
  googleAnalyticsAccountID,
  googleAnalyticsPropertyID,
  GoogleConsoleDataByDate,
  GoogleSearchDataByDimension,
  refreshGoogleAccessToken,
} from "./queries";

export const googleAuthHandler = async (code: any) => {

  if (!code) {
    console.log("error in code recieved ");
  }

};
export const getGoogleConsoleDataByDate = async (newCompaignId: any,date:any) => {
  const data = await GoogleConsoleDataByDate(newCompaignId,date);

  return data;
};
          
export const getGoogleSearchDataByDimension = async (newCompaignId: any,dimension:any,date:any) => {
  const data = await GoogleSearchDataByDimension(newCompaignId,dimension,date);

  return data;
};
          
export const getRefreshGoogleAccessToken = async (newCompaignId: string) => {
  const data = await refreshGoogleAccessToken(newCompaignId);

  return data;
};
export const getGoogleAnalyticsAccountID = async (access_token: string,nameMatch : string) => {
  const data = await googleAnalyticsAccountID(access_token,nameMatch);

  return data;
};
export const getGoogleAnalyticsPropertyID = async (access_token: string , accountId: string,nameMatch : string) => {
  const data = await googleAnalyticsPropertyID(access_token, accountId,nameMatch);

  return data;
};