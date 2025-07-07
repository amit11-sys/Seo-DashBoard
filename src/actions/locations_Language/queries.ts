import { getUserFromToken } from "@/app/utils/auth";

const username = process.env.NEXT_PUBLIC_DATAFORSEO_USERNAME;
const password = process.env.NEXT_PUBLIC_DATAFORSEO_PASSWORD;

export const getLocation_language = async () => {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized" };
    }

    if (user) {
      const basicAuth = Buffer.from(`${username}:${password}`).toString(
        "base64"
      );
      const res: any = await fetch(
        `${process.env.NEXT_PUBLIC_DATAFORSEO_URL}${"dataforseo_labs/locations_and_languages"}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${basicAuth}`,
          },
        }
      );
      const locationData = await res.json();
     
      const allLanguages: string[] = [];
      const allLocations: string[] = [];
      locationData.tasks.forEach((data: any) => {
        data.result.forEach((allData: any) => {
          allLocations.push(
            allData.location_name.charAt(0).toUpperCase() +
              allData.location_name.slice(1).toLowerCase()
          );

          allData.available_languages.forEach((langdata: any) => {
            allLanguages.push( 
              langdata.language_name.charAt(0).toUpperCase() +
                langdata.language_name.slice(1).toLowerCase()
            );
          });
        });
      });

      if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`Request failed: ${res.status} - ${errorBody}`);
      }

      return { allLanguages, allLocations };
    }
  } catch (error) {
    console.log(error);

    return { error: "external error" };
  }
};
