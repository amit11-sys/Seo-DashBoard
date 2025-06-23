"use server";
import { redirect } from "next/navigation";
import { getCampaign, newCampaign, saveKeywordId} from "./queries";
import { addMultipleKeyword } from "../keyword";

export const createCampaign = async (formData: any) => {
  // console.log(formData);

  const campaign = await newCampaign(formData);
  if (campaign) {
    const addKeyword = await addMultipleKeyword(formData?.allkeywords);
    const { _id: campaignId } = campaign?.campaign || {};

    if (addKeyword) {
      const { _id: keywordId } = addKeyword?.addKeyword || {};
      await saveKeywordId(keywordId, campaignId);
    }
  }
  return campaign;
};

export const getUserCampaign = async () => {
  const campaign = await getCampaign();
  return campaign;
};
