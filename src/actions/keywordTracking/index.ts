import {  DbKeywordStatusData, DbLiveKeywordData, DbTopLiveKeywordData, editDataFetchDb, fetchDBlocationData, firstCompaignData, getStartData, getUserKeywordData, LiveKeywordDatabyKeyID } from "./queries";


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
export const getfetchDBlocationData =async (locationcode: number)=>{
  const locationData= await fetchDBlocationData(locationcode) 
  return locationData
}
export const getLiveKeywordDatabyKeyID =async (keywordId: string)=>{
  const data= await LiveKeywordDatabyKeyID(keywordId) 
  return data
}
export const getfirstCompaignData =async ()=>{
  const data= await firstCompaignData() 
  return data
}
export const getEditDataFetchDb =async (keywordId:string)=>{
  const data= await editDataFetchDb(keywordId) 
  return data
}
export const getDbTopLiveKeywordData =async ()=>{
  const data= await DbTopLiveKeywordData() 
  return data
}
export const getDbKeywordStatusData =async (statusCode:number)=>{
  const data= await DbKeywordStatusData(statusCode) 
  return data
}