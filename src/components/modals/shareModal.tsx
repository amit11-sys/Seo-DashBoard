// "use client";

// import { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { getGenerateShareLink } from "@/actions/generateShareLink";
// import { toast } from "sonner";
// import { BsShare } from "react-icons/bs";
// import { getCompaignDataBoth } from "@/actions/campaign";

// export default function ShareDialog({ campaignId }: { campaignId: string }) {
//   const [role, setRole] = useState("user");
//   const [email, setEmail] = useState("");
//   const [campaignData, setCampaignData] = useState<any[]>([]);
//   const [selectedCampaign, setSelectedCampaign] = useState<string>("");

//   // ✅ 1️⃣ Fetch campaign list on mount
//   useEffect(() => {
//     const fetchCampaignData = async () => {
//       try {
//         const result = await getCompaignDataBoth();

//         // Assuming result.campaignDataBoth is your array
//         if (result?.campaignDataBoth) {
//           setCampaignData(result.campaignDataBoth);
//         }
//       } catch (error) {
//         console.error("Error fetching campaigns:", error);
//         toast.error("Failed to load campaigns");
//       }
//     };

//     fetchCampaignData();
//   }, []);

//   // ✅ 3️⃣ Handle Share link copy
//   const handleShareLink = async () => {
//     try {
//          if (!email) {
//       toast.error("Please enter an email");
//       return;
//     }

//     if (!selectedCampaign) {
//       toast.error("Please select a campaign");
//       return;
//     }
//       const shareLink: any = await getGenerateShareLink(
//         `/dashboard/detail/`,
//         selectedCampaign
//       );
//     // console.log({selectedCampaign,email},`selectedCampaign,email`);

//       if (shareLink?.error === "Unauthorized please login") {
//         window.dispatchEvent(new Event("session-expired"));
//         return;
//       }

//       await navigator.clipboard.writeText(shareLink);
//       toast.success("Shareable link copied to clipboard!");
//           setEmail("");

//     } catch (error) {
//       toast.error("Failed to generate shareable link.");
//     }
//   };

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="ghost" size="icon">
//           <BsShare
//             className="cursor-pointer text-xl text-green-600"
//             title="Share"
//           />
//         </Button>
//       </DialogTrigger>

//       <DialogContent className="sm:max-w-md bg-white rounded-2xl">
//         <DialogHeader className="text-center">
//           <DialogTitle>Share Access</DialogTitle>
//           <DialogDescription>
//             Grant permission to another user. Choose a campaign and role.
//           </DialogDescription>
//         </DialogHeader>

//         <div className="flex flex-col gap-4 py-2">
//           {/* Email input */}
//           <div className="flex flex-col space-y-2">
//             <Label htmlFor="email">Email</Label>
//             <Input
//               id="email"
//               placeholder="example@email.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>

//           {/* Campaign dropdown */}
//           <div className="flex flex-col space-y-2">
//             <Label>Campaign</Label>
//             <Select
//               onValueChange={(value) => setSelectedCampaign(value)}
//               value={selectedCampaign}
//             >
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="Select a campaign" />
//               </SelectTrigger>
//               <SelectContent className="bg-white">
//                 {campaignData.length > 0 ? (
//                   campaignData.map((c) => (
//                     <SelectItem key={c._id} value={c._id}>
//                       {c.projectUrl || c.name || "Unnamed Campaign"}
//                     </SelectItem>
//                   ))
//                 ) : (
//                   <SelectItem value="none" disabled>
//                     No campaigns found
//                   </SelectItem>
//                 )}
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Permission dropdown */}
//           {/* <div className="flex flex-col space-y-2">
//             <Label>Permission</Label>
//             <Select onValueChange={setRole} value={role}>
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="Select a role" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="admin">Admin</SelectItem>
//                 <SelectItem value="user">User</SelectItem>
//               </SelectContent>
//             </Select>
//           </div> */}
//         </div>

//         <DialogFooter>
//           {/* <Button
//             onClick={handleShare}
//             className="bg-orange-600 hover:bg-orange-700"
//           >
//             Share
//           </Button> */}

//           <Button
//             variant="outline"
//             onClick={handleShareLink}
//             className="border-orange-600 text-orange-700"
//           >
//             Generate Link
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }








// "use client";

// import { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
// import { Checkbox } from "@/components/ui/checkbox";
// import { toast } from "sonner";
// import { BsShare } from "react-icons/bs";
// import { getCompaignDataBoth } from "@/actions/campaign";
// import { getGenerateShareLink } from "@/actions/generateShareLink";

