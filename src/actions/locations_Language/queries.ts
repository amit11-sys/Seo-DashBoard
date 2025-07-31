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
      
      //  console.log(langData?.tasks[0]?.result[0]?.available_languages[0].language_name,"location api")
      // const allLocations: { locationName: string; locationCode: number }[] = [];
      const allLanguages: string[] = [];

      // console.log(locationData.tasks, "locations");

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
// export const getLocation_language = async () => {
//   try {
//     const user = await getUserFromToken();
//     if (!user) {
//       return { error: "Unauthorized" };
//     }

//     if (user) {
//       const basicAuth = Buffer.from(`${username}:${password}`).toString(
//         "base64"
//       );
//       const res: any = await fetch(
//         // `${process.env.NEXT_PUBLIC_DATAFORSEO_URL}${"dataforseo_labs/locations_and_languages"}`
//         `https://api.dataforseo.com/v3/serp/google/locations`,

//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Basic ${basicAuth}`,
//           },
//         }
//       );
//       const locationData = await res.json();
//       //  console.log(locationData.tasks,"location api")
//       const allLocations: { locationName: string; locationCode: number }[] = [];
//       const allLanguages: string[] = [];

//       console.log(locationData.tasks,"locations")

//       // locationData.tasks.forEach((task: any) => {
//       //   task.result.forEach((loc: any) => {
//       //     allLocations.push({
//       //       locationName:
//       //         loc.location_name.charAt(0).toUpperCase() +
//       //         loc.location_name.slice(1).toLowerCase(),
//       //       locationCode: loc.location_code,
//       //     });

//       //     loc.available_languages.forEach((lang: any) => {
//       //       allLanguages.push(
//       //         lang.language_name.charAt(0).toUpperCase() +
//       //           lang.language_name.slice(1).toLowerCase()
//       //       );
//       //     });
//       //   });
//       // });

//       // console.log(allLocations);
//       // console.log(allLanguages);

//       if (!res.ok) {
//         const errorBody = await res.text();
//         throw new Error(`Request failed: ${res.status} - ${errorBody}`);
//       }

//       return { allLanguages, allLocations };
//     }
//   } catch (error) {
//     console.log(error);

//     return { error: "external error" };
//   }
// };

export const fetchLocation = async () => {
  try {
    const user = await getUserFromToken();
    if (!user) return { error: "Unauthorized" };

    const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");
    // console.log(,"country NAME")
    const res: any = await fetch(
      `https://api.dataforseo.com/v3/serp/google/locations`,
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
    const allLocations: { locationName: string; locationCode: number }[] = [];
    const allLanguages: string[] = [];

    const countries = ["ca", "us", "au", "nz", "uk"];

    locationData?.tasks.forEach((task: any) => {
      // Filter country-specific data once per task
      const filteredData = task.result
        .filter((item: any) =>
          countries.includes(item.country_iso_code.toLowerCase())
        )
        .map((item: any) => ({
          ...item,
          country_iso_code: item.country_iso_code.toUpperCase(),
        }));

      // console.log(filteredData, "filtered country data");

      // Then process each location
      filteredData.forEach((loc: any) => {
        // console.log(loc, "locooo"); 
        allLocations.push({
          locationName:
            loc.location_name,
            // loc.location_name.charAt(0).toUpperCase() +
            // loc.location_name.slice(1).toLowerCase(),
          locationCode: loc.location_code,
        });

        // If you want to process languages per location:
        // loc.available_languages?.forEach((lang: any) => {
        //   allLanguages.push(
        //     lang.language_name.charAt(0).toUpperCase() +
        //     lang.language_name.slice(1).toLowerCase()
        //   );
        // });
      });
    });

    // console.log(allLocations, "data locations");

    const locationsDbData = await Location.insertMany(allLocations);

    // console.log(locationsDbData, "Db data loaction in backend");

    return { allLocations };
  } catch (error) {
    console.log(error);
    return { error: "external error" };
  }
};
// export const fetchDBLocation = async (quary:string) => {
//   try {
//     const user = await getUserFromToken();
//     if (!user) return { error: "Unauthorized" };

//     const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");
//     // console.log(,"country NAME")
//     // const res: any = await fetch(
//     //   // `https://api.dataforseo.com/v3/serp/google/locations`,
//     //   {
//     //     method: "GET",
//     //     headers: {
//     //       "Content-Type": "application/json",
//     //       Authorization: `Basic ${basicAuth}`,
//     //     },
//     //   }
//     // );
//     // await Location.find(allLocations)
//     if (!res.ok) {
//       const errorBody = await res.text();
//       throw new Error(`Request failed: ${res.status} - ${errorBody}`);
//     }

//     const locationData = await res.json();
//     const allLocations: { locationName: string; locationCode: number }[] = [];
//     const allLanguages: string[] = [];

//    locationData?.tasks.forEach((task: any) => {
//       console.log(task,"filter task")
//       const filteredData = task.result.filter((item: any) =>
//         item.location_name.toLowerCase().includes(quary.toLowerCase())
//       );
//       console.log(filteredData,"filter datta locations")

//       filteredData.forEach((loc: any) => {
//         allLocations.push({
//           locationName:
//             loc.location_name.charAt(0).toUpperCase() +
//             loc.location_name.slice(1).toLowerCase(),
//           locationCode: loc.location_code,
//         });

//         // loc.available_languages?.forEach((lang: any) => {
//         //   allLanguages.push(
//         //     lang.language_name.charAt(0).toUpperCase() +
//         //     lang.language_name.slice(1).toLowerCase()
//         //   );
//         // });
//       });
//     });

//     console.log(allLocations,"data locations")

//     const locationsDbData = await Location.insertMany(allLocations)

//     console.log(locationsDbData,"Db data loaction in backend")

//     return { allLocations };
//   } catch (error) {
//     console.log(error);
//     return { error: "external error" };
//   }
// };

export const fetchDBLocation = async (query: string) => {
  try {
    await connectToDB();
    const user = await getUserFromToken();
    if (!user) return { error: "Unauthorized" };

    // Case-insensitive search in MongoDB for partial match
    // console.log(query,"fetch quary")
    // console.log('calling database with query:', query);

    const matchedLocations = await Location.find({
      locationName: { $regex: `^${query}`, $options: "i" },
    }).limit(50);
    // .select("locationName locationCode -_id"); // Select only required fields

    // console.log(matchedLocations,"matchloactins in fetch")

    if (!matchedLocations.length) {
      return { error: "No matching locations found" };
    }

    // console.log(matchedLocations, "Filtered locations from DB");

    return { allLocations: matchedLocations };
  } catch (error) {
    console.error("Error fetching locations:", error);
    return { error: "Internal server error" };
  }
};
