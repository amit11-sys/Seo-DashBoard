"use server";
import { getUserFromToken } from "@/app/utils/auth";

import { connectToDB } from "@/lib/db";
import GoogleAccount from "@/lib/models/googleAccount.model";
import { getListConsoleAccounts } from "../googleConsole";
import Campaign from "@/lib/models/campaign.model";
import { match } from "assert";
import GoogleSites from "@/lib/models/gscSites.model";
import mongoose from "mongoose";
import { url } from "inspector";
import { listAnalyticsAccounts } from "../analytics/queries";

export const GmailLoginDetails = async () => {
  try {
    await connectToDB(); // must be before using the model!

    const googleAccounts = await GoogleAccount.find();

    if (!googleAccounts) {
      throw new Error("Failed to fetch Gmail login details");
    }

    return {
      success: true,
      message: "Successfully fetched Gmail login details",
      googleAccounts,
    };
  } catch (error) {
    console.error("Error fetching Gmail login details:", error);
    return { success: false, error: "Error fetching Gmail login details" };
  }
};

export const FetchGoogledata = async (
  integrationType: string,
  selectedGmail: string
) => {
  try {
    await connectToDB();

    // 1️⃣ Get token for this Gmail
    const tokensDetails = await GoogleAccount.findOne({
      googleEmail: selectedGmail,
    });
    if (!tokensDetails?.googleAccessToken) {
      throw new Error("No access token found for this Gmail");
    }

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

    // 2️⃣ Fetch account list from Google

    // let accountConsoleData: any = {};
    if (integrationType === "gsc") {
      let accountConsoleData: any = await getListConsoleAccounts(
        tokensDetails.googleAccessToken
      );

      // 3️⃣ Fetch all campaigns from DB
      const campaigns = await Campaign.find();
      // const allCampigns = campaigns.map((campaign: any) => campaign.projectUrl);

      // 4️⃣ Helper function to normalize URLs
      const normalizeUrl = (url: string) =>
        url
          ?.toLowerCase()
          .replace(/^https?:\/\//, "") // remove http:// or https://
          .replace(/^www\./, "") // remove www.
          .replace(/\/$/, ""); // remove trailing slash

      // 5️⃣ Match each campaign’s projectUrl with siteEntry.siteUrl
      const matchedCampaigns = campaigns
        .map((campaign: any) => {
          // const projectUrls = Array.isArray(campaign.projectUrl)
          //   ? campaign.projectUrl
          //   : campaign.projectUrl
          //     ? [campaign.projectUrl]
          //     : [];

          // const normalizedProjectUrls = projectUrls.map(normalizeUrl);

          // const matchingAccounts = accountConsoleData.siteEntry.filter(
          //   (account: any) => {
          //     const normalizedSiteUrl = normalizeUrl(account.siteUrl || "");

          //     // ✅ Compare normalized URLs (either contains the other)
          //     return normalizedProjectUrls.some(
          //       (url: string) =>
          //         normalizedSiteUrl.includes(url) ||
          //         url.includes(normalizedSiteUrl)
          //     );
          //   }
          // );

          // Keep only campaigns that actually matched
          // if (matchingAccounts.length > 0) {
            return {
              campaignId: campaign._id,
              campaignsUrl: campaign.projectUrl,
              campaignName: campaign.displayName || "Unnamed Campaign",
              // projectUrls,
              // allCampigns,
            };
          // }

          // return null;
        })
        .filter(Boolean);

      // 6️⃣ Return final result
      return {
        success: true,
        message: "Successfully fetched Google data and matched campaigns",
        data: {
          gmail: selectedGmail,
          integrationType,
          matchedCampaigns,
          accountConsoleData,
        },
      };
    }
    // if (integrationType === "ga") {
    //   let analyticsAccountList: any = await listAnalyticsAccounts(
    //     tokensDetails.googleAccessToken
    //   );

    //   // 3️⃣ Fetch all campaigns from DB
    //   const campaigns = await Campaign.find();

    //   // 4️⃣ Helper function to normalize URLs/**

    //   const normalizeDisplayName = (name: string): string => {
    //     if (!name) return "";

    //     let normalized = name.trim().toLowerCase();

    //     // If it looks like a URL, normalize it like a URL
    //     if (
    //       /^https?:\/\//i.test(normalized) ||
    //       /\.[a-z]{2,}$/.test(normalized)
    //     ) {
    //       normalized = normalized
    //         .replace(/^https?:\/\//, "") // remove http/https
    //         .replace(/^www\./, "") // remove www
    //         .replace(/\/$/, "") // remove trailing slash
    //         .replace(/\/.*$/, "") // remove everything after first slash (path)
    //         .trim();
    //     } else {
    //       // It's likely a company name — normalize spaces and special chars
    //       normalized = normalized
    //         .replace(/[^a-z0-9]+/g, " ") // replace special chars with space
    //         .replace(/\s+/g, " ") // collapse multiple spaces
    //         .trim();
    //     }

    //     return normalized;
    //   };

    //   // 5️⃣ Match each campaign’s projectUrl with siteEntry.siteUrl
    //   const matchedCampaigns = campaigns
    //     .map((campaign: any) => {
    //       const projectUrls = Array.isArray(campaign.projectUrl)
    //         ? campaign.projectUrl
    //         : campaign.projectUrl
    //           ? [campaign.projectUrl]
    //           : [];

    //       const normalizedProjectUrls = projectUrls.map(normalizeDisplayName);

    //       const matchingAccounts = analyticsAccountList.accounts.filter(
    //         (account: any) => {
    //           const normalizedSiteUrl = normalizeDisplayName(
    //             account.displayName || ""
    //           );

    //           // ✅ Compare normalized URLs (either contains the other)
    //           return normalizedProjectUrls.some(
    //             (url: string) =>
    //               normalizedSiteUrl.includes(url) ||
    //               url.includes(normalizedSiteUrl)
    //           );
    //         }
    //       );

    //       // Keep only campaigns that actually matched
    //       if (matchingAccounts.length > 0) {
    //         return {
    //           campaignId: campaign._id,
    //           campaignName: campaign.displayName || "Unnamed Campaign",
    //           projectUrls,
    //           matchingAccounts,
    //         };
    //       }

    //       return null;
    //     })
    //     .filter(Boolean);

    //   // 6️⃣ Return final result
    //   return {
    //     success: true,
    //     message: "Successfully fetched Ansalytics data and matched campaigns",
    //     data: {
    //       gmail: selectedGmail,
    //       integrationType,
    //       matchedCampaigns,
    //       analyticsAccountList,
    //     },
    //   };
    // }

if (integrationType === "ga") {
  let analyticsAccountList: any = await listAnalyticsAccounts(
    tokensDetails.googleAccessToken
  );
    // 3️⃣ Fetch all campaigns from DB
      const campaigns = await Campaign.find();
      // const allCampigns = campaigns.map((campaign: any) => campaign.projectUrl);

      // 4️⃣ Helper function to normalize URLs
      const normalizeUrl = (url: string) =>
        url
          ?.toLowerCase()
          .replace(/^https?:\/\//, "") // remove http:// or https://
          .replace(/^www\./, "") // remove www.
          .replace(/\/$/, ""); // remove trailing slash

      // 5️⃣ Match each campaign’s projectUrl with siteEntry.siteUrl
      const matchedCampaigns = campaigns
        .map((campaign: any) => {
          // const projectUrls = Array.isArray(campaign.projectUrl)
          //   ? campaign.projectUrl
          //   : campaign.projectUrl
          //     ? [campaign.projectUrl]
          //     : [];

          // const normalizedProjectUrls = projectUrls.map(normalizeUrl);

          // const matchingAccounts = accountConsoleData.siteEntry.filter(
          //   (account: any) => {
          //     const normalizedSiteUrl = normalizeUrl(account.siteUrl || "");

          //     // ✅ Compare normalized URLs (either contains the other)
          //     return normalizedProjectUrls.some(
          //       (url: string) =>
          //         normalizedSiteUrl.includes(url) ||
          //         url.includes(normalizedSiteUrl)
          //     );
          //   }
          // );

          // Keep only campaigns that actually matched
          // if (matchingAccounts.length > 0) {
            return {
              campaignId: campaign._id,
              campaignsUrl: campaign.projectUrl,
              campaignName: campaign.displayName || "Unnamed Campaign",
              // projectUrls,
              // allCampigns,
            };
          // }

          // return null;
        })
        .filter(Boolean);

      // 6️⃣ Return final result
      return {
        success: true,
        message: "Successfully fetched Google data and matched campaigns",
        data: {
          gmail: selectedGmail,
          integrationType,
          matchedCampaigns,
          analyticsAccountList,
        },
      };
    }




  } catch (error: any) {
    console.error("Error fetching Google login details:", error);
    return {
      success: false,
      message: error.message || "Error fetching Gmail login details",
    };
  }
};

// const normalizeName = (input: string): string => {
//   if (!input) return "";

//   let str = input.trim().toLowerCase();

//   // If it's a URL or domain-like text
//   if (/^https?:\/\//i.test(str) || /\.[a-z]{2,}$/.test(str)) {
//     str = str
//       .replace(/^https?:\/\//, "") // remove protocol
//       .replace(/^www\./, "") // remove www
//       .replace(/\/$/, "") // remove trailing slash
//       .replace(/\/.*$/, "") // remove path
//       .trim();
//   } else {
//     // Normalize text (company names)
//     str = str.replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
//   }

//   return str;
// };

// const matchCampaignsToAccounts = (
//   campaigns: any[],
//   accounts: any[],
//   accountKey: string // "siteUrl" for GSC or "displayName" for GA
// ) => {
//   return campaigns
//     .map((campaign) => {
//       const projectUrls = Array.isArray(campaign.projectUrl)
//         ? campaign.projectUrl
//         : campaign.projectUrl
//           ? [campaign.projectUrl]
//           : [];

//       const normalizedProjectUrls = projectUrls.map(normalizeName);

//       const matchingAccounts = accounts.filter((acc) => {
//         const normalizedAccountValue = normalizeName(acc[accountKey] || "");
//         return normalizedProjectUrls.some(
//           (url:string) =>
//             normalizedAccountValue.includes(url) || url.includes(normalizedAccountValue)
//         );
//       });

//       if (matchingAccounts.length === 0) return null;

//       return {
//         campaignId: campaign._id,
//         campaignName: campaign.displayName || "Unnamed Campaign",
//         projectUrls,
//         matchingAccounts,
//       };
//     })
//     .filter(Boolean);
// };

// export const FetchGoogledata = async (integrationType: string, selectedGmail: string) => {
//   try {
//     await connectToDB();

//     // 1️⃣ Find tokens for the selected Gmail
//     const tokensDetails = await GoogleAccount.findOne({ googleEmail: selectedGmail });
//     const accessToken = tokensDetails?.googleAccessToken;
//     if (!accessToken) throw new Error("No access token found for this Gmail");

//     // 2️⃣ Fetch campaigns once (used for both GA & GSC)
//     const campaigns = await Campaign.find();

//     // 3️⃣ Integration-specific handling
//     if (integrationType === "gsc") {
//       const accountConsoleData:any = await getListConsoleAccounts(accessToken);
//       const matchedCampaigns = matchCampaignsToAccounts(
//         campaigns,
//         accountConsoleData.siteEntry || [],
//         "siteUrl"
//       );

//       return {
//         success: true,
//         message: "✅ Successfully fetched Google Search Console data",
//         data: {
//           gmail: selectedGmail,
//           integrationType,
//           matchedCampaigns,
//           accountConsoleData,
//         },
//       };
//     }

//     if (integrationType === "ga") {
//       const analyticsAccountList = await listAnalyticsAccounts(accessToken);
//       const matchedCampaigns = matchCampaignsToAccounts(
//         campaigns,
//         analyticsAccountList.accounts || [],
//         "displayName"
//       );

//       return {
//         success: true,
//         message: "✅ Successfully fetched Google Analytics data",
//         data: {
//           gmail: selectedGmail,
//           integrationType,
//           matchedCampaigns,
//           analyticsAccountList,
//         },
//       };
//     }

//     // 4️⃣ Fallback: invalid integration type
//     throw new Error(`Unsupported integration type: ${integrationType}`);
//   } catch (error: any) {
//     console.error("❌ Error fetching Google data:", error);
//     return {
//       success: false,
//       message: error.message || "Error fetching Google data",
//     };
//   }
// };

export const SaveGoogleConsoleData = async (
  siteUrl: string,
  permissionLevel: string,
  googleEmail: string,
  campaignId: string
) => {
  try {
    await connectToDB();

    const googleAccount = await GoogleAccount.findOne({ googleEmail });
    if (!googleAccount) {
      throw new Error("Google Account not found for this email");
    }

    const googleConsoleData = await GoogleSites.findOne({ siteUrl });
    if (!googleConsoleData?.siteUrl) {
      const googleConsoleData = await GoogleSites.create({
        siteUrl,
        permissionLevel,
        googleAccountId: googleAccount._id,
      });

      // set campaign id to google account
      await Campaign.findByIdAndUpdate(
        { _id: campaignId },
        { $set: { gscSiteId: googleConsoleData._id } }
      );

      if (!googleConsoleData) {
        throw new Error("Failed to save Google console details");
      }

      return {
        success: true,
        message: "Successfully saved Google console details",
        googleConsoleData,
      };
    }
    return {
      success: true,
      message: "Successfully saved Google console details",
      googleConsoleData,
    };
  } catch (error) {
    console.error("Error saving Google console details:", error);
    return {
      success: false,
      error: "Error saving Google console details",
    };
  }
};
// export const campaignDataWithGoogleData = async (
//   campaignId: string,
//   url: string
// ) => {
//   try {
//     await connectToDB();

//  // ✅ Correct population
//     const campaignGoogleSite = await Campaign.findById(campaignId)
//       .populate({
//         path: "gscSiteId",
//         model: "GoogleSites",
//       })
//     const GoogleSiteswithGoogleData = await GoogleSites.findOne({siteUrl:"https://www.handonawhiteboard.com/"})
//      .populate({
//         path: "googleAccountId",
//         model: "GoogleAccount",
//       });

//       console.log(campaignGoogleSite,GoogleSiteswithGoogleData,"okokgigii")

//     // if (!googleAccount) {
//     //   throw new Error("Google Account not found for this email");
//     // }

//     // const googleConsoleData = await GoogleSites.create({
//     //   siteUrl,
//     //   permissionLevel,
//     //   googleAccountId: googleAccount._id,
//     // });

//     // set campaign id to google account
//     // await Campaign.findByIdAndUpdate(
//     //   { _id: campaignId },
//     //   { $set: { gscSiteId: googleConsoleData._id,googleAccountId: googleAccount._id } }
//     // );

//     // if (!googleConsoleData) {
//     //   throw new Error("Failed to save Google console details");
//     // }

//     return {
//       success: true,
//       message: "Successfully saved Google console details",
//       // googleAccount,
//     };
//   } catch (error) {
//     console.error("Error saving Google console details:", error);
//     return {
//       success: false,
//       error: "Error saving Google console details",
//     };
//   }
// };

// import { connectToDB } from "@/lib/mongoose";
// import Campaign from "@/models/Campaign";
// import GoogleSites from "@/models/GoogleSites";
// import GoogleAccount from "@/models/GoogleAccount";

// export const campaignDataWithGoogleData = async (
//   campaignId: string,
//   // url: string
// ) => {
//   try {
//     await connectToDB();

//     const campaignWithAccountData:any = await Campaign.findById(campaignId)
//       .populate({
//         path: "gscSiteId",
//         model: "GoogleSites",
//         populate: {
//           path: "googleAccountId",
//           model: "GoogleAccount",
//         },
//       }).lean(); // improves performance

//      console.log(campaignWithAccountData,"okokgigii")
//        const access_token = campaignWithAccountData?.gscSiteId?.googleAccountId?.googleAccessToken;
//        const access_token_exp = campaignWithAccountData?.gscSiteId?.googleAccountId?.googleAccessTokenExpiry;
//        const refresh_token = campaignWithAccountData?.gscSiteId?.googleAccountId?.googleRefreshToken;
//       //  const refresh_token_exp = campaignWithAccountData?.gscSiteId?.googleAccountId?.googleRefreshTokenExpiry;

//     return {
//       success: true,
//       message: "Successfully fetched campaign with Google data",
//      campaignWithAccountData
//     };
//   } catch (error: any) {
//     console.error("Error fetching campaign Google data:", error);
//     return {
//       success: false,
//       error: error.message || "Error fetching campaign Google data",
//     };
//   }
// };

// import { connectToDB } from "@/lib/db";
// import Campaign from "@/lib/models/campaign.model";
// import GoogleAccount from "@/lib/models/googleAccount.model";

export const campaignDataWithGoogleData = async (campaignId: string) => {
  try {
    await connectToDB();

    const campaignWithAccountData: any = await Campaign.findById(campaignId)
      .populate({
        path: "gscSiteId",
        model: "GoogleSites",
        populate: {
          path: "googleAccountId",
          model: "GoogleAccount",
        },
      })
      .lean();
        console.log(campaignWithAccountData,"okokgigii")
    if (!campaignWithAccountData)
      throw new Error("Campaign not found or missing Google account.");

    const googleAccount = campaignWithAccountData?.gscSiteId?.googleAccountId;

    if (!googleAccount){
      

      throw new Error("No linked Google account found for this campaign.");
    }

    const {
      googleAccessToken,
      googleAccessTokenExpiry,
      googleRefreshToken,
      googleEmail,
    } = googleAccount;

    let accessToken = googleAccessToken;
    let accessTokenExpiry = googleAccessTokenExpiry;

    const isExpired =
      !accessTokenExpiry ||
      new Date(googleAccessTokenExpiry).getTime() < Date.now();

    if (isExpired && googleRefreshToken) {
      console.log(`🔁 Access token expired for ${googleEmail}, refreshing...`);

      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
          refresh_token: googleRefreshToken,
          grant_type: "refresh_token",
        }),
      });

      const tokenData = await tokenRes.json();
      console.log("New tokenData:", tokenData);

      if (tokenData.access_token) {
        accessToken = tokenData.access_token;
        accessTokenExpiry = new Date(Date.now() + tokenData.expires_in * 1000);

        await GoogleAccount.findByIdAndUpdate(
          googleAccount._id,
          {
            googleAccessToken: accessToken,
            googleAccessTokenExpiry: accessTokenExpiry,
            ...(tokenData.refresh_token && {
              googleRefreshToken: tokenData.refresh_token,
            }),
          },
          { new: true }
        );

        console.log(`✅ Token refreshed and updated for ${googleEmail}`);
      } else {
        console.warn("⚠️ Could not refresh token:", tokenData);
      }
    }

    return {
      success: true,
      message: "Successfully fetched campaign with valid Google tokens",
      campaignWithAccountData,
      googleAccessToken: accessToken,
    };
  } catch (error: any) {
    console.error("Error fetching campaign Google data:", error);
    return {
      success: false,
      error: error.message || "Error fetching campaign Google data",
    };
  }
};