// export default function ShareDialog({ campaignId }: { campaignId: string }) {
//   const [email, setEmail] = useState("");
//   const [campaignData, setCampaignData] = useState<any[]>([]);
//   const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);

//   // ✅ Fetch campaigns
//   useEffect(() => {
//     const fetchCampaignData = async () => {
//       try {
//         const result = await getCompaignDataBoth();
//         if (result?.campaignDataBoth) {
//           setCampaignData(result.campaignDataBoth);
//         }
//       } catch (error) {
//         console.error("Error fetching campaigns:", error);
//         toast.error("Failed to load campaigns");
//       }
//     };
//     fetchCampaignData();
//   }, []);

//   // ✅ Toggle campaign selection
// //   const toggleCampaign = (id: string) => {
// //     setSelectedCampaigns((prev) =>
// //       prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
// //     );
// //   };

//   // ✅ Handle Generate Link
//   const handleShareLink = async () => {
//     if (!email.trim()) {
//       toast.error("Please enter an email");
//       return;
//     }

//     if (selectedCampaigns.length === 0) {
//       toast.error("Please select at least one campaign");
//       return;
//     }

//     try {
//       setLoading(true);

//       const shareLink: any = await getGenerateShareLink(
//         `/dashboard/detail/`,
//         selectedCampaigns // <-- send array
//       );

//       if (shareLink?.error === "Unauthorized please login") {
//         window.dispatchEvent(new Event("session-expired"));
//         return;
//       }

//       await navigator.clipboard.writeText(shareLink);
//       toast.success("Shareable link copied to clipboard!");
//       setEmail("");
//       setSelectedCampaigns([]);
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to generate shareable link.");
//     } finally {
//       setLoading(false);
//     }
//   };

//     const [open, setOpen] = useState(false);

//   const toggleCampaign = (id: string) => {
//     setSelectedCampaigns((prev: string[]) =>
//       prev.includes(id)
//         ? prev.filter((cid) => cid !== id)
//         : [...prev, id]
//     );
//   };


//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="ghost" size="icon">
//           <BsShare
//             className="cursor-pointer text-xl text-green-600"
//             title="Share"
//           />
//         </Button>
//       </DialogTrigger>

//       <DialogContent className="sm:max-w-md bg-white rounded-2xl">
//         <DialogHeader className="text-center">
//           <DialogTitle>Share Access</DialogTitle>
//           <DialogDescription>
//             Grant permission to another user. Choose campaigns to share.
//           </DialogDescription>
//         </DialogHeader>

//         <div className="flex flex-col gap-4 py-2">
//           {/* Email input */}
//           <div className="flex flex-col space-y-2">
//             <Label htmlFor="email">Email</Label>
//             <Input
//               id="email"
//               placeholder="example@email.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>

//           {/* ✅ Multi-select Campaign */}
//           {/* <div className="flex flex-col space-y-2">
//             <Label>Campaigns</Label>
//             <Popover>
//               <PopoverTrigger asChild>
//                 <Button
//                   variant="outline"
//                   className="justify-between w-full text-left"
//                 >
//                   {selectedCampaigns.length > 0
//                     ? `${selectedCampaigns.length} selected`
//                     : "Select campaigns"}
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-full max-h-[200px] overflow-y-auto bg-white rounded-xl shadow-lg">
//                 {campaignData.length > 0 ? (
//                   campaignData.map((c) => (
//                     <div
//                       key={c._id}
//                       className="flex items-center space-x-2 py-1 px-2 hover:bg-gray-50 rounded-lg cursor-pointer"
//                       onClick={() => toggleCampaign(c._id)}
//                     >
//                       <Checkbox checked={selectedCampaigns.includes(c._id)} />
//                       <span className="text-sm text-gray-700 truncate">
//                         {c.projectUrl || "Unnamed Campaign"}
//                       </span>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-sm text-gray-500 p-2">No campaigns found</p>
//                 )}
//               </PopoverContent>
//             </Popover>
//           </div> */}

//             <div className="flex flex-col space-y-2">
//       <Label>Campaigns</Label>
//       <Popover open={open} onOpenChange={setOpen}>
//         <PopoverTrigger asChild>
//           <Button
//             variant="outline"
//             className="justify-between w-full text-left"
//           >
//             {selectedCampaigns.length > 0
//               ? `${selectedCampaigns.length} selected`
//               : "Select campaigns"}
//           </Button>
//         </PopoverTrigger>

