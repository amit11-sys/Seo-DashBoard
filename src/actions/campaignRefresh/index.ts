import { refreshCampaign } from "./queries"
interface campaignId {
    campaignId:string
}
export const getRefreshCampaign=async (campaignId:campaignId)=>{
  const NewRefreshCampaign= await refreshCampaign(campaignId)
 
  return NewRefreshCampaign
}