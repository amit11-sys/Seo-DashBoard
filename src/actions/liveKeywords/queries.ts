import { getUserFromToken } from "@/app/utils/auth";
import { connectToDB } from "@/lib/db";

import Campaign from "@/lib/models/campaign.model";

const username = process.env.NEXT_PUBLIC_DATAFORSEO_USERNAME;
const password = process.env.NEXT_PUBLIC_DATAFORSEO_PASSWORD;

interface KeywordPayload {
  keyword: string;
  location_name: string;
  language_name: string;
}

interface KeywordResponse {
  keyword: string;
  response: any;
}

interface ErrorResponse {
  error: string;
}

export const getUserKeywordData = async () => {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    // console.log(user,"user")

    if (!user) {
      return { error: "Unauthorized" };
    }
    // console.log(user);

    const keywordData = await Campaign.find({ userId: user?.id });

    // console.log(keywordData,"keyworddata")

    if (!keywordData) {
      return { error: "Error while getting UserKeywordData" };
    }
    // if (UserKeywordData) {
    return {
      success: true,
      message: "UserKeywordData Successfully Found",
      keywordData,
    };
    // }
  } catch (error) {
    console.log(error);

    return { error: "Internal Server Error." };
  }
};
