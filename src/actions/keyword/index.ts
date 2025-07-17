"use server";

import {  deleteKeywordById,  saveMultipleKeyword, updateKeywordById } from "./queries";

// export const addKeyword=async (keyword:{})=>{
//     const addKeyword= await saveKeyword(keyword)
//     return addKeyword
// }

export const addMultipleKeyword = async (formData: {},campaign:any) => {
  // console.log(keyword,"rttdt");

  const addKeyword = await saveMultipleKeyword(formData,campaign?.campaign);
  return addKeyword;
};
type KeywordUpdateData = {
  keywords?: string; // changed from string to string[]
  SearchEngine?: string;
  deviceType?: string;
  keywordTag?: string;
  language?: string;
  searchLocation?: string;
  serpType?: string;
  url?: string;
  volumeLocation?: string;
  campaignId?: string; // optional: handle if needed
  keywordId:string;

};
export const createUpdateKeywordById = async (updatedDataform:KeywordUpdateData) => {
  // console.log(keyword,"rttdt");

  const updatedData = await updateKeywordById(updatedDataform);
  return updatedData;
};
export const deleteKeywordData = async (deletedData:any) => {
  // console.log(keyword,"rttdt");

  const deleteKeyworddata = await deleteKeywordById(deletedData);
  return deleteKeyworddata;
};
interface compaigntype {
  _id: string;
}
// export const getVolumnRank = async (KeywordData:any) => {
//   // console.log(keyword,"rttdt");

//   const volumnRankData = await volumnRank(KeywordData);
//   return volumnRankData;
// };
// export const getRankIntent = async (KeywordData:any) => {
//   // console.log(keyword,"rttdt");

//   const rankIntentData = await rankIntent(KeywordData);
//   return rankIntentData;
// };
// export const getKewordRank = async (KeywordData:any) => {
//   const kewordRankData = await kewordRank(KeywordData);
//   return kewordRankData;
// };
