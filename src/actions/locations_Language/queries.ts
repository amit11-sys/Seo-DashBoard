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
    //  console.log(locationData.tasks,"location api")
   const allLocations: { locationName: string; locationCode: number }[] = [];
const allLanguages: string[] = [];

locationData.tasks.forEach((task: any) => {
  task.result.forEach((loc: any) => {
    allLocations.push({
      locationName: loc.location_name.charAt(0).toUpperCase() + loc.location_name.slice(1).toLowerCase(),
      locationCode: loc.location_code
    });

    loc.available_languages.forEach((lang: any) => {
      allLanguages.push(
        lang.language_name.charAt(0).toUpperCase() + lang.language_name.slice(1).toLowerCase()
      );
    });
  });
});

// console.log(allLocations);
// console.log(allLanguages);


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
