import { createKeywordTracking, DbLiveKeywordData, getStartData, getUserKeywordData } from "./queries";

export const createNewKeywordTrackingData = async (keywordData: any) => {
  console.log(keywordData,"ok")
  
  const KeywordTracking = await createKeywordTracking(keywordData);

  // console.log(KeywordTracking,"from index")
  return KeywordTracking;
};

export const getTrackingData=async (newCompaignId:any)=>{
  const getKeywordData= await getUserKeywordData(newCompaignId) 
  return getKeywordData
}
export const getDbLiveKeywordData=async (newCompaignId:string)=>{
  const DbKeywordData= await DbLiveKeywordData(newCompaignId) 
  return DbKeywordData
}
export const updateStartDB =async (keywordId: string, newStartData: number)=>{
  const updatedData= await getStartData(keywordId,newStartData) 
  return updatedData
}