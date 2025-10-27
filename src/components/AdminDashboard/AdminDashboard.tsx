

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Edit, Trash2, Users } from "lucide-react";
import Navbar from "../Common/Navbar";
import {
  getDeleteUserAccess,
  getSaveAssignedCampaigns,
  getUserAccessData,
} from "@/actions/generateShareLink";
import { useLoader } from "@/hooks/useLoader";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { getCompaignDataActiveArchived } from "@/actions/campaign";

export default function AdminDashboard({ campaigns, userAcessData }: any) {
  const { startLoading, stopLoading } = useLoader();
  const [activeSection, setActiveSection] = useState("activeClients");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedAccess, setSelectedAccess] = useState<any>(null);
  const [allCampaigns, setAllCampaigns] = useState<any>(null);
  const [role, setRole] = useState<any>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [userAccessData, setUserAccessData] = useState<any[]>([]);
  const [confirmAction, setConfirmAction] = useState<any>(null);
console.log(userAccessData,"acesss")
console.log(campaigns,"camp")


  useEffect(() => {
    setUserAccessData(userAcessData?.allUsersWithAccess || []);
    setAllCampaigns(campaigns);
    
    setRole(userAcessData?.activeUser || null);
  }, [userAcessData]);

  const openClientDialog = (accessData: any) => {
    setSelectedAccess({
      ...accessData,
      selectedCampaigns: accessData?.campaignId || [],
    });
    setEmail(accessData?.userId?.email);
    setShowDialog(true);
  };

  const handleToggleCampaign = (campaignId: string) => {
    setSelectedAccess((prev: any) => {
      const isSelected = prev.selectedCampaigns?.includes(campaignId);
      const updatedCampaigns = isSelected
        ? prev.selectedCampaigns.filter((id: string) => id !== campaignId)
        : [...(prev.selectedCampaigns || []), campaignId];

      return { ...prev, selectedCampaigns: updatedCampaigns };
    });
  };

  const deleteClient = async (UserId: string) => {
    try {
      startLoading();
      const response = await getDeleteUserAccess(UserId);

      if (response?.error) {
        console.error("Error deleting client:", response.error);
        toast.error(`Failed to delete client: ${response.error}`);
        return;
      }

      toast.success("Client deleted successfully!");
      setUserAccessData((prev) => prev.filter((u: any) => u._id !== UserId));
    } catch (error) {
      console.error("Unexpected error while deleting client:", error);
      toast.error("Something went wrong while deleting. Please try again.");
    } finally {
      stopLoading();
    }
  };

  const saveEditCampaigns = async (accessId: string) => {
    try {
      if (!accessId) {
        toast.error("Invalid access ID!");
        return;
      }

      startLoading();

      const response = await getSaveAssignedCampaigns(
        accessId,
        selectedAccess?.selectedCampaigns || []
      );

      if (response?.error) {
        console.error(" Error saving campaigns:", response.error);
        toast.error(`Failed to save changes: ${response.error}`);
        return;
      }

      toast.success("Campaign access updated successfully!");
      setShowDialog(false);
      setSelectedAccess(null);
        const userAcessData = await getUserAccessData();
        // const campaigns = await getCompaignDataActiveArchived();
        setUserAccessData(userAcessData?.allUsersWithAccess || []);
        // setAllCampaigns(campaigns);
    } catch (error) {
      console.error("Unexpected error while saving campaigns:", error);
      toast.error("Something went wrong while saving. Please try again.");
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#f6f8fa]">
      {/* 🔹 Navbar */}
      <nav className="bg-[#273F4F] shadow-md px-6 py-3 flex justify-between items-center">
        <Navbar role={role} />
      </nav>

      {/* 🔹 Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-64 bg-[#273F4F] mt-14 text-white shadow-md border-r border-[#FF7A00]/20 p-5 space-y-3">
            <h2 className="text-sm uppercase tracking-wider text-[#FF7A00] mb-3 font-semibold">
              Navigation
            </h2>

            <Button
              variant={
                activeSection === "activeClients" ? "default" : "outline"
              }
              className={`w-full justify-start rounded-lg ${
                activeSection === "activeClients"
                  ? "bg-[#FF7A00] hover:bg-[#ff8c26] text-white"
                  : "border-[#FF7A00] text-[#FF7A00] hover:bg-[#FF7A00]/10"
              }`}
              onClick={() => setActiveSection("activeClients")}
            >
              <Users className="mr-2 h-4 w-4" /> Active Clients
            </Button>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 mt-14 p-6 overflow-y-auto bg-[#fdfdfd]">
          {activeSection === "activeClients" && (
            <>
              <h2 className="text-lg font-bold mb-4 text-[#273F4F] border-b pb-2 border-[#FF7A00]/30">
                Active Clients
              </h2>

              <div className="grid gap-4">
                {userAccessData.map((data: any) => (
                  <Card
                    key={data?._id}
                    className="flex justify-between items-center p-5 shadow-sm border border-gray-200 hover:shadow-md hover:border-[#FF7A00]/50 transition cursor-pointer rounded-xl"
                  >
                    <div>
                      <h3 className="font-semibold text-[#273F4F] hover:text-[#FF7A00] text-lg">
                        {data?.userId?.email}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Campaigns Assigned: {data?.campaignId?.length || 0}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#FF7A00] text-[#FF7A00] hover:bg-[#FF7A00]/10"
                        onClick={() => openClientDialog(data)}
                      >
                        <Edit className="w-4 h-4 mr-1" /> Edit
                      </Button>

                      {/* 🧩 Delete Confirmation Dialog */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="bg-[#FF7A00] hover:bg-[#e56d00]"
                          >
                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white rounded-2xl shadow-lg">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-[#273F4F]">
                              Confirm Deletion
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete{" "}
                              <span className="font-medium text-[#FF7A00]">
                                {data?.userId?.email}
                              </span>{" "}
                              and all assigned campaigns? This action cannot be
                              undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-[#FF7A00] hover:bg-[#e56d00]"
                              onClick={() => deleteClient(data?._id)}
                            >
                              Yes, Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      {/* 🔹 Campaign Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="w-[80%] max-w-xl bg-white rounded-2xl shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-[#273F4F] text-lg font-bold">
              Manage Campaigns for{" "}
              <span className="text-[#FF7A00]">{email}</span>
            </DialogTitle>
          </DialogHeader>

          {/* Scrollable Campaign List */}
          <div className="mt-6 space-y-3">
            <h4 className="text-sm text-[#273F4F] font-semibold mb-2">
              Select Active Campaigns:
            </h4>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#FF7A00]/60 scrollbar-track-gray-100 rounded-md">
              {allCampaigns?.map((camp: any) => (
                <label
                  key={camp._id}
                  className="flex items-center gap-3 bg-[#f9fafb] border border-gray-200 hover:border-[#FF7A00]/50 px-4 py-2 rounded-lg cursor-pointer transition"
                >
                  <input
                    type="checkbox"
                    checked={
                      selectedAccess?.selectedCampaigns?.includes(camp?._id) ||
                      false
                    }
                    onChange={() => handleToggleCampaign(camp?._id)}
                    className="accent-[#FF7A00] w-4 h-4"
                  />
                  <span className="text-[#273F4F] truncate">
                    {camp?.projectUrl}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Save Confirmation Dialog */}
          <div className="mt-6 flex justify-end gap-3 border-t pt-4">
            <Button
              variant="outline"
              className="border-[#273F4F] text-[#273F4F] hover:bg-[#273F4F]/10"
              onClick={() => setShowDialog(false)}
            >
              Cancel
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-[#FF7A00] hover:bg-[#e56d00] text-white">
                  Save Changes
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white rounded-2xl shadow-lg">
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Save</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to save these campaign changes for{" "}
                    <span className="text-[#FF7A00] font-semibold">
                      {email}
                    </span>
                    ?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-[#FF7A00] hover:bg-[#e56d00]"
                    onClick={() => saveEditCampaigns(selectedAccess?._id)}
                  >
                    Yes, Save
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
