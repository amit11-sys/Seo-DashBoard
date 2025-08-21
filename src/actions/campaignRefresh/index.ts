"use server"
// import { agenda, startAgenda } from "@/lib/agenda";


// import { addToQueue } from "@/lib/jobQueue"
import { refreshAddedKeywords, RefreshSingleKeyword } from "./queries"

export const getRefreshCampaign=async (campaignId:string)=>{
  const NewRefreshCampaign= await refreshAddedKeywords(campaignId)
 
  return NewRefreshCampaign
}
export const getRefreshSingleKeyword=async (keywordId:string)=>{
  const NewSingleRefreshCampaign= await RefreshSingleKeyword(keywordId)
 
  return NewSingleRefreshCampaign
}

// export async function queueRefreshKeywords(campaignId: string) {
//   addToQueue(() => refreshAddedKeywords(campaignId))
//   return { success: true, message: "Job added to queue" }
// }
// export async function queueRefreshKeywords(campaignId: string) {
//   addToQueue(async () => {
//     await refreshAddedKeywords(campaignId)
//   })

//   return { success: true, message: "Job added to queue" }
// }


// export async function queueRefreshKeywords(campaignId: string) {
//   addToQueue(async () => {
//     await refreshAddedKeywords(campaignId)
//   })

//   return { success: true, message: "Job added to queue" }
// }




// export async function queueRefreshKeywords(campaignId: string) {
//   await startAgenda();
//   await agenda.now("refreshKeywords", { campaignId }); // enqueue job
//   return { success: true, message: "Job queued for campaign " + campaignId };
// }


// export async function queueRefreshKeywords(campaignId: string) {
//   await agenda?.now("refreshKeywords", { campaignId });
//   return { success: true, message: `Job queued for ${campaignId}` };
// }

// import { agenda, startAgenda } from "@/lib/agenda";

// export async function queueRefreshKeywords(campaignId: string) {
//   await startAgenda(); // <-- ensure agenda is running
//   await agenda.now("refreshKeywords", { campaignId });
//   return { success: true, message: `Job queued for ${campaignId}` };
// }
