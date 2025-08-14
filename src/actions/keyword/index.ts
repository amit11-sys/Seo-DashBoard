"use server";

import {  deleteKeywordById,  saveMultipleKeyword, updateKeywordById } from "./queries";


export const addMultipleKeyword = async (formData: {},campaign:any) => {

  const addKeyword = await saveMultipleKeyword(formData,campaign?.campaign);
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


export const createUpdateKeywordById = async (updatedDataform:KeywordUpdateData) => {

  const updatedData = await updateKeywordById(updatedDataform);
  return updatedData;
};
export const deleteKeywordData = async (deletedData:any) => {

  const deleteKeyworddata = await deleteKeywordById(deletedData);
  return deleteKeyworddata;
};
interface compaigntype {
  _id: string;
}