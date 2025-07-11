import { createNewKeywordTrackingData, getDbLiveKeywordData } from "@/actions/keywordTracking";
import { getKeywordLiveData } from "@/actions/liveKeywords";
import { getLocation_languageData } from "@/actions/locations_Language";
import SearchConsoleData from "@/components/GoogleConsole/SearchConsole";
import LiveKeywordComponent from "@/components/KeywordTracking/LiveKeywordComponent";
import SearchAnalytics from "@/components/SearchAnalytics/SearchAnalytics";
import APIKeyword from "@/lib/KeywordApi.json"
export default async function DashboardDetails({
  params,
}: {
  // params: Promise<{ campaignId: string }>;
    params: { campaignId: string };
}) {
  const { campaignId } = await params;
const campaignLiveKeywordsData = await getDbLiveKeywordData(campaignId)
 const location_and_language = await getLocation_languageData();



  if (
    !location_and_language ||
    location_and_language.error ||
    !location_and_language.allLanguages ||
    !location_and_language.allLocations
  ) {
    return <div>Error loading location and language data</div>;
  }

  const { allLanguages, allLocations } = location_and_language;

  // await getDbLiveKeywordData(campaignId)
//   const liveKeywordsDataAPI = await getKeywordLiveData(campaignId);
//   console.log(JSON.stringify(liveKeywordsDataAPI), "liveKeywordsDataAPI");


// if (Array.isArray(liveKeywordsDataAPI)) {
//  const keywordData = liveKeywordsDataAPI.map((item) => {
//   return {
//     Keyword: item?.keyword,
//     Response: item?.response?.[0]?.tasks || [], // Fix: access tasks from first response item
//     CampaignId:campaignId,
//   };
// }); 

// console.log(keywordData,"arry")

//   const FetchKeyWordsDb = await createNewKeywordTrackingData(keywordData);
//   console.log(FetchKeyWordsDb,"db DAta")

// } else {
//   console.error("Error:", liveKeywordsDataAPI.error);
// }



  return (
    <section className=" liveKeywordTracking p-3 mt-10">
      {/* <SearchConsoleData />
      <SearchAnalytics /> */}
      <LiveKeywordComponent  campaignLiveKeywordsData={campaignLiveKeywordsData} campaignId={campaignId} />
    </section>
  );
}
