import { refreshAddedKeywords, RefreshSingleKeyword } from "./queries"

export const getRefreshCampaign=async (campaignId:string)=>{
  const NewRefreshCampaign= await refreshAddedKeywords(campaignId)
 
  return NewRefreshCampaign
}
export const getRefreshSingleKeyword=async (keywordId:string)=>{
  const NewSingleRefreshCampaign= await RefreshSingleKeyword(keywordId)
 
  return NewSingleRefreshCampaign
}