"use client";

import { useEffect, useState } from "react";
import { FaRocket } from "react-icons/fa6";

import {
  CreateArchivedCampaign,
  getArchivedCampaign,
  getCampaignStatus2,
  getCompaignCount,
  getUserCampaign,
} from "@/actions/campaign";
import {
  getDbKeywordStatusData,
  getDbTopLiveKeywordData,
} from "@/actions/keywordTracking";
import Navbar from "@/components/Common/Navbar";
import SidebarWrapper from "@/components/Common/SidebarWrapper";
import CustomTrackingCard from "@/components/KeywordTracking/CustomTrackingCard";
import FilterTabs from "@/components/dashboard/FilterTabs";
import NewCustomTable from "@/components/NewCustomTable";
import { FaArchive } from "react-icons/fa";
import { TbRestore } from "react-icons/tb";
import { MdDeleteForever } from "react-icons/md";
import { Link, Router } from "lucide-react";
import { useRouter } from "next/navigation";

interface TableData {
  name: string ;
  date: string;
  // integration: string;
  // searcher: string;
  // audit: number;
  kwds: number;
  // backlinks: number;
  top3: number;
  top10: number;
  top20: number;
  top30: number;
  top100: number;
}

const DashboardClient = () => {
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tabSelected, setTabSelected] = useState("Active Campaigns");

  const [topKeywordsCount, setTopKeywordsCount] = useState(0);
  const [campaignCount, setCampaignCount] = useState(0);
  const [archivedCampaigns, setArchivedCampaigns] = useState<any[]>([]);
  const [campaignStatus, setCampaignStatus] = useState<number>(1);
  const [activeComapignCount, setActiveComapignCount] = useState<number>(0);
  const [archivedComapignCount, setArchivedComapignCount] = useState<number>(0);
  const router = useRouter();
  const handleArchivedCampaigns = () => {
    setTabSelected("Archived Campaigns");
    setCampaignStatus(2)
  };
  const handleActiveCampaigns = () => {
    setTabSelected("Active Campaigns");
    setCampaignStatus(1)
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const archived = await getArchivedCampaign();
        const keywords = await getDbTopLiveKeywordData();
        const campaignStatus1 = await getUserCampaign();
        const campaignCountData = await getCompaignCount();


             if(archived.error === "Unauthorized please login") {
        window.dispatchEvent(new Event("session-expired"));
        return
      }
        setArchivedComapignCount(
          archived?.KeywordTrackingDataArchied?.length ?? 0
        );
        setActiveComapignCount(campaignStatus1?.campaign?.length ?? 0);

        const dbStatusWiseData = await getDbKeywordStatusData(campaignStatus);

        const campaignStatusData = dbStatusWiseData?.campaignDatastatus;
        const keywordStatusData = dbStatusWiseData?.keywordDatastatus;

        console.log(campaignStatusData, "comapignStatusData");
        console.log(keywordStatusData, "keywordStatusData");

        setArchivedCampaigns(archived?.KeywordTrackingDataArchied ?? []);
        setTopKeywordsCount(keywords?.TopLiveKeywordDbData?.length ?? 0);
        setCampaignCount(campaignCountData?.campaignCount?.length ?? 0);

     
        const tabledata = campaignStatusData?.map((campaign: any) => {
          const campaignId = campaign._id;

          // Get all keyword entries for this campaign
          const keywordsForCampaign =
            keywordStatusData?.filter(
              (item: any) => item?.campaignId === campaignId
            ) || [];
          console.log(keywordsForCampaign, " keywordForCampaign");

          // Sum up all top rank values
          // const totalRanks = {
          //   top3: 0,
          //   top10: 0,
          //   top20: 0,
          //   top30: 0,
          //   top100: 0,
          // };

          // keywordsForCampaign.forEach((kw: any) => {
          //   totalRanks.top3 += kw?.top3 || 0;
          //   totalRanks.top10 += kw?.top10 || 0;
          //   totalRanks.top20 += kw?.top20 || 0;
          //   totalRanks.top30 += kw?.top30 || 0;
          //   totalRanks.top100 += kw?.top100 || 0;
          // });
          // console.log(keywordsForCampaign,'keywordForCampaignSet');

          // Flatten all rank_group values from keywordsForCampaign
          const allRankGroups = keywordsForCampaign
            .flatMap((kw: any) => kw.rank_group)
            .filter((rank: number) => rank > 0); // Only valid positive ranks

          // Compute top rank stats from the combined rank groups
          const totalRanks = {
            top3: allRankGroups.filter((r: number) => r <= 3).length,
            top10: allRankGroups.filter((r: number) => r <= 10).length,
            top20: allRankGroups.filter((r: number) => r <= 20).length,
            top30: allRankGroups.filter((r: number) => r <= 30).length,
            top100: allRankGroups.filter((r: number) => r <= 100).length,
          };


          // console.log(keywordsForCampaign, "keywordForCampaignSet");
          console.log(totalRanks, "flattened ranks");



          // Format created date
          const mongoDate = new Date(campaign.createdAt);
          const formatted = mongoDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
          });

          return {
            name: campaign.projectUrl || "",
            date: formatted,
            kwds: keywordsForCampaign.length || 0,
            top3: totalRanks.top3,
            top10: totalRanks.top10,
            top20: totalRanks.top20,
            top30: totalRanks.top30,
            top100: totalRanks.top100,
            action:
              campaignStatus === 2 ? (
                <div className="flex gap-2">
                  <button
                    title="Restore"
                    onClick={() => handleRestore(campaignId)}
                  >
                    <TbRestore className="w-4 h-4 text-green-600 hover:text-green-700" />
                  </button>
                  <button
                    title="Delete Forever"
                    onClick={() => handleDelete(campaignId)}
                  >
                    <MdDeleteForever className="w-4 h-4 text-red-500 hover:text-red-700" />
                  </button>
                </div>
              ) : null,
          };
        });

        console.log(tabledata, "tabledata inside");

        setTableData(tabledata ?? []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);
  const handleDelete = async (campaignId: string) => {
    try {
      // 1. First, archive/delete the campaign in DB
      const confirmed = confirm(
        "Are you sure you want to delete this campaign Forever?"
      );
      if (!confirmed) return;
      const status = 3; // Status for "deleted"
      const deleteResponse = await CreateArchivedCampaign(campaignId, status);
      // console.log(deleteResponse, "Deleted campaign response");

      // 2. Refetch data to update dashboard
      const [
        archived,
        keywords,
        campaignStatus1,
        campaignCountData,
        dbStatusWiseData,
      ] = await Promise.all([
        getArchivedCampaign(),
        getDbTopLiveKeywordData(),
        getUserCampaign(),
        getCompaignCount(),
        getDbKeywordStatusData(campaignStatus),
      ]);

      const campaignStatusData = dbStatusWiseData?.campaignDatastatus ?? [];
      const keywordStatusData = dbStatusWiseData?.keywordDatastatus ?? [];

      setArchivedComapignCount(
        archived?.KeywordTrackingDataArchied?.length ?? 0
      );
      setActiveComapignCount(campaignStatus1?.campaign?.length ?? 0);
      setArchivedCampaigns(archived?.KeywordTrackingDataArchied ?? []);
      setTopKeywordsCount(keywords?.TopLiveKeywordDbData?.length ?? 0);
      setCampaignCount(campaignCountData?.campaignCount?.length ?? 0);

      // 3. Format table data
      const tableData = campaignStatusData.map((item: any) => {
        const keywordsData = keywordStatusData.find(
          (k: any) => k.campaignId === item._id
        );

        const keywordsCount = keywordStatusData.filter(
          (k: any) => k.campaignId === item._id
        );

        const formattedDate = new Date(item?.createdAt).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "short",
            day: "2-digit",
          }
        );

        return {
          name: item?.projectUrl || "",
          date: formattedDate,
          // integration: keywordsData?.integration || "GSC",
          searcher: keywordsData?.language_code || "US",
          // audit: keywordsData?.audit || 25,
          kwds: keywordsCount?.length || 0,
          top3: keywordsData?.top3 || 0,
          top10: keywordsData?.top10 || 0,
          top20: keywordsData?.top20 || 0,
          top30: keywordsData?.top30 || 0,
          top100: keywordsData?.top100 || 0,
          // backlinks: keywordsData?.backlinks || 0,
          ...(campaignStatus === 2 && {
            action: (
              <div className="flex gap-2">
                <button title="Restore" onClick={() => handleRestore(item._id)}>
                  <TbRestore className="w-4 h-4 text-green-600 hover:text-green-700" />
                </button>
                <button
                  title="Delete Forever"
                  onClick={() => handleDelete(item._id)}
                >
                  <MdDeleteForever className="w-4 h-4 text-red-500 hover:text-red-700" />
                </button>
              </div>
            ),
          }),
        };
      });

      setTableData(tableData ?? []);
    } catch (error) {
      console.error("Error deleting campaign and refreshing data:", error);
    }
  };

  const handleRestore = async (CompaignId: string) => {
    const confirmed = confirm(
      "Are you sure you want to restore this campaign?"
    );
    if (!confirmed) return;
    const status = 1;
    const restore = await CreateArchivedCampaign(CompaignId, status);
    router.push(`/dashboard/${CompaignId}`);
  };
    useEffect(() => {
      const fetchData = async () => {
        try {
          const archived = await getArchivedCampaign();
          const keywords = await getDbTopLiveKeywordData();
          const campaignStatus1 = await getUserCampaign();
          const campaignCountData = await getCompaignCount();
                  if(archived.error === "Unauthorized please login") {
        window.dispatchEvent(new Event("session-expired"));
        return
      }
          setArchivedComapignCount(
            archived?.KeywordTrackingDataArchied?.length ?? 0
          );
          setActiveComapignCount(campaignStatus1?.campaign?.length ?? 0);
          const dbStatusWiseData = await getDbKeywordStatusData(campaignStatus);

          const campaignStatusData = dbStatusWiseData?.campaignDatastatus;
          const keywordStatusData = dbStatusWiseData?.keywordDatastatus;

          console.log(campaignStatusData, "comapignStatusData");

          // inside campaignStatus we have 1 or 2 if one we not show restore icon and delete icon if 2 we show restore icon and delete icon (note:campaignStatus already is store inside usestate)
          setArchivedCampaigns(archived?.KeywordTrackingDataArchied ?? []);
          setTopKeywordsCount(keywords?.TopLiveKeywordDbData?.length ?? 0);
          setCampaignCount(campaignCountData?.campaignCount?.length ?? 0);

       
            const tabledata = campaignStatusData?.map((campaign: any) => {
            const campaignId = campaign._id;

            // Get all keyword entries for this campaign
            const keywordsForCampaign =
              keywordStatusData?.filter(
                (item: any) => item?.campaignId === campaignId
              ) || [];
            console.log(keywordsForCampaign, " keywordForCampaign");

            // Sum up all top rank values
            // const totalRanks = {
            //   top3: 0,
            //   top10: 0,
            //   top20: 0,
            //   top30: 0,
            //   top100: 0,
            // };

            // keywordsForCampaign.forEach((kw: any) => {
            //   totalRanks.top3 += kw?.top3 || 0;
            //   totalRanks.top10 += kw?.top10 || 0;
            //   totalRanks.top20 += kw?.top20 || 0;
            //   totalRanks.top30 += kw?.top30 || 0;
            //   totalRanks.top100 += kw?.top100 || 0;
            // });
            // console.log(keywordsForCampaign,'keywordForCampaignSet');

            // Flatten all rank_group values from keywordsForCampaign
            const allRankGroups = keywordsForCampaign
              .flatMap((kw: any) => kw.rank_group)
              .filter((rank: number) => rank > 0); // Only valid positive ranks

            // Compute top rank stats from the combined rank groups
            const totalRanks = {
              top3: allRankGroups.filter((r: number) => r <= 3).length,
              top10: allRankGroups.filter((r: number) => r <= 10).length,
              top20: allRankGroups.filter((r: number) => r <= 20).length,
              top30: allRankGroups.filter((r: number) => r <= 30).length,
              top100: allRankGroups.filter((r: number) => r <= 100).length,
            };


            // console.log(keywordsForCampaign, "keywordForCampaignSet");
            console.log(totalRanks, "flattened ranks");



            // Format created date
            const mongoDate = new Date(campaign.createdAt);
            const formatted = mongoDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            });

            return {
              campaignId:campaignId,
              name: campaign.projectUrl,
              date: formatted,
              kwds: keywordsForCampaign.length || 0,
              top3: totalRanks.top3,
              top10: totalRanks.top10,
              top20: totalRanks.top20,
              top30: totalRanks.top30,
              top100: totalRanks.top100,
              action:
                campaignStatus === 2 ? (
                  <div className="flex gap-2">
                    <button
                      title="Restore"
                      onClick={() => handleRestore(campaignId)}
                    >
                      <TbRestore className="w-4 h-4 text-green-600 hover:text-green-700" />
                    </button>
                    <button
                      title="Delete Forever"
                      onClick={() => handleDelete(campaignId)}
                    >
                      <MdDeleteForever className="w-4 h-4 text-red-500 hover:text-red-700" />
                    </button>
                  </div>
                ) : null,
            };
          });


          setTableData(tabledata ?? []);
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        }
      };

      fetchData();
    }, [campaignStatus]);

    const tableHeader = [
      { key: "name", label: "Campaign Name" },
      { key: "date", label: "Date Added" },
      // { key: "integration", label: "Integration" },
      // { key: "searcher", label: "Searcher" },
      // { key: "audit", label: "Audit Score" },
      { key: "top3", label: "top 3" },
      { key: "top10", label: "top 10" },
      { key: "top20", label: "top 20" },
      { key: "top30", label: "top 30" },
      { key: "top100", label: "top 100" },
      { key: "kwds", label: "Kwds" },
      // { key: "backlinks", label: "Backlinks" },
      ...(campaignStatus === 2 ? [{ key: "action", label: "Action" }] : []),
    ];

  // Filter table data based on search
  const filteredData = tableData.filter((item) =>
    item?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );
  console.log(filteredData, "filteredData");
  console.log(tableData, "tableDataDashboard");

  return (
    <section className="relative h-screen flex flex-col overflow-hidden">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar campaignId={"898"} />
      </div>

      <div className="flex flex-1 pt-[80px] overflow-hidden">
        <aside className="w-[250px] h-full fixed left-0 top-[20px] z-40">
          <SidebarWrapper
            
            archivedCampaignData={archivedCampaigns}
          />
        </aside>

        <main className="ml-[250px] flex-1 overflow-y-auto p-4">
          <div className="p-6 space-y-6">
            <div className="flex gap-3">
              <CustomTrackingCard
                className={"W-[150px] h-[150px] bg-gray-400 "}
                title="Active Keywords"
                data={topKeywordsCount}
              />
              <CustomTrackingCard
                className={"W-[150px] h-[150px] bg-gray-400 "}
                title="Total Campaigns"
                data={campaignCount}
              />
            </div>

            <div className="flex justify-between mt-10 items-center">
              <div className="flex gap-3 justify-center items-center">
                <button
                  onClick={() => {
                    handleActiveCampaigns();
                    setCampaignStatus(1);
                  }}
                  className={`relative text-sm  rounded-full border-gray-400 border-b-2 hover:bg-orange-100 p-3 flex justify-center items-center gap-2 font-semibold ${tabSelected === "Active Campaigns" ? "bg-orange-100" : ""}`}
                >
                  <FaRocket className="text-sm text-orange-600" /> Active
                  Campaigns ({activeComapignCount})
                </button>
                <button
                  onClick={() => {
                    handleArchivedCampaigns();
                    setCampaignStatus(2);
                  }}
                  className={`  relative text-sm  border-b-2  rounded-full border-gray-400 p-3 hover:bg-orange-100 flex justify-center items-center gap-2 font-semibold ${tabSelected === "Archived Campaigns" ? "bg-green-100" : ""}`}
                >
                  <FaArchive className="text-sm text-green-600" /> Archived
                  Campaigns ({archivedComapignCount})
                </button>
              </div>
              <input
                type="text"
                placeholder="Search campaigns..."
                className="border p-3 rounded-full w-1/3"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* <FilterTabs /> */}

            <NewCustomTable
              campaignStatus={campaignStatus}
              tableData={filteredData ?? []}
              tableHeader={tableHeader}
            />
          </div>
      {/* <Footer/> */}
        </main>
        
      </div>
    </section>
  );
};

export default DashboardClient;
