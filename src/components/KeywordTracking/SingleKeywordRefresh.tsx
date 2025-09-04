"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { MdDelete } from "react-icons/md";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import CustomButton from "@/components/ui/CustomButton";
import { toast } from "sonner";
import { deleteKeywordData } from "@/actions/keyword";
import {
  getDbLiveKeywordData,
  getDbLiveKeywordDataWithSatusCode,
} from "@/actions/keywordTracking";
import { getRefreshSingleKeyword } from "@/actions/campaignRefresh";
import { IoRefreshCircle } from "react-icons/io5";
import { getGetCampaignByid } from "@/actions/campaign";

interface TablebodyItems {
  keyword: string;
  keywordId: string;
  status: number;
  location: string;
  intent: string;
  start: string;
  page: string;
  Absolute_Rank: string;
  Group_Rank: string;
  oneDay: string;
  sevenDays: string;
  thirtyDays: string;
  life: string;
  comp: string;
  sv: string;
  date: string;
  rankingUrl: string;
}

interface DeleteConfirmProps {
  campaignId: string;
  keyword: string;
  keywordId: string;
  setTableBody?: any;
  CardSetOnChanges?: any;
}

const SingleKeywordRefresh = ({
  keywordId,
  campaignId,
  CardSetOnChanges,
  keyword,
  setTableBody,
}: DeleteConfirmProps) => {
  const [open, setOpen] = useState(false);
  //  const handleSingleRefreshKeyword = async (keywordId: string) => {
  // //   setIsLoading(true)
  //   try {
  //     const refreshedSingleCampaign = await getRefreshSingleKeyword(keywordId);
  //     console.log(refreshedSingleCampaign, "refreshedSingleCampaign");
  // //     const lastUpdated = refreshedSingleCampaign?.SingleKeywordUpdated
  // //   ? formatLastUpdated(refreshedSingleCampaign.updatedRecords[0]?.updatedAt || '')
  // //   : '';
  //     if (!refreshedSingleCampaign || refreshedSingleCampaign.error) {
  //       console.error("Failed to refresh keyword campaign:", refreshedSingleCampaign?.error);
  //       toast.error("Failed to refresh keyword campaign");
  //       return;
  //     }
  //     // if (refreshedSingleCampaign?.updatedRecords) {

  //     //   setRefreshData(lastUpdated);
  //     // }

  //     // setIsLoading(false)
  //     toast.success(refreshedSingleCampaign?.message);

  //   } catch (error) {
  //     console.error("Error refreshing campaign:", error);
  //     toast.error("Something went wrong while refreshing the campaign");
  //   }
  // };
  const handleSingleRefreshKeyword = async (keywordId: string) => {
    try {
      const res = await getRefreshSingleKeyword(keywordId);
      if (res.success) {
        const campaignDataWithId = await getGetCampaignByid(campaignId);
        const campaignStatus = campaignDataWithId?.campaign?.status ?? 1;

        const liveKeywordData: any = await getDbLiveKeywordDataWithSatusCode(
          campaignId,
          campaignStatus
        );

        const topRankData = liveKeywordData?.topRankData?.data ?? [];

        let data: any = [];
        if (liveKeywordData?.newLiveKeywordDbData) {
          data = liveKeywordData?.newLiveKeywordDbData.map((item: any) => ({
            // select: false,
            type: item?.type || "",
            keywordId: item?.keywordId || "",
            keyword: item?.keyword || "",
            location: item?.location_name?.locationName?.locationName || "",
            intent: item?.intent || "",
            start: item?.start || 0,
            page: Math.ceil(item?.rank_absolute / 10).toString() || 0,
            Absolute_Rank: String(item?.rank_absolute) || 0,
            Group_Rank: item?.rank_group || 0,
            // oneDay: "1",
            sevenDays: "-",
            // thirtyDays: "-",
            life: item?.rank_group || 0,
            comp: item?.competition || 0,
            sv: item?.searchVolumn || 0,
            date: new Date(item?.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "2-digit",
            }),
            rankingUrl: item.url || "",
            // rankingUrl: new URL(item.url) || "/",
          }));
        }
        console.log(data, "data after delete");
        if (setTableBody) {
          setTableBody(data);
        }
        if (topRankData) {
          CardSetOnChanges(topRankData);
        }
        toast.success("Keyword Updated successfully");
        setOpen(false);
      } else {
        toast.error(res.error || "Failed to delete keyword");
      }
    } catch (err) {
      toast.error("An error occurred during deletion");
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="p-2 text-red-600 rounded-full hover:bg-red-200">
        <IoRefreshCircle title="Refresh keyword" className="text-xl" />
      </DialogTrigger>

      <DialogContent className="max-w-md border-none shadow-2xl bg-white p-6">
        <DialogHeader className="flex items-center gap-2">
          <HiOutlineExclamationCircle className="text-2xl text-red-500" />
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Confirm Refresh
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 text-gray-600 text-sm">
          Are you sure you want to Refresh <b>{keyword}</b>? This action cannot
          be undone.
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <DialogClose asChild>
            <CustomButton buttonName="Cancel" />
          </DialogClose>
          <DialogClose asChild>
            <CustomButton
              buttonName="Update"
              onClick={() => handleSingleRefreshKeyword(keywordId)}
            />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SingleKeywordRefresh;
