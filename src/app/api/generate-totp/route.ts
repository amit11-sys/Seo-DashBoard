import { authenticator } from "otplib";
import QRCode from "qrcode";
import User from "@/lib/models/user.model";
import { connectToDB } from "@/lib/db";

export async function GET(req: Request) {
  await connectToDB();
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  if (!email) return new Response("No email", { status: 400 });

  const secrets  = await User.findOne({ email });
  // const secret = authenticator.generateSecret();
  const otpauth = authenticator.keyuri(email, "TrackScop", secrets.totpSecret);
  const qrCodeDataURL = await QRCode.toDataURL(otpauth);


  return Response.json({ qrCodeDataURL });
}
