import { fetchGmbMetrics } from "./queries";

export const getfetchGmbMetrics = async (accountId: string, locationId : string,access_token: string) => {
  

  const data = await fetchGmbMetrics(accountId,locationId,access_token);
  return data;
};