
// import { cookies } from "next/headers";

// export async function userExpire<T>(fn:()=>Promise<T>):Promise <T>{

//     try {

//        return await fn()
//     } catch (err:any) {
//         if(err?.response?.status === 401 || err?.response?.status === 'unauthorized') {

//             cookies().delete('accessToken');
//             throw new Error('Session expired. Please login again.');

//     }
//         throw err

//     }

// }
"use server";
import { logout } from "@/actions/user/queries";
import { cookies } from "next/headers";

export async function userExpire() {
  cookies().delete("accessToken");
  logout()
  throw new Error("Session expired. Please login again.");
}
