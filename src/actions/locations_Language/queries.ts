import { getUserFromToken } from "@/app/utils/auth";
import { connectToDB } from "@/lib/db";
import Location from "@/lib/models/Location.model";

const username = process.env.NEXT_PUBLIC_DATAFORSEO_USERNAME;
const password = process.env.NEXT_PUBLIC_DATAFORSEO_PASSWORD;

export const getlanguage = async () => {
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
      const langData = await res.json();
    
      const allLanguages: string[] = [];


      const countries = ["va"];

      langData?.tasks.forEach((task: any) => {
      
       
task?.result?.forEach((loc: any) => {
          loc?.available_languages?.forEach((lang: any) => {
            
            allLanguages.push(
              lang?.language_name
               
            );
          });
        });
      });

    
      if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`Request failed: ${res.status} - ${errorBody}`);
      }

      return { allLanguages };
    }
  } catch (error) {
    console.log(error);

    return { error: "external error" };
  }
};
export const fetchLocation = async () => {
  try {
    const user = await getUserFromToken();
    if (!user) return { error: "Unauthorized" };

    const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");
    const res: any = await fetch(
      `${process.env.NEXT_PUBLIC_DATAFORSEO_URL}serp/google/locations`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${basicAuth}`,
        },
      }
    );

    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`Request failed: ${res.status} - ${errorBody}`);
    }

    const locationData = await res.json();
 
    const allLocations: { locationName: string; locationCode: number, locationIsoCode: string }[] = [];
    const allLanguages: string[] = [];

    const countries = ["ca", "us", "au", "nz", "uk"];

    locationData?.tasks.forEach((task: any) => {
      const filteredData = task.result
        .filter((item: any) =>
          countries.includes(item.country_iso_code.toLowerCase())
        )
        .map((item: any) => ({
          ...item,
          country_iso_code: item.country_iso_code.toUpperCase(),
        }));

      
      filteredData.forEach((loc: any) => {
        
        allLocations.push({
          locationName:
            loc.location_name,
            // loc.location_name.charAt(0).toUpperCase() +
            // loc.location_name.slice(1).toLowerCase(),
          locationCode: loc?.location_code,
          locationIsoCode: loc?.country_iso_code,
        });

       
      });
    });

    console.log(allLocations, "data locations");

    const locationsDbData = await Location.insertMany(allLocations);


    return { allLocations };
  } catch (error) {
    console.log(error);
    return { error: "external error" };
  }
};
export const fetchDBLocation = async (query: string) => {
  try {
    await connectToDB();
    const user = await getUserFromToken();
    if (!user) return { error: "Unauthorized" };

  

    const matchedLocations = await Location.find({
      locationName: { $regex: `^${query}`, $options: "i" },
    }).limit(50);
    

    if (!matchedLocations.length) {
      return { error: "No matching locations found" };
    }


    return { allLocations: matchedLocations };
  } catch (error) {
    console.error("Error fetching locations:", error);
    return { error: "Internal server error" };
  }
};
