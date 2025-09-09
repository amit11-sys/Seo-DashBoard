import { fetchGmbMetrics, fetchLocationId } from "./queries";

export const getfetchGmbMetrics = async (accountId: string, locationId : string,access_token: string) => {
  

  const data = await fetchGmbMetrics(accountId,locationId,access_token);
  return data;
};
export const getfetchLocationId = async (locationName: string,access_token: string) => {
  

  const data = await fetchLocationId(locationName,access_token);
  return data;
};