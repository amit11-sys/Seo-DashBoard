import { useState, useEffect } from "react";
import Select from "react-select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import {
  getFetchGoogledata,
  GetGmailLoginDetails,
  getSaveGoogleConsoleData,
} from "@/actions/google";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  // getFetchGoogleAnalyticsData,
  getSaveGoogleAnalyticsData,
} from "@/actions/analytics";

import { useLoader } from "@/hooks/useLoader";

/**
 * Props:
 * - open: boolean (controls popup)
 * - onOpenChange: function (to close/open)
 * - integrationType: "gsc" | "ga" | "gbp" | null (decided by parent when user clicks connect)
 * - fetchAccounts: async function(type, gmail) => accounts[] (parent will handle API)
 * - gmailOptions: array of available Gmail accounts [{ value, label }]
 */
export default function GoogleConnect({
  campaignId,
  open,
  onOpenChange,
  integrationType,
  fetchAccounts,
  fetchAnalyticsData,
  fetchConsoleData,
  // gmailOptions,
}: {
  campaignId?: string;
  open: boolean;
  fetchAnalyticsData?: any;
  fetchConsoleData?: any;
  onOpenChange: (open: boolean) => void;
  integrationType: "gsc" | "ga" | "gbp";
  fetchAccounts?: (type: string, gmail: string) => Promise<any[]>;
  // gmailOptions?: { value: string; label: string }[];
}) {
  console.log(integrationType, "integration type");
  const router = useRouter();
  const [selectedCampaign, setSelectedCampaign] = useState([] as any);
  const [selectedGmail, setSelectedGmail] = useState<any>(null);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState<any>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [gmailOptions, setGmailOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [campignOptions, setCampaignOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const { startLoading, stopLoading } = useLoader();
  const [buttonLoading, setButtonLoading] = useState(false)

  // const campaignOptions = [
  //   { value: "campaign1", label: "Campaign 1" },
  //   { value: "campaign2", label: "Campaign 2" },
  //   { value: "new", label: "+ Create New Campaign" },
  // ];

  useEffect(() => {
    if (integrationType && selectedGmail) {
      // if(integrationType === "gsc" ){

      (async () => {
        startLoading();
        setError("");

        try {
          const data = await getFetchGoogledata(
            integrationType,
            selectedGmail.value
          );
          if (integrationType === "gsc") {
            setAccounts([]);
            setSelectedAccount("");
            const accounts =
              data?.data?.accountConsoleData?.siteEntry?.map((acc: any) => ({
                value: acc.permissionLevel,
                label: acc.siteUrl,
              })) || [];

            setAccounts(accounts);

            const campaignOptions =
              data?.data?.matchedCampaigns?.map((acc: any) => ({
                value: acc.campaignId,
                label: acc.campaignsUrl,
              })) || [];
            setCampaignOptions(campaignOptions);
            //           const campaignOptions = [
            //   { value: "campaign1", label: "Campaign 1" },
            //   { value: "campaign2", label: "Campaign 2" },
            //   { value: "new", label: "+ Create New Campaign" },
            // ];
          }
          if (integrationType === "ga") {
            setSelectedAccount("");

            setAccounts([]);
            const accounts =
              data?.data?.analyticsAccountList?.accounts?.map((acc: any) => ({
                value: acc.name,
                label: acc.displayName,
              })) || [];

            setAccounts(accounts);

            const campaignOptions =
              data?.data?.matchedCampaigns?.map((acc: any) => ({
                value: acc.campaignId,
                label: acc.campaignsUrl,
              })) || [];
            setCampaignOptions(campaignOptions);
            //           const campaignOptions = [
            //   { value: "campaign1", label: "Campaign 1" },
            //   { value: "campaign2", label: "Campaign 2" },
            //   { value: "new", label: "+ Create New Campaign" },
            // ];
            console.log(data, "data in google connect");
          }
          stopLoading();
          console.log(data, "accounts list");
        } catch (err) {
          setError("Unable to fetch accounts. Please try again.");
          setAccounts([]);
        } finally {
         stopLoading();
        }
      })();

      // }else if(integrationType === "ga"){
      //   (async () => {
      //     setLoading(true);
      //     setError("");
      //     try {
      //       const data = await getFetchGoogleAnalyticsData(
      //         integrationType,
      //         selectedGmail.value
      //       );

      //       console.log(data, "accounts Analytics list");
      //       // const accounts =
      //       //   data?.data?.accountConsoleData?.siteEntry?.map((acc: any) => ({
      //       //     value: acc.permissionLevel,
      //       //     label: acc.siteUrl,
      //       //   })) || [];

      //       // setAccounts(accounts);

      //       // const campaignOptions =
      //       //   data?.data?.matchedCampaigns?.map((acc: any) => ({
      //       //     value: acc.campaignId,
      //       //     label: acc.projectUrls,
      //       //   })) || [];
      //       // setCampaignOptions(campaignOptions);
      //       //           const campaignOptions = [
      //       //   { value: "campaign1", label: "Campaign 1" },
      //       //   { value: "campaign2", label: "Campaign 2" },
      //       //   { value: "new", label: "+ Create New Campaign" },
      //       // ];
      //       // console.log(data, "data in google connect");
      //     } catch (err) {
      //       setError("Unable to fetch accounts. Please try again.");
      //       setAccounts([]);
      //     } finally {
      //       setLoading(false);
      //     }
      //   })();
      // }
    }
  }, [integrationType, selectedGmail, fetchAccounts]);
  const fetchGmailLoginDetails = async () => {
    try {
      const res = await GetGmailLoginDetails();
      console.log("Raw response:", res);

      const options =
        res?.googleAccounts?.map((acc: any) => ({
          value: acc.googleEmail,
          label: acc.googleEmail,
        })) || [];
      console.log("Options built:", options);

      setGmailOptions(options);
    } catch (error) {
      console.error("Error fetching Gmail login details:", error);
    }
  };

  useEffect(() => {
    fetchGmailLoginDetails();
  }, [open]);

  // const handleConnectGoogle = () => {
  //   // Redirect to Google OAuth flow
  //   window.location.href = "/auth/google"; // update with actual OAuth endpoint
  // };

  // const handleSave = async () => {
  //   try {
  //     // 1️⃣ Validate required fields before proceeding
  //     if (
  //       !selectedCampaign ||
  //       !integrationType ||
  //       !selectedGmail ||
  //       !selectedAccount
  //     ) {
  //       // console.warn("Missing required fields:", {
  //       //   selectedCampaign,
  //       //   integrationType,
  //       //   selectedGmail,
  //       //   selectedAccount,
  //       // });

  //       toast.error("Please select all fields before saving.");
  //       return;
  //     }

  //     console.log(
  //       {
  //         selectedCampaign,
  //         integrationType,
  //         selectedGmail,
  //         selectedAccount,
  //       },
  //       "📤 Data sent to parent"
  //     );

  //     if (integrationType === "gsc") {
  //       const response = await getSaveGoogleConsoleData(
  //         selectedAccount?.label,
  //         selectedAccount?.value,
  //         selectedGmail?.value,
  //         selectedCampaign?.value
  //       );
  //       await fetchConsoleData()
  //       if (response?.success) {
  //         toast.success("Google Console data saved successfully!");
  //         router.push(`/dashboard/${selectedCampaign.value}`);
  //         onOpenChange(false);
  //       } else {
  //         console.error("❌ Failed to save:", response);
  //         toast.error(
  //           response?.message || "Failed to save Google Console data."
  //         );
  //       }
  //     } else if (integrationType === "ga") {
  //       const response = await getSaveGoogleAnalyticsData(
  //         selectedAccount?.label,
  //         selectedAccount?.value,
  //         selectedGmail?.value,
  //         selectedCampaign?.value
  //       );
  //       await fetchAnalyticsData()

  //       if (response?.success) {
  //         toast.success("Google anayltics data saved successfully!");
  //         router.push(`/dashboard/${selectedCampaign.value}`);
  //         onOpenChange(false);
  //       } else {
  //         console.error("❌ Failed to save:", response);
  //         toast.error(
  //           response?.message || "Failed to save Google anayltics data."
  //         );
  //       }
  //     }
  //   } catch (error) {
  //     console.error("⚠️ Error in handleSave:", error);
  //     toast.error("Something went wrong while saving. Please try again.");
  //   }
  // };

  const handleSave = async () => {
    try {
      // 1️⃣ Validate required fields before proceeding
      if (
        !selectedCampaign ||
        !integrationType ||
        !selectedGmail ||
        !selectedAccount
      ) {
        toast.error("Please select all fields before saving.");
        return;
      }

      console.log(
        {
          selectedCampaign,
          integrationType,
          selectedGmail,
          selectedAccount,
        },
        "📤 Data sent to parent"
      );

      // 2️⃣ Handle integration-specific saving
      if (integrationType === "gsc") {
        setButtonLoading(true)
        const response = await getSaveGoogleConsoleData(
          selectedAccount?.label,
          selectedAccount?.value,
          selectedGmail?.value,
          selectedCampaign?.value
        );

        // ✅ Only call if defined
        if (typeof fetchConsoleData === "function") {
          await fetchConsoleData();
        }
        setButtonLoading(false)
        if (response?.success) {
          toast.success("Google Console data saved successfully!");
          router.push(`/dashboard/${selectedCampaign.value}?rerun=gsc`);
          onOpenChange(false);
        } else {
          console.error("❌ Failed to save:", response);
          toast.error(
            response?.message || "Failed to save Google Console data."
          );
        }
      } else if (integrationType === "ga") {
        setButtonLoading(true)
        const response = await getSaveGoogleAnalyticsData(
          selectedAccount?.label,
          selectedAccount?.value,
          selectedGmail?.value,
          selectedCampaign?.value
        );

        // ✅ Only call if defined
        if (typeof fetchAnalyticsData === "function") {
          await fetchAnalyticsData();
        }
        setButtonLoading(false)
        if (response?.success) {
          toast.success("Google Analytics data saved successfully!");
          router.push(`/dashboard/${selectedCampaign.value}?rerun=ga`);
          onOpenChange(false);
        } else {
          console.error("❌ Failed to save:", response);
          toast.error(
            response?.message || "Failed to save Google Analytics data."
          );
        }
      }
    } catch (error) {
      console.error("⚠️ Error in handleSave:", error);
      toast.error("Something went wrong while saving. Please try again.");
    }
  };

  const integrationLabelMap = {
    gsc: "Google Search Console",
    ga: "Google Analytics",
    gbp: "Google Business Profile",
  };

  const handleConnectGoogle = (campaignId: string) => {
    const stateData = { campaignId };
    const state = encodeURIComponent(JSON.stringify(stateData));

    const options: any = {
      scope: [
        process.env.NEXT_PUBLIC_USER_INFO_PROFILE,
        process.env.NEXT_PUBLIC_USER_INFO_EMAIL,
        process.env.NEXT_PUBLIC_AUTH_ANALYTICS,
        process.env.NEXT_PUBLIC_AUTH_WEBMASTERS,
        process.env.NEXT_PUBLIC_AUTH_ANALYTICS_READONLY,
        process.env.NEXT_PUBLIC_AUTH_BUSINESS_MANAGE,
      ].join(" "),
      response_type: "code",
      state,
      redirect_uri: `${process.env.NEXT_PUBLIC_REDIRECT_URI}api/googleLogin`,
      access_type: "offline",
      prompt: "consent",
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    };

    const qs = new URLSearchParams(options);
    const url = `${process.env.NEXT_PUBLIC_GOOGLE_AUTH_O}?${qs.toString()}`;

    const popup = window.open(
      url,
      "googleAuthPopup",
      "width=600,height=700,scrollbars=yes,resizable=yes"
    );

    const messageHandler = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data?.gmail) {
        toast.success(`Google account connected: ${event.data.gmail}`);

        // ✅ Refetch Gmail accounts after successful connection
        fetchGmailLoginDetails();

        window.removeEventListener("message", messageHandler);
        popup?.close();
      }
    };

    window.addEventListener("message", messageHandler);

    // Optional: detect if user manually closes popup
    const checkPopupClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkPopupClosed);
        window.removeEventListener("message", messageHandler);
      }
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-6 rounded-2xl shadow-xl bg-white">
        <DialogHeader>
          <div className="space-y-1 flex flex-col">
            <DialogTitle className="text-xl font-bold">
              {integrationType
                ? `Connect ${integrationLabelMap[integrationType]}`
                : "Manage Campaign & Access"}
            </DialogTitle>
            <DialogDescription>
              {integrationType
                ? `Choose a Gmail account to fetch ${integrationLabelMap[integrationType]} accounts.`
                : "Select a campaign and manage your integrations."}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 mt-6">
          {/* Left Side */}
          <div className="space-y-5 border-r pr-6">
            <div>
              <Label className="mb-1 block text-sm font-medium">
                Gmail Account
              </Label>
              <Select
                options={gmailOptions}
                value={selectedGmail}
                onChange={(option) => setSelectedGmail(option)}
                placeholder="Select Gmail"
                isClearable
                classNamePrefix="react-select"
              />

              {/* <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={handleConnectGoogle}
              >
                + Connect Google Account
              </Button> */}
            </div>
            {integrationType && (
              <div>
                <Label className="my-1 block text-sm font-medium">
                  {integrationLabelMap[integrationType]} Accounts
                </Label>

                {loading ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin" /> Fetching
                    accounts...
                  </div>
                ) : error ? (
                  <p className="text-sm text-red-500">{error}</p>
                ) : accounts.length > 0 ? (
                  <Select
                    options={accounts}
                    value={selectedAccount}
                    onChange={setSelectedAccount}
                    placeholder={`Select ${integrationLabelMap[integrationType]} account`}
                    classNamePrefix="react-select text-[10px]"
                  />
                ) : (
                  <p className="text-sm text-gray-400 italic">
                    No accounts found yet.
                  </p>
                )}
              </div>
            )}
            <div>
              <Label className="mb-1 block text-sm font-medium">Campaign</Label>
              <Select
                options={campignOptions}
                value={selectedCampaign}
                onChange={(options) => setSelectedCampaign(options)}
                placeholder="Select campaign"
                classNamePrefix="react-select"
              />
            </div>
          </div>

          {/* Right Side */}

          <div className="flex items-center justify-center text-center p-4 border-2 border-dashed rounded-xl">
            <div>
              <p className="text-sm text-gray-600">
                Select a Gmail account to view your connected{" "}
                {integrationLabelMap[integrationType]} accounts here.
              </p>
              <Button
                className="mt-4"
                onClick={() => handleConnectGoogle(campaignId || "")}
              >
                Connect Google Account
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-3">
  <Button variant="outline" onClick={() => onOpenChange(false)}>
    Cancel
  </Button>
  <Button
    onClick={handleSave}
    disabled={!selectedCampaign || !selectedAccount}
    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600 text-white"
  >
    {buttonLoading
      ? "Saving ... please wait"
      : integrationType
      ? `Connect ${integrationLabelMap[integrationType]}`
      : "Save"}
  </Button>
</div>

      </DialogContent>
    </Dialog>
  );
}
