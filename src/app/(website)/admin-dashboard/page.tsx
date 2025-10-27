import { getCompaignDataActiveArchived, getUserCampaign } from "@/actions/campaign";
import { getUserAccessData } from "@/actions/generateShareLink";
import AdminDashboard from "@/components/AdminDashboard/AdminDashboard";
import React from "react";

const page = async () => {
  const campaigns = await getCompaignDataActiveArchived();
  // const UserId = campignWithUserData?.user?.id;
  const userAcessData = await getUserAccessData();
  console.log(userAcessData,"datacesss")

  return (
    <>
      <AdminDashboard campaigns={campaigns?.compaignDataActiveArchived} userAcessData={userAcessData} />
    </>
  );
};

export default page;