// interface TokenData {
//   access_token: string;
//   refresh_token: string;
//   expiry_date: number; // timestamp in ms
// }

// interface UpdatedTokenResult {
//   success: boolean;
//   data?: TokenData;
//   message?: string;
// }

// /**
//  * Update Google Access Token if expired
//  * @param tokenData Current token data (access + refresh + expiry)
//  * @returns Updated token data
//  */
export const updateGoogleAccessToken = async (
  old_access_token: string, 
  old_refresh_token : string, 
  old_expiry_date : number
)=> {
  try {
   

    // Check if token is still valid
    if (old_access_token && old_expiry_date && Date.now() < old_expiry_date - 60000) {
      // still valid (1 min buffer)
      return { success: true, data:{ access_token : old_access_token, refresh_token : old_refresh_token, expiry_date : old_expiry_date} };
    }

    if (!old_refresh_token) {
      return { success: false, message: "No refresh token available." };
    }

    
      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
          refresh_token: old_refresh_token,
          grant_type: "refresh_token",
        }),
      });

      const tokenData:any = await tokenRes.json();
      console.log("New tokenData:", tokenData);
      await GoogleAccount.findOneAndUpdate(
        { googleRefreshToken: old_refresh_token },
        {
          googleAccessToken: tokenData.access_token,
          googleAccessTokenExpiry: new Date(Date.now() + tokenData.expires_in * 1000),
          googleRefreshToken: tokenData.refresh_token,
        },
        { new: true }
      )
   

    
  
        const { access_token, refresh_token, expiry_date } = tokenData; 

        return { success: true, data:{ access_token, refresh_token, expiry_date} };
  } catch (error: any) {
    console.error("Error refreshing Google token:", error);
    return { success: false, message: error.message || "Failed to refresh token." };
  }
};
