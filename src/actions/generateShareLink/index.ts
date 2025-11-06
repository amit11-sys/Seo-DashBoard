import {
  deleteUserAccess,
  GenerateShareLink,
  GenerateSingleShareLink,
  SaveAssignedCampaigns,
  SingleValidateShareToken,
  UserAccessData,
  validateShareToken,
} from "./queries";

export const getGenerateShareLink = async (
  path: string,
  campignId: string[],
  email: string
) => {
  const SharedLink = await GenerateShareLink(path, campignId, email);

  return SharedLink;
};
export const getGenerateSingleShareLink = async (
  path: string,
  campignId: string,
  // email: string
) => {
  const SharedLink = await GenerateSingleShareLink(path, campignId);

  return SharedLink;
};
export const getValidateShareToken = async (token: string) => {
  const SharedLink = await validateShareToken(token);

  return SharedLink;
};
export const getSingleValidateShareToken = async (token: string) => {
  const SharedLink = await SingleValidateShareToken(token);

  return SharedLink;
};
export const getUserAccessData = async () => {
  const SharedLink = await UserAccessData();

  return SharedLink;
};
export const getDeleteUserAccess = async (id: string) => {
  const SharedLink = await deleteUserAccess(id);

  return SharedLink;
};
export const getSaveAssignedCampaigns = async (
  accessId: string,
  campaignIds: string[]
) => {
  const SharedLink = await SaveAssignedCampaigns(accessId, campaignIds);

  return SharedLink;
};