//         <PopoverContent
//           className="w-full max-h-[250px] overflow-y-auto bg-white rounded-xl shadow-lg"
//           align="start"
//           sideOffset={6}
//           onClick={(e) => e.stopPropagation()} // ⛔ prevent auto-close on click
//         >
//           {campaignData.length > 0 ? (
//             campaignData.map((c: any) => (
//               <div
//                 key={c._id}
//                 className="flex items-center space-x-2 py-1 px-2 hover:bg-gray-50 rounded-lg cursor-pointer"
//                 onClick={(e) => {
//                   e.stopPropagation(); // prevent closing
//                   toggleCampaign(c._id);
//                 }}
//               >
//                 <Checkbox checked={selectedCampaigns.includes(c._id)} />
//                 <span className="text-sm text-gray-700 truncate">
//                   {c.projectUrl || c.name || "Unnamed Campaign"}
//                 </span>
//               </div>
//             ))
//           ) : (
//             <p className="text-sm text-gray-500 p-2">No campaigns found</p>
//           )}
//         </PopoverContent>
//       </Popover>
//     </div>
//         </div>

//         <DialogFooter>
//           <Button
//             variant="outline"
//             onClick={handleShareLink}
//             className="border-orange-600 text-orange-700"
//             disabled={loading}
//           >
//             {loading ? "Generating..." : "Generate Link"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }


"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { BsShare } from "react-icons/bs";
import { getCompaignDataBoth } from "@/actions/campaign";
import { getGenerateShareLink } from "@/actions/generateShareLink";

export default function ShareDialog({ campaignId }: { campaignId: string }) {
  const [email, setEmail] = useState("");
  const [campaignData, setCampaignData] = useState<any[]>([]);
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        const result = await getCompaignDataBoth();
        if (result?.campaignDataBoth) setCampaignData(result.campaignDataBoth);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        toast.error("Failed to load campaigns");
      }
    };
    fetchCampaignData();
  }, []);

  const toggleCampaign = (id: string) => {
    setSelectedCampaigns((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleShareLink = async () => {
    if (!email.trim()) return toast.error("Please enter an email");
    if (selectedCampaigns.length === 0)
      return toast.error("Please select at least one campaign");

    try {
      setLoading(true);
      const shareLink = await getGenerateShareLink(
        `/dashboard/detail/`,
        selectedCampaigns,
        email
      );

      if (shareLink?.error === "Unauthorized please login") {
        window.dispatchEvent(new Event("session-expired"));
        return;
      }

      await navigator.clipboard.writeText(shareLink?.url || "no url found");
   
      toast.success(  shareLink?.error || "Shareable link copied to clipboard!");
      setEmail("");
      setSelectedCampaigns([]);
      setOpenDropdown(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate shareable link.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <BsShare className="cursor-pointer text-xl text-green-600" title="Share" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-white rounded-2xl">
        <DialogHeader className=" flex flex-col gap-2 justify-center items-center text-center">
        
          <DialogTitle>Share Access</DialogTitle>
          <DialogDescription>
            Grant permission to another user. Choose campaigns to share.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          {/* Email input */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* ✅ Custom Multi-Select Dropdown */}
          <div className="flex flex-col space-y-2" ref={dropdownRef}>
            <Label>Campaigns</Label>
            <Button
              variant="outline"
              className="justify-between w-full text-left"
              onClick={() => setOpenDropdown((prev) => !prev)}
            >
              {selectedCampaigns.length > 0
                ? `${selectedCampaigns.length} selected`
                : "Select campaigns"}
              <span className="ml-2">{openDropdown ? "▲" : "▼"}</span>
            </Button>

            {openDropdown && (
              <div className="absolute z-50 mt-1 w-[90%] max-h-[250px] overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-md">
                {campaignData.length > 0 ? (
                  campaignData.map((c: any) => (
                    <div
                      key={c._id}
                      className="flex items-center space-x-2 py-2 px-3 hover:bg-gray-50 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCampaign(c._id);
                      }}
                    >
                      <Checkbox checked={selectedCampaigns.includes(c._id)} />
                      <span className="text-sm text-gray-700 truncate">
                        {c.projectUrl || c.name || "Unnamed Campaign"}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 p-2">No campaigns found</p>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleShareLink}
            className="border-orange-600 text-orange-700"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Link"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
