import { createNewKeywordTrackingData } from "@/actions/keywordTracking";
import { getKeywordLiveData } from "@/actions/liveKeywords";
import SearchConsoleData from "@/components/GoogleConsole/SearchConsole";
import LiveKeywordComponent from "@/components/KeywordTracking/LiveKeywordComponent";
import SearchAnalytics from "@/components/SearchAnalytics/SearchAnalytics";
import APIKeyword from "@/lib/KeywordApi.json"
export default async function DashboardDetails({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const { campaignId } = await params;
 
  const liveKeywordsDataAPI = await getKeywordLiveData(campaignId);
  // console.log(liveKeywordsDataAPI, "ui");


if (Array.isArray(liveKeywordsDataAPI)) {
  const keywordData = liveKeywordsDataAPI.map((item) => { 
    return {
      Keyword: item?.keyword,
      Response: item?.response?.tasks, 
    }; 
  }); 

  console.log(keywordData, "array");

  const FetchKeyWordsDb = await createNewKeywordTrackingData(keywordData);

} else {
  console.error("Error:", liveKeywordsDataAPI.error);
}



  return (
    <section className=" liveKeywordTracking p-3 mt-10">
      <SearchConsoleData />
      <SearchAnalytics />
      <LiveKeywordComponent campaignId={campaignId} />
    </section>
  );
}
