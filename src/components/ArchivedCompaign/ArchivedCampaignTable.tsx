"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { Trash2, RotateCcw, Search } from "lucide-react";
import { use, useEffect, useState } from "react";
import { FaArchive } from "react-icons/fa";
import { useCampaignData } from "@/app/context/CampaignContext";

const campaigns = [
  {
    key: "1",
    name: "dripinluxe.com",
    integration: ["/icons/ga.svg", "/icons/gs.svg"],
    searcher: "Google",
    country: "🇨🇦",
    keywords: 25,
    top3: 14,
    top10: 15,
    top20: 16,
    top100: 19,
    backlinks: 253,
  },
  {
    key: "2",
    name: "myfavoritetherapists.com",
    integration: ["/icons/ga.svg", "/icons/gs.svg", "/icons/gsc.svg"],
    searcher: "Google",
    country: "🇺🇸",
    keywords: 31,
    top3: 11,
    top10: 13,
    top20: 14,
    top100: 16,
    backlinks: 1085,
  },
];

export default function ArchivedCampaignTable(archivedCampaignData: any) {
    // const {campaignId}= useCampaignData()
  const [search, setSearch] = useState("");
  const [archivedData, setArchivedData] = useState();
  console.log(
    archivedCampaignData?.archivedCampaignData,
    "archivedCampaignData"
  );

  const filteredData = campaigns.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );
  useEffect(() => {
    // setArchivedData(archivedCampaignData?.archivedCampaignData);
     
  }, [archivedCampaignData]);

  return (
    <div className="p-6 rounded-xl shadow-md">
      <div className="flex  flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <h2 className="text-xl flex gap-2 font-semibold">
          <FaArchive className="text-2xl text-green-600" /> Archived Campaigns
        </h2>
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[250px]"
          />
        </div>
      </div>
      <div className="p-6 bg-white rounded-xl shadow-md">
        <div className="overflow-auto bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign Name</TableHead>
                <TableHead>Integration</TableHead>
                <TableHead>Searcher</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Keywords</TableHead>
                <TableHead>Top 3</TableHead>
                <TableHead>Top 10</TableHead>
                <TableHead>Top 20</TableHead>
                <TableHead>Top 100</TableHead>
                <TableHead>Backlinks</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {archivedCampaignData?.archivedCampaignData.map((campaign: any) => {
                            console.log(campaign,"campaign map")
                return (
                <TableRow key={campaign.key}>
                  <TableCell className="font-medium">{campaign.projectUrl.replace(/^https?:\/\/(www\.)?/, "")}</TableCell>
                  <TableCell>
                    {/* <div className="flex gap-1">
                    {campaign.integration.map((src, i) => (
                      <img key={i} src={src} alt="integration" className="w-4 h-4" />
                    ))}
                  </div> */}
                    intig.
                  </TableCell>
                  <TableCell>{campaign.searcher}</TableCell>
                  <TableCell>{campaign.country}</TableCell>
                  <TableCell>{campaign.keywords}</TableCell>
                  <TableCell>{campaign.top3}</TableCell>
                  <TableCell>{campaign.top10}</TableCell>
                  <TableCell>{campaign.top20}</TableCell>
                  <TableCell>{campaign.top100}</TableCell>
                  <TableCell>{campaign.backlinks}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <TooltipProvider>
                        <Tooltip>
                          <Button variant="destructive" size="icon">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </Tooltip>
                        <Tooltip>
                          <Button variant="outline" size="icon">
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>
          {filteredData.length === 0 && (
            <div className="text-center text-muted-foreground py-4">
              No Archived campaigns found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
