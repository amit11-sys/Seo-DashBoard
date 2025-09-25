
"use server";
import { logout } from "@/actions/user/queries";
import { cookies } from "next/headers";

export async function userExpire() {
  cookies().delete("accessToken");
  logout()
  throw new Error("Session expired. Please login again.");
}
