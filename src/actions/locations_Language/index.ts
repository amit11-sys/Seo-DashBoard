"use server";

import { fetchDBLocation, fetchLocation, getLocation_language } from "./queries";

export const getLocation_languageData = async () => {
  const getLocationData = await getLocation_language();

  return getLocationData;
};
export const getDbLocationData = async () => {
  const getLocationData = await fetchLocation();

  return getLocationData;
};
export const getfetchDBLocation = async (quary:string) => {
  const getLocationData = await fetchDBLocation(quary);

  return getLocationData;
};

