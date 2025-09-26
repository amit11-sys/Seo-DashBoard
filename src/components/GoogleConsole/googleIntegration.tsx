
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useState } from "react";

interface GoogleIntegrationsProps {
  onClose: () => void;
  onSkip: () => void;
  createdCampaignId: string;
}

export default function GoogleIntegrations({
  onClose,
  onSkip,
  createdCampaignId,
}: GoogleIntegrationsProps) {
  const [open, setOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState("");
  const [isAnalyticsData, setIsAnalyticsData] = useState(false);
  const [isConsolesData, setIsConsoleData] = useState(false);

  const handleConnectClick = (integration: string) => {
    setSelectedIntegration(integration);
    if(integration === "Google Search Console"){ 
      setIsConsoleData(true);
    }
    if(integration === "Google Analytics"){
      setIsAnalyticsData(true);
    }
    
    setOpen(true);
  };
  const handlecloseDialog = () => {
    setOpen(false);
  };
  // console.log(createdCampaignId, "createdCampaignId in google integration");

  const handleLoginGoogleConsole = () => {
    const url = `${process.env.NEXT_PUBLIC_GOOGLE_AUTH_O}`;
    const stateData = {
      campaignId: createdCampaignId,
      analyticsData: isAnalyticsData,
      consoleData: isConsolesData,
    };
    const state = encodeURIComponent(JSON.stringify(stateData));
    const options = {
      scope: [
       `${ process.env.NEXT_PUBLIC_USER_INFO_PROFILE}`,
        `${process.env.NEXT_PUBLIC_USER_INFO_EMAIL}`,
        `${ process.env.NEXT_PUBLIC_AUTH_ANALYTICS}`,
        `${process.env.NEXT_PUBLIC_AUTH_WEBMASTERS}`,
        `${process.env.NEXT_PUBLIC_AUTH_ANALYTICS_READONLY}`,
        `${process.env.NEXT_PUBLIC_AUTH_BUSINESS_MANAGE}`,

         
      ].join(" "),
      response_type: "code",
      state,
      redirect_uri: `${process.env.NEXT_PUBLIC_REDIRECT_URI}api/googleLogin`,
      access_type: "offline",
      prompt: "consent",
      client_id:
       `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`,
    };

    const qs = new URLSearchParams(options);
    return `${url}?${qs.toString()}`;
  };

 

  return (
    <div className="fixed inset-0 z-[50] flex items-center justify-center backdrop-blur-lg">
      {/* Gradient frame wrapper */}
      <div className="bg-gradient-to-br from-fuchsia-500 via-indigo-500 to-emerald-500 p-[2px] rounded-2xl shadow-2xl w-[80%] max-w-3xl">
        <Card className="bg-white/95 dark:bg-slate-900/95 rounded-2xl overflow-hidden">
          {/* Gradient header */}
          <div className=" text-black">
            <CardHeader className="text-center py-8">
              <CardTitle className="text-3xl font-bold tracking-tight">
                Integrations
              </CardTitle>
              <CardDescription className="text-black text-base mt-2">
                Connect your Google Analytics and Google Search Console
                accounts.
              </CardDescription>
            </CardHeader>
          </div>

          <CardContent className="space-y-5 py-8">
            {/* Google Search Console */}
            <div className="flex items-center justify-between border border-transparent bg-gradient-to-r from-slate-50 to-white dark:from-slate-900/60 dark:to-slate-900/30 p-4 rounded-xl hover:shadow-lg transition-all">
              <div className="flex items-center gap-4">
                <Image
                  src="/images/search-console.png"
                  alt="Google Search Console"
                  width={100}
                  height={100}
                  className="rounded-md mix-blend-multiply"
                />
                <div>
                  <p className="font-semibold text-lg text-slate-800 dark:text-slate-100">
                    Google Search Console
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
                    Get insights about SERP, keywords, and build reports for
                    your SEO dashboard.
                  </p>
                </div>
              </div>

              <Button
                className="bg-gradient-to-r from-orange-400 to-orange-700 rounded-full text-white  hover:opacity-90 transition"
                onClick={() => handleConnectClick("Google Search Console")}
              >
                Connect
              </Button>
            </div>

            {/* Google Analytics */}
            <div className="flex items-center justify-between border border-transparent bg-gradient-to-r from-slate-50 to-white dark:from-slate-900/60 dark:to-slate-900/30 p-4 rounded-xl hover:shadow-lg transition-all">
              <div className="flex items-center gap-4">
                <Image
                  src="/images/search-analytics.png"
                  alt="Google Analytics"
                  width={100}
                  height={100}
                  className="rounded-md mix-blend-multiply"
                />
                <div>
                  <p className="font-semibold text-lg text-slate-800 dark:text-slate-100">
                    Google Analytics
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
                    Gain insights about website traffic and build reports for
                    your SEO dashboard.
                  </p>
                </div>
              </div>

              <Button
                className="bg-gradient-to-r from-orange-400 to-orange-700 rounded-full text-white hover:opacity-90 transition"
                onClick={() => handleConnectClick("Google Analytics")}
              >
                Connect
              </Button>
            </div>
          </CardContent>

          {/* Footer */}
          <div className="flex justify-end px-6 pb-6">
            <Button
              variant="ghost"
              className="text-slate-600 text-xl border rounded-full px-5 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              onClick={onSkip}
            >
              Skip for now
            </Button>
          </div>
        </Card>
      </div>

      {/* Dialog */}
      <Dialog
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
          if (!val) handlecloseDialog();
        }}
      >
        <DialogContent className="flex flex-col items-center space-y-4 text-center backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold bg-gradient-to-r from-indigo-500 to-emerald-500 bg-clip-text text-transparent">
              Connect to {selectedIntegration}
            </DialogTitle>
          </DialogHeader>
          <Image
            src="/images/google.png"
            alt="Google Logo"
            width={80}
            height={80}
            className="mix-blend-multiply"
          />
          <p className="text-sm text-slate-600 dark:text-slate-300 px-4">
            Authenticate with {selectedIntegration} to link your account and
            enable data fetching.
          </p>
          <div className="flex gap-3 mt-2">
            <a href={handleLoginGoogleConsole()}>
              <Button className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:opacity-90 transition">
                Proceed
              </Button>
            </a>
            <Button
              variant="outline"
              className="border-slate-300"
              onClick={handlecloseDialog}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// "use client";

// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import Image from "next/image";
// import { useState } from "react";

// interface GoogleIntegrationsProps {
//   onClose: () => void;
//   onSkip: () => void;
//   createdCampaignId: string;
// }

// export default function GoogleIntegrations({
//   onClose,
//   onSkip,
//   createdCampaignId,
// }: GoogleIntegrationsProps) {
//   const [open, setOpen] = useState(false);
//   const [selectedIntegration, setSelectedIntegration] = useState("");

//   const handleConnectClick = (integration: string) => {
//     setSelectedIntegration(integration);
//     setOpen(true);
//   };

//   const handlecloseDialog = () => {
//     setOpen(false);
//   };

//   // ✅ Unified Google OAuth URL generator
//   const getGoogleOAuthUrl = () => {
//     const options = {
//       
//       response_type: "code",
//       state: encodeURIComponent(createdCampaignId || "google-integration"),
//       access_type: "offline",
//       prompt: "consent",
//  
//     const qs = new URLSearchParams(options);
//     return `${url}?${qs.toString()}`;
//   };

//   return (
//     <div className="fixed inset-0 z-[50] flex items-center justify-center backdrop-blur-lg">
//       <div className="bg-gradient-to-br from-fuchsia-500 via-indigo-500 to-emerald-500 p-[2px] rounded-2xl shadow-2xl w-[80%] max-w-3xl">
//         <Card className="bg-white/95 dark:bg-slate-900/95 rounded-2xl overflow-hidden">
//           <CardHeader className="text-center py-8 text-black">
//             <CardTitle className="text-3xl font-bold tracking-tight">
//               Integrations
//             </CardTitle>
//             <CardDescription className="text-black text-base mt-2">
//               Connect your Google Analytics and Google Search Console accounts.
//             </CardDescription>
//           </CardHeader>

//           <CardContent className="space-y-5 py-8">
//             {/* Search Console */}
//             <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-50 to-white dark:from-slate-900/60 dark:to-slate-900/30 hover:shadow-lg transition-all">
//               <div className="flex items-center gap-4">
//                 <Image
//                   src="/images/google-search-console.png"
//                   alt="Google Search Console"
//                   width={100}
//                   height={100}
//                   className="rounded-md mix-blend-multiply"
//                 />
//                 <div>
//                   <p className="font-semibold text-lg text-slate-800 dark:text-slate-100">
//                     Google Search Console
//                   </p>
//                   <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
//                     Get insights about SERP, keywords, and build reports for your SEO dashboard.
//                   </p>
//                 </div>
//               </div>

//               <Button
//                 className="bg-gradient-to-r from-orange-400 to-orange-700 rounded-full text-white hover:opacity-90"
//                 onClick={() => handleConnectClick("Google Search Console")}
//               >
//                 Connect
//               </Button>
//             </div>

//             {/* Google Analytics */}
//             <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-50 to-white dark:from-slate-900/60 dark:to-slate-900/30 hover:shadow-lg transition-all">
//               <div className="flex items-center gap-4">
//                 <Image
//                   src="/images/google_analytics.webp"
//                   alt="Google Analytics"
//                   width={100}
//                   height={100}
//                   className="rounded-md mix-blend-multiply"
//                 />
//                 <div>
//                   <p className="font-semibold text-lg text-slate-800 dark:text-slate-100">
//                     Google Analytics
//                   </p>
//                   <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
//                     Gain insights about website traffic and build reports for your SEO dashboard.
//                   </p>
//                 </div>
//               </div>

//               <Button
//                 className="bg-gradient-to-r from-orange-400 to-orange-700 rounded-full text-white hover:opacity-90"
//                 onClick={() => handleConnectClick("Google Analytics")}
//               >
//                 Connect
//               </Button>
//             </div>
//           </CardContent>

//           <div className="flex justify-end px-6 pb-6">
//             <Button
//               variant="ghost"
//               className="text-slate-600 text-xl border rounded-full px-5 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
//               onClick={onSkip}
//             >
//               Skip for now
//             </Button>
//           </div>
//         </Card>
//       </div>

//       {/* Auth Dialog */}
//       <Dialog
//         open={open}
//         onOpenChange={(val) => {
//           setOpen(val);
//           if (!val) handlecloseDialog();
//         }}
//       >
//         <DialogContent className="flex flex-col items-center space-y-4 text-center backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border-0 shadow-2xl">
//           <DialogHeader>
//             <DialogTitle className="text-lg font-semibold bg-gradient-to-r from-indigo-500 to-emerald-500 bg-clip-text text-transparent">
//               Connect to {selectedIntegration}
//             </DialogTitle>
//           </DialogHeader>
//           <Image
//             src="/images/google.png"
//             alt="Google Logo"
//             width={80}
//             height={80}
//             className="mix-blend-multiply"
//           />
//           <p className="text-sm text-slate-600 dark:text-slate-300 px-4">
//             Authenticate with {selectedIntegration} to link your account and enable data fetching.
//           </p>
//           <div className="flex gap-3 mt-2">
//             <a href={getGoogleOAuthUrl()}>
//               <Button className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:opacity-90">
//                 Proceed
//               </Button>
//             </a>
//             <Button
//               variant="outline"
//               className="border-slate-300"
//               onClick={handlecloseDialog}
//             >
//               Cancel
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
