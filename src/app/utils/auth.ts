import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET ?? "";

export function getUserFromToken() {
  const token = cookies().get("accessToken")?.value;
  // console.log(token);
  
  if (!token) return null;
  // console.log('not returned');

  try {
    const decoded = jwt.verify(token,TOKEN_SECRET) as { id: string };
    // console.log(decoded, 'decoding');

    return decoded;
  } catch {
    console.log("catch : token error");

    return null;
  }
}
