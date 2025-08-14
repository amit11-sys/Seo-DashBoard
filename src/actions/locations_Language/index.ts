"use server";

import { fetchDBLocation, fetchLocation, getlanguage } from "./queries";


export const getDbLocationData = async () => {
  const getLocationData = await fetchLocation();

  return getLocationData;
};
export const getfetchDBLocation = async (quary:string) => {
  const getLocationData = await fetchDBLocation(quary);
  
  return getLocationData?.allLocations || [];
};
export const getlanguageData = async () => {
  const getLocationData = await getlanguage();
  
  return getLocationData
};

