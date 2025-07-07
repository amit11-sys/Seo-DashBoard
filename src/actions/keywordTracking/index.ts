import { createKeywordTracking, getUserKeywordData } from "./queries";

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