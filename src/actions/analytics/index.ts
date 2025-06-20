"use server"

import { fetchLievKeyword } from "./queries";

export const getLiveKeywordData=async (url:string)=>{
    const keyword=await fetchLievKeyword(url)
    // console.log(keyword);
    
    return keyword
}