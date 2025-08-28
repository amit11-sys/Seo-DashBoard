import { GenerateShareLink } from "./queries"

export const getGenerateShareLink=async (userId: string,path: string)=>{
  const SharedLink= await GenerateShareLink(userId,path)
 
  return SharedLink
}