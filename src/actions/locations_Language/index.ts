"use server";

import { getLocation_language } from "./queries";

export const getLocation_languageData = async () => {
  const getLocationData = await getLocation_language();

  return getLocationData;
};

