import { refreshAddedKeywords } from "./queries"

export const getRefreshCampaign=async (campaignId:string)=>{
  const NewRefreshCampaign= await refreshAddedKeywords(campaignId)
 
  return NewRefreshCampaign
}