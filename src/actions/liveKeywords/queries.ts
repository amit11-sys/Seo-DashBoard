import { getUserFromToken } from "@/app/utils/auth";
import { connectToDB } from "@/lib/db";
import Keyword from "@/lib/models/keyword.model"
const username = process.env.NEXT_PUBLIC_DATAFORSEO_USERNAME;
const password = process.env.NEXT_PUBLIC_DATAFORSEO_PASSWORD;

export const getLiveData = async (url: string, keyDataArry: []) => {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized" };
    }

    if (user) {
      const basicAuth = Buffer.from(`${username}:${password}`).toString(
        "base64"
      );
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${"serp/google/organic/live/advanced"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${basicAuth}`,
          },
          body: JSON.stringify(keyDataArry),
        }
      );

      if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`Request failed: ${res.status} - ${errorBody}`);
    }

    const liveKeworddata = await res.json();
    console.log(liveKeworddata, "output");

    return liveKeworddata || [];
    }
  } catch (error) {

     console.log(error);

    return { error: "Internal Server Error." };
  }
};


export const getUserKeywordData = async ()=>{

 try {
    await connectToDB();

    const user = await getUserFromToken();
    console.log(user,"user")

    if (!user) {
      return { error: "Unauthorized" };
    }
    // console.log(user);
    
    const keywordData = await Keyword.find({ userId: user?.id });

    console.log(keywordData,"keyworddata")

    if (!keywordData) {
      return { error: "Error while getting campaign" };
    }
    // if (campaign) {
    return {
      success: true,
      message: "Campaign Successfully Found",
      keywordData
    };
    // }
  } catch (error) {
    console.log(error);

    return { error: "Internal Server Error." };
  }



}

