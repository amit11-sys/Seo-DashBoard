"use server";

import {
  deleteKeywordById,
  saveMultipleKeyword,
  updateKeywordById,
} from "./queries";

export const addMultipleKeyword = async (formData: {}, campaign: any) => {
  const addKeyword = await saveMultipleKeyword(formData, campaign?.campaign);
  return addKeyword;
};
type KeywordUpdateData = {
  url: string;
  searchLocationCode: number;
  keywordTag?: string;
  SearchEngine?: string;
  keywords: string; // changed from string[] to string
  volumeLocationCode?: number;
  language: string;
  serpType?: string;
  deviceType: string;
  campaignId: string;
  keywordId: string;
};

export const createUpdateKeywordById = async (
  updatedDataform: KeywordUpdateData
) => {
  // console.log(keyword,"rttdt");

  const updatedData = await updateKeywordById(updatedDataform);
  return updatedData;
};
export const deleteKeywordData = async (selectedKeywords: any) => {
  // console.log(keyword,"rttdt");

  const deleteKeyworddata = await deleteKeywordById(selectedKeywords);
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
