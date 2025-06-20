"use server"
import { redirect } from "next/navigation";
import { getCampaign, newCampaign } from "./queries";
import { addMultipleKeyword } from "../keyword";

export const createCampaign = async (formData: any) => {
  console.log(formData);
  
  const campaign = await newCampaign(formData);
  if(campaign){
    await addMultipleKeyword(formData?.keywords)
  }
  return campaign;
};

export const getUserCampaign=async ()=>{
  const campaign= await getCampaign()
  return campaign
}