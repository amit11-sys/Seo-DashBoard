"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

// --- Types ---
export interface Campaign {
  _id: string;
  campaignName: string;
  projectUrl: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export type CampaignContextType = Campaign[];

interface CampaignContextProps {
  campaignData: CampaignContextType;
  setCampaignData: Dispatch<SetStateAction<CampaignContextType>>;
  activeSingleCampaign: any;
  setActiveSingleCampaign: Dispatch<SetStateAction<string>>;
}

interface ProviderProps {
  children: ReactNode;
}

// --- Context ---
const CampaignContext = createContext<CampaignContextProps | undefined>(
  undefined
);

// --- Provider ---
export const CampaignDataProvider = ({ children }: ProviderProps) => {
  //  const campaign = await getUserCampaign();
  const [campaignData, setCampaignData] = useState<CampaignContextType>([
    {
      _id: "",
      campaignName: "",
      projectUrl: "",
      userId: "",
      createdAt: "",
      updatedAt: "",
      __v: 0,
    },
  ]);
  const [activeSingleCampaign, setActiveSingleCampaign] = useState<any>();

  return (
    <CampaignContext.Provider
      value={{
        campaignData,
        setCampaignData,
        activeSingleCampaign,
        setActiveSingleCampaign,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

// --- Hook ---
export const useCampaignData = (): CampaignContextProps => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error(
      "useCampaignData must be used within a CampaignDataProvider"
    );
  }
  return context;
};
