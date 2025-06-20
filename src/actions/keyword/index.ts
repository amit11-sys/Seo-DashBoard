"use server"

import { saveKeyword, saveMultipleKeyword } from "./queries"

export const addKeyword=async (keyword:string)=>{
    const addKeyword= await saveKeyword(keyword)
    return addKeyword
}

export const addMultipleKeyword=async (keyword:[])=>{
    console.log(keyword);
    
    const addKeyword=await saveMultipleKeyword(keyword);
    return addKeyword
}