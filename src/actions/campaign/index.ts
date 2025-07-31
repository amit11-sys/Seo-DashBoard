"use server";

import { getCampaign, newCampaign } from "./queries";
import { addMultipleKeyword } from "../keyword";

export const createCampaign = async (formData: any) => {
  // console.log(formData);

  const campaign = await newCampaign(formData);
  // console.log(campaign,"from index")

  if (campaign) {
    // await addMultipleKeyword(formData?.keywords)
    await addMultipleKeyword(formData, campaign);
  }

  return campaign;
};

export const getUserCampaign = async () => {
  const campaign = await getCampaign();

  return campaign;
};
