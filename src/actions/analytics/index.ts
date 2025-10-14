"use server";

import {
  FetchGoogleAnalyticsData,
  AnalyticsData,
  fetchLievKeyword,
  googleAnalyticsAccountID,
  googleAnalyticsPropertyID,
  propertyIdForDB,
  SaveGoogleAnalyticsData,
  disableSearchAnalytics,
} from "./queries";

export const getLiveKeywordData = async (url: string) => {
  const keyword = await fetchLievKeyword(url);
  // console.log(keyword);

  return keyword;
};

export const getGoogleAnalyticsAccountID = async (
  access_token: string,
  nameMatch: string
) => {
  const data = await googleAnalyticsAccountID(access_token, nameMatch);

  return data;
};
export const getGoogleAnalyticsPropertyID = async (
  access_token: string,
  accountId: string,
  nameMatch: string
) => {
  const data = await googleAnalyticsPropertyID(
    access_token,
    accountId,
    nameMatch
  );

  return data;
};
export const getAnalyticsData = async (date: any, campaignId: string) => {
  const data = await AnalyticsData(date, campaignId);

  return data;
};

export const setPropertyIdForDB = async (
  campaignId: string,
  tokenResult: {},
  projectUrl: any
) => {
  const data = await propertyIdForDB(campaignId, tokenResult, projectUrl);

  return data;
};
export const getFetchGoogleAnalyticsData = async (
  integrationType: string,
  selectedGmail: string
) => {
  const data = await FetchGoogleAnalyticsData(integrationType, selectedGmail);

  return data;
};
export const getSaveGoogleAnalyticsData = async (
  displayName: string,
  accountId: string,
  googleEmail: string,
  campaignId: string
) => {
  const data = await SaveGoogleAnalyticsData(
    displayName,
    accountId,
    googleEmail,
    campaignId
  );

  return data;
};
export const getDisableSearchAnalytics = async (campaignId: string) => {
  const data = await disableSearchAnalytics(campaignId);

  return data;
};
