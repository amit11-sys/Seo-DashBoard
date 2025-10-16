import { campaignDataWithGoogleData, FetchGoogledata, GmailLoginDetails, SaveGoogleConsoleData } from "./queries";

export const GetGmailLoginDetails = async () => {
  const data = await GmailLoginDetails();
  return data;
};
export const getFetchGoogledata = async (integrationType: string, selectedGmail: string,campaignId:string,) => {
  const data = await FetchGoogledata(integrationType, selectedGmail,campaignId);
  return data;
};
export const getSaveGoogleConsoleData = async (siteUrl:string,permissionLevel:string,email:string,campaignId:string) => {
  const data = await SaveGoogleConsoleData(siteUrl,permissionLevel,email,campaignId)
    return data;
};
export const getCampaignDataWithGoogleData = async (campaignId:string,) => {
  const data = await campaignDataWithGoogleData(campaignId)
    return data;
};