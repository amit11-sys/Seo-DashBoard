import { MapsData } from "./queries"

export const getMapsData=async ()=>{
  const NewRefreshCampaign= await MapsData()
 
  return NewRefreshCampaign
}