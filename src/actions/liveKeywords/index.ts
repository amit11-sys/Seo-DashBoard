import { getUserKeywordData,getLiveData } from "./queries"


export const UserKeywordData=async ()=>{
  const DataKeywords= await getUserKeywordData()
  return DataKeywords
}
interface campaignId {
CampaignId:string

}
// export const getKeywordLiveData=async (CampaignId:string)=>{
//   const NewgetLiveData= await getLiveData(CampaignId)
//   return NewgetLiveData
// }