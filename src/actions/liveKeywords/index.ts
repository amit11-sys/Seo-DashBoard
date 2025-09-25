import { getUserKeywordData } from "./queries"


export const UserKeywordData=async ()=>{
  const DataKeywords= await getUserKeywordData()
  return DataKeywords
}
interface campaignId {
CampaignId:string

}

