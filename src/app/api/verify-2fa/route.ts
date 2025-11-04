// import { authenticator } from "otplib";
// import User from "@/lib/models/user.model";
// import { generateAccessAndRefreshToken } from "@/actions/user/queries";
// import { cookies } from "next/headers";
// // import { signTokenAndSetCookie } from "@/lib/auth"; 
// export async function POST(req:any) {
//   const { email, code,userId, campaignId } = await req.json();

//   console.table({email,code,userId,campaignId,ok:"okokoggg"})

//   const user = await User.findOne({ email });
//     console.log(user,"userapna")
//     // KJ4Q4TA6BUBSCHBA - totpSecret
//   if (!user) return Response.json({ success: false });

//   const isValid = authenticator.verify({
//     token: code,
//     secret: user.totpSecret,
//   });

//   if (!isValid) {
// return Response.json({ success: false, message: "Invalid code ok" });
//   }

//   // ✅ Now create session cookie
// //   await signTokenAndSetCookie(user);
//  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
//       userId
//     );

//     // Set cookies
//     if (accessToken) {
//       cookies().set("accessToken", accessToken, {
//         // httpOnly: true,
//         // secure: true,
//       });
//     }
//     if (refreshToken) {
//       cookies().set("refreshToken", refreshToken, {
//         // httpOnly: true,
//         // secure: true,
//       });
//     }
//   return Response.json({ success: true, message: "Login successful" });
// }




// import { authenticator } from "otplib";
// import User from "@/lib/models/user.model";
// import { generateAccessAndRefreshToken } from "@/actions/user/queries";
// import { cookies } from "next/headers";
// import { connectToDB } from "@/lib/db";

// authenticator.options = { window: 1 }; // allow 30 sec clock drift

// export async function POST(req: Request) {
//   await connectToDB();
  
//   const { email, code, userId } = await req.json();

//   console.log("Verify Input:", { email, code, userId });

//   const user = await User.findOne({ email });

//   if (!user || !user.totpSecret) {
//     return Response.json({ success: false, message: "User not found or 2FA not enabled" });
//   }

//   const secret = user.totpSecret.trim();
//   authenticator.options = {
//   step: 30,
//   window: 1
// };
// const isValid = authenticator.verify({ token: code, secret });


//   // const isValid = authenticator.verify({
//   //   token: code,
//   //   secret,
//   // });

//   console.log("DB Secret:", secret);
//   console.log("App Code:", code);
//   console.log("Server Generated:", authenticator.generate(secret));

//   if (!isValid) {
//     return Response.json({ success: false, message: "Invalid OTP" });
//   }

//   // ✅ Generate tokens
//   const { accessToken, refreshToken } = await generateAccessAndRefreshToken(userId);

//   if (accessToken) {
//     cookies().set("accessToken", accessToken);
//   }
//   if (refreshToken) {
//     cookies().set("refreshToken", refreshToken);
//   }

//   return Response.json({ success: true, message: "2FA Verified" });
// }



// import { authenticator } from "otplib";
// import User from "@/lib/models/user.model";
// import { generateAccessAndRefreshToken } from "@/actions/user/queries";
// import { cookies } from "next/headers";
// import { connectToDB } from "@/lib/db";

// // ✅ allow 30s tolerance for time drift
// authenticator.options = { step: 30, window: 1 };

// export async function POST(req: Request) {
//   await connectToDB();
  
//   const { email, code, userId } = await req.json();

//   const user = await User.findOne({ email });

//   if (!user || !user.totpSecret) {
//     return Response.json({ success: false, message: "User not found or 2FA not enabled" });
//   }

//   const secret = user.totpSecret.trim();

//   // ✅ verify OTP correctly
//   const isValid = authenticator.verify({ token: code, secret });

//   console.log("Secret:", secret);
//   console.log("Received Code:", code);
//   console.log("Server Generated:", authenticator.generate(secret));

//   if (!isValid) {
//     return Response.json({ success: false, message: "Invalid OTP Code" });
//   }

//   // ✅ Tokens
//   const { accessToken, refreshToken } = await generateAccessAndRefreshToken(userId);

//   if (accessToken) cookies().set("accessToken", accessToken);
//   if (refreshToken) cookies().set("refreshToken", refreshToken);

//   return Response.json({ success: true, message: "2FA Verified Successfully" });
// }





// import { authenticator } from "otplib";
// import User from "@/lib/models/user.model";
// import { connectToDB } from "@/lib/db";
// import { generateAccessAndRefreshToken } from "@/actions/user/queries";
// import { cookies } from "next/headers";

// authenticator.options = { step: 30, window: 1 };

// export async function POST(req: Request) {
//   await connectToDB();
//   console.log(req,"reqinOtp")
//   const { email, code } = await req.json();
//   console.log(email,code,"response in api")
//   const user = await User.findOne({ email });
//   console.log(user,"userINapi")
//   if (!user || !user.totpSecret) {
//     return Response.json({ success: false, message: "2FA not setup" });
//   }

//   const isValid = authenticator.verify({ token: code, secret: user.totpSecret.trim() });
//   console.log(isValid,"ok valid hai")
//   if (!isValid) return Response.json({ success: false });
//    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
// console.table({accessToken,refreshToken,ok:"access and refresh token"})
//   if (accessToken) cookies().set("accessToken", accessToken);
//   if (refreshToken) cookies().set("refreshToken", refreshToken);
//   return Response.json({ success: true, message: "2FA Verified" });
// }




import { authenticator } from "otplib";
import User from "@/lib/models/user.model";
import { connectToDB } from "@/lib/db";
import { generateAccessAndRefreshToken } from "@/actions/user/queries";
import { cookies } from "next/headers";

authenticator.options = { step: 30, window: 1 };

export async function POST(req: Request) {
  try {
    await connectToDB();

    const { email, code } = await req.json();

    const user = await User.findOne({ email });
    if (!user || !user.totpSecret) {
      return Response.json({ success: false, message: "2FA not setup" });
    }

    const isValid = authenticator.verify({
      token: code,
      secret: user.totpSecret.trim()
    });

    if (!isValid) {
      return Response.json({ success: false, message: "Invalid OTP" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    if (accessToken) cookies().set("accessToken", accessToken);
    if (refreshToken) cookies().set("refreshToken", refreshToken);

    return Response.json({ success: true, message: "2FA Verified ✅" });

  } catch (err) {
    console.error("2FA VERIFY ERROR:", err);
    return Response.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
