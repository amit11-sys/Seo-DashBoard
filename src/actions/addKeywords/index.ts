import { addkeywords } from "./queries"

export const createNewkeywords=async (KeywordData:{})=>{
    const keyword=await addkeywords(KeywordData)
    // console.log(keyword, 'hahaha');
    
    return keyword
}