import { getUserKeywordData,getLiveData } from "./queries"


export const UserKeywordData=async ()=>{
  const DataKeywords= await getUserKeywordData()
  return DataKeywords
}