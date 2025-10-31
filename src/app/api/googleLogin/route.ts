// import { setPropertyIdForDB } from "@/actions/analytics";
// import {
//   getCurrentCampaignIdData,
//   getDbCompaignDataUpdate,
// } from "@/actions/campaign";

// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest) {
//   const url = new URL(req.url);
//   const code = url.searchParams.get("code");
//   const state = url.searchParams.get("state")?.toString();
//   let decoded = "";
//   if (state !== undefined) {
//     decoded = decodeURIComponent(state);
//   }

//   const stateData = JSON.parse(decoded);

//   console.log(stateData, "state data object");

//   if (!code) {
//     return NextResponse.json({ message: "No code provided." }, { status: 400 });
//   }

//   try {
//     const tokenData = {
//       code: code,
//       client_id: `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`,
//       client_secret: `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET}`,
//       redirect_uri: `${process.env.NEXT_PUBLIC_REDIRECT_URI}api/googleLogin`,
//       grant_type: "authorization_code",
//     };

//     const tokenRes = await fetch(
//       `${process.env.NEXT_PUBLIC_GOOGLE_AUTH_TOKEN}`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//         body: new URLSearchParams(tokenData as any).toString(),
//       }
//     );

//     const tokenResult = await tokenRes.json();
//     if (tokenResult) {
//       // await getDbCompaignDataUpdate(stateData.campaignId, tokenResult);
//       // return NextResponse.redirect(
//       //   new URL(`/dashboard/${stateData.campaignId}`, req.url)
//       // );
//       return new Response(
//   `
//   <html>
//     <body>
//       <script>
//         window.opener.postMessage({ gmail: "${tokenResult?.email}" }, "${process.env.NEXT_PUBLIC_APP_URL}");
//         window.close();
//       </script>
//     </body>
//   </html>
//   `,
//   { headers: { "Content-Type": "text/html" } }
// );

//     }
//     // if (stateData?.consoleData) {
//     //   await getDbCompaignDataUpdate(stateData.campaignId, tokenResult);
//     // }

//     // const currentCampaignIdData = await getCurrentCampaignIdData(
//     //   stateData.campaignId
//     // );
//     // const projectUrl = currentCampaignIdData?.CurrentCampaignIdData?.projectUrl;
//     // if (stateData?.analyticsData) {
//     //   await setPropertyIdForDB(stateData.campaignId, tokenResult, projectUrl);
//     //   await getDbCompaignDataUpdate(stateData.campaignId, tokenResult);
//     // }
//     // if (stateData?.consoleData) {
//     //   await getDbCompaignDataUpdate(stateData.campaignId, tokenResult);
//     // }
//   } catch (err) {
//     console.error("Error in Google OAuth Callback:", err);
//     return NextResponse.json({ message: "OAuth Error" }, { status: 500 });
//   }
// }

// import { NextRequest, NextResponse } from "next/server";
// import GoogleAccount from "@/lib/models/googleAccount.model";
// import { connectToDB } from "@/lib/db";
// import Campaign from "@/lib/models/campaign.model";

// export async function GET(req: NextRequest) {
//   const url = new URL(req.url);
//   const code = url.searchParams.get("code");
//   const state = url.searchParams.get("state");

//   if (!code) {
//     return NextResponse.json({ message: "No code provided." }, { status: 400 });
//   }

//   let stateData = {} as any;
//   if (state) {
//     stateData = JSON.parse(decodeURIComponent(state));
//   }

//   try {
//     // 1️⃣ Exchange code for tokens
//     const tokenData = {
//       code,
//       client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
//       client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
//       redirect_uri: `${process.env.NEXT_PUBLIC_REDIRECT_URI}api/googleLogin`,
//       grant_type: "authorization_code",
//     };

//       method: "POST",
//       headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       body: new URLSearchParams(tokenData as any).toString(),
//     });
//     const tokenResult = await tokenRes.json();
//     const accessToken = tokenResult.access_token;
//     const refreshToken = tokenResult.refresh_token;

//     if (!accessToken) {
//       return NextResponse.json(
//         { message: "Failed to get access token" },
//         { status: 500 }
//       );
//     }

//     // 2️⃣ Fetch Gmail/email
//     const userRes = await fetch(
//       {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       }
//     );
//     const userData = await userRes.json(); // userData.email

//     // 3️⃣ Save to MongoDB
//     const client = await connectToDB();
//     // const db = client.db("your_db_name");
//     // const campaigns = db.collection("campaigns");

//     // Save a new Google account for a campaign
//     const googleaccountData = await GoogleAccount.findOne({
//       googleEmail: userData.email,
//     });

//     if (googleaccountData?.googleEmail === userData.email) {
//       // error for already connected
//       return new Response(
//         `
//       <html>
//         <body style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;">
//           <div style="text-align:center;">
//             <p style="color:red;">This Google account is already connected!</p>
//             <p>Please close this window.</p>
//           </div>
//           <script>
//             // Optional: auto-close after 5 seconds
//             setTimeout(() => { window.close(); }, 5000);
//           </script>
//         </body>
//       </html>
//       `,
//         { headers: { "Content-Type": "text/html" } }
//       );
//     } else {
//       const googleAccountData = await GoogleAccount.create({
//         googleEmail: userData.email,
//         googleAccessToken: accessToken,
//         googleRefreshToken: refreshToken,
//         googleAccessTokenExpiry: tokenResult.expires_in
//           ? new Date(Date.now() + tokenResult.expires_in * 1000)
//           : null,
//         googleRefreshTokenExpiry: null, // usually refresh tokens do not expire
//         googleId_token: tokenResult.id_token,
//       });
//       // set campaign id to google account
//       await Campaign.findByIdAndUpdate(
//         { _id: stateData?.campaignId },
//         { $set: { googleAccountId: googleAccountData._id } }

//       );

//     }

//     // 4️⃣ Return Gmail to popup
//     return new Response(
//       `
//   <html>
//     <body style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;">
//       <div style="text-align:center;">
//         <p>Google account connected successfully!</p>
//         <p>Please close this window.</p>
//       </div>
//       <script>
//         // Send Gmail to opener
//         window.opener.postMessage({ gmail: "${userData.email}" }, "${process.env.NEXT_PUBLIC_APP_URL}");
//         // Optional: auto-close after 5 seconds
//         setTimeout(() => { window.close(); }, 5000);
//       </script>
//     </body>
//   </html>
//   `,
//       { headers: { "Content-Type": "text/html" } }
//     );
//   } catch (err) {
//     console.error("Google OAuth Error:", err);
//     return NextResponse.json({ message: "OAuth Error" }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import GoogleAccount from "@/lib/models/googleAccount.model";
import { connectToDB } from "@/lib/db";
import Campaign from "@/lib/models/campaign.model";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code) {
    return NextResponse.json({ message: "No code provided." }, { status: 400 });
  }

  let stateData: any = {};
  // console.log(stateData, "stateData");
  if (state) {
    stateData = JSON.parse(decodeURIComponent(state));
  }

  try {
    // 1️⃣ Exchange code for tokens
    const tokenData = {
      code,
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.NEXT_PUBLIC_REDIRECT_URI}api/googleLogin`,
      grant_type: "authorization_code",
    };
    // console.log(tokenData, "tokenData");

    const tokenRes = await fetch(`${process.env.NEXT_PUBLIC_GOOGLE_AUTH_TOKEN}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(tokenData as any).toString(),
    });

    const tokenResult = await tokenRes.json();
    // console.log(tokenResult, "tokenResult");
    const accessToken = tokenResult.access_token;
    const refreshToken = tokenResult.refresh_token;

    if (!accessToken) {
      return NextResponse.json(
        { message: "Failed to get access token" },
        { status: 500 }
      );
    }

    // 2️⃣ Fetch Gmail/email
    const userRes = await fetch(
      `${process.env.NEXT_PUBLIC_USER_INFO}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const userData = await userRes.json();
    // console.log(userData, "userData");

    // 3️⃣ Connect to DB
    await connectToDB();

    // 4️⃣ Check if account already exists
    const existingAccount = await GoogleAccount.findOne({
      googleEmail: userData.email,
    });
    // console.log(existingAccount, "existingAccount");

    if (existingAccount) {
      // 🔴 Already connected account
      // return new Response(
      //   `
      //   <html>
      //     <body style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;">
      //       <div style="text-align:center;">
      //         <p style="color:red;">This Google account is already connected!</p>
      //         <p>Please close this window.</p>
      //       </div>
      //       <script>
      //         setTimeout(() => { window.close(); }, 5000);
      //       </script>
      //     </body>
      //   </html>
      //   `,
      //   { headers: { "Content-Type": "text/html" } }
      // );
      const googleAccountData = await GoogleAccount.findOneAndUpdate(
        { googleEmail: userData.email },
        {
          googleAccessToken: accessToken,
          googleRefreshToken: refreshToken,
          googleAccessTokenExpiry: tokenResult.expires_in,
          googleRefreshTokenExpiry: null,
          googleId_token: tokenResult.id_token,
        }
      );
      // console.log(googleAccountData, "googleAccountData");
      const campaignId = stateData?.campaignId;

      return new Response(
        `
      <html>
        <body style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;">
          <div style="text-align:center;">
            <p> Google account connected successfully!</p>
            <p style="color:red;">This Google account is already connected!</p> but we updated the access<p>Please close this window.</p>
          </div>
          <script>
  if (window.opener) {
    window.opener.postMessage(
      { gmail: "${userData.email}", refetch: true },
      
    );
  }
  setTimeout(() => window.close(), 2000);
</script>

        </body>
      </html>
      `,
        { headers: { "Content-Type": "text/html" } }
      );
    }

    // 5️⃣ Create new Google account document
    const googleAccountData = await GoogleAccount.create({
      googleEmail: userData.email,
      googleAccessToken: accessToken,
      googleRefreshToken: refreshToken,
      googleAccessTokenExpiry: Number(tokenResult.expires_in),
      googleRefreshTokenExpiry: null,
      googleId_token: tokenResult.id_token,
    });
    // console.log(googleAccountData, "googleAccountData outside");

    // 7️⃣ Return HTML that redirects the parent (main tab)
    return new Response(
      `
      <html>
        <body style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;">
          <div style="text-align:center;">
            <p>✅ Google account connected successfully!</p>
            <p>Pleaese close this window.</p>
          </div>
          <script>
  if (window.opener) {
    window.opener.postMessage(
      { gmail: "${userData.email}", refetch: true },
      
    );
  }
  setTimeout(() => window.close(), 2000);
</script>

        </body>
      </html>
      `,
      { headers: { "Content-Type": "text/html" } }
    );
  } catch (err) {
    console.error("Google OAuth Error:", err);
    return NextResponse.json({ message: "OAuth Error" }, { status: 500 });
  }
}
