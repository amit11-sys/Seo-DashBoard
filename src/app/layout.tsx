


import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Loader from "@/components/global/Loader";

import ReactQueryProvider from "@/components/ReactQueryProvider";

import { CampaignDataProvider } from "@/app/context/CampaignContext";
import SessionExpiredDialog from "@/components/Common/SessionExpiredDialog";
import { LanguageProvider } from "./context/LanguageContext";

import { Montserrat } from "next/font/google";

// ✅ Add Montserrat
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});


export const metadata: Metadata = {
  title: "Track-Scop | SEO Keyword Tracker",
  description: "SEO Keyword Tracking made simple",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* ✅ Apply font to entire app */}
      <body className={`${montserrat.className} antialiased relative`}>
        <CampaignDataProvider>
          <LanguageProvider>
            <Loader />
            <ReactQueryProvider>
              {children}
              <SessionExpiredDialog />
            </ReactQueryProvider>
            <Toaster />
          </LanguageProvider>
        </CampaignDataProvider>
      </body>
    </html>
  );
}
