import React from "react";
import CampaignTabs from "./CampaignTabs";
// import { getLocation_languageData } from "@/actions/locations_Language";

const TabsComponents = async () => {
  // const location_and_language = await getLocation_languageData();



  // if (
  //   !location_and_language ||
  //   location_and_language.error ||
  //   !location_and_language.allLanguages ||
  //   !location_and_language.allLocations
  // ) {
  //   return <div>Error loading location and language data</div>;
  // }

  // const { allLanguages, allLocations } = location_and_language;

  return (
    <>
      <CampaignTabs 
      // location_and_language={{ allLanguages, allLocations }} 
      />
    </>
  );
};

export default TabsComponents;
