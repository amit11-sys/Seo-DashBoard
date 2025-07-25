import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export function getUserFromToken() {
  const token = cookies().get("accessToken")?.value;
  // console.log(token);

  if (!token) return null;
  // console.log('not returned');

  try {
    const decoded = jwt.verify(token, "swayam") as { id: string };
    // console.log(decoded, 'decoding');

    return decoded;
  } catch {
    console.log("catch");

    return null;
  }
}
