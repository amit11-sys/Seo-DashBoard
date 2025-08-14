import { NextResponse } from "next/server";
import { createNewkeywords } from "@/actions/addKeywords";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await createNewkeywords(body); // Server-side function

    const campaignId = body?.campaignId?.campaignId;

    
    if (campaignId) {
      revalidatePath(`/dashboard/${campaignId}`);
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
