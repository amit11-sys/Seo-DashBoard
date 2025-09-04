import { GenerateShareLink, validateShareToken } from "./queries"

export const getGenerateShareLink=async (userId: string,path: string,campignId:string)=>{
  const SharedLink= await GenerateShareLink(userId,path,campignId)
 
  return SharedLink
}
export const getValidateShareToken=async (  token : string)=>{
  const SharedLink= await validateShareToken( token)
 
  return SharedLink
}
