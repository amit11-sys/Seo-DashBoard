"use server";

import { getUserFromToken } from "@/app/utils/auth";
import { connectToDB } from "@/lib/db";
import ShareLink from "@/lib/models/ShareLink.model";
import User from "@/lib/models/user.model";
import UserAccess from "@/lib/models/userAccess.model";
import { generateSignupEmail } from "@/lib/template/html_SignupEmail";
import { generateShareToken, generateSingleShareToken } from "@/lib/utils/token";
import mongoose from "mongoose";
import { mailSender } from "../mail";
import SingleShareLink from "@/lib/models/singleShareToken.model";

export async function GenerateShareLink(
  path: string,
  campaignId: string[],
  email: string
) {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    if (!user?.id) return { error: "Unauthorized please login" };

    const userId = user?.id?.toString();
    const token = generateShareToken(email); // ✅ now guaranteed to be valid
    const existingEmailUser = await User.findOne({ email });
    // console.log(existingEmailUser, "yessss");

    if (existingEmailUser) {
      return { error: "User with this email already exists" };
    }

    // Save to DB
    const link = await ShareLink.create({
      token,
      userId: new mongoose.Types.ObjectId(userId),
      campaignId,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // const hashedPassword = await bcrypt.hash("Swayam@11", 10);

    const newInvitedUser = await User.create({
      email,
      password: "",
      parentAdminId: new mongoose.Types.ObjectId(userId),
      invitedAt: new Date(),
      inviteTokenId: link?.token,
    });

    await UserAccess.create({
      campaignId,
      userId: newInvitedUser._id,
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const normalizedPath = `/sign-up?invite=${email}&token=${token}&msg=true`; // Fixed path for invite
    // const normalizedPath = path.endsWith("/") ? path : `${path}/`;
    const url = `${baseUrl}${normalizedPath}`;
    const emailSent = await mailSender(
      email,
      "You're Invited to Join!",
      generateSignupEmail(url)
    );
    console.log(emailSent, "emailTesting");
    return { url: `${baseUrl}${normalizedPath}` };
  } catch (error) {
    console.error("Error generating share link:", error);
    return { error: "Failed to generate share link" };
  }
}
export async function GenerateSingleShareLink(
  // userId: string,
  path: string,
  campaignId: string
) {
  try {
    await connectToDB();

    // Check authentication
    const user = await getUserFromToken();
    if (!user) {
      return { error: "Unauthorized please login" };
    }

    // Generate unique token
   
    const token = generateSingleShareToken(campaignId);
    const userId = user?.id


    // Save to DB
    await SingleShareLink.create({
      token,
      userId,
      campaignId,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    // Build shareable URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const normalizedPath = path.endsWith("/") ? path : `${path}/`; // ensure slash
    const shareUrl = `${baseUrl}${normalizedPath}${token}`;

    return shareUrl;
  } catch (error) {
    console.error("Error generating share link:", error);
    return { error: "Failed to generate share link" };
  }
}


export async function validateShareToken(token: string) {
  try {
    if (!token) return { valid: false, reason: "Missing token" };

    await connectToDB();

    const share = await ShareLink.findOne({ token });

    if (!share) {
      return { valid: false, reason: "Invalid token" };
    }

    // ✅ if you store expiry date in DB, check it
    if (share.expiresAt && share.expiresAt < new Date()) {
      return { valid: false, reason: "Token expired" };
    }

    return { valid: true, share };
  } catch (error) {
    console.error("Error validating share token:", error);
    return { valid: false, reason: "Server error" };
  }
}

export async function SingleValidateShareToken(token: string) {
  try {
    if (!token) return { valid: false, reason: "Missing token" };

    await connectToDB();

    const share = await SingleShareLink.findOne({ token });

    if (!share) {
      return { valid: false, reason: "Invalid token" };
    }

    // ✅ if you store expiry date in DB, check it
    if (share.expiresAt && share.expiresAt < new Date()) {
      return { valid: false, reason: "Token expired" };
    }

    return { valid: true, share };
  } catch (error) {
    console.error("Error validating share token:", error);
    return { valid: false, reason: "Server error" };
  }
}

// export async function GenerateShareLink(
//   // userId: string,
//   path: string,
//   campaignId: string[],
//   email: string
// ) {
//   try {
//     await connectToDB();

//     // Check authentication
//     const user =  getUserFromToken();
//     if (!user) {
//       return { error: "Unauthorized please login" };
//     }

//     // Generate unique token
//   const userId = user?.id?.toString();
// if (!userId) return { error: "Invalid user ID" };

// const token = generateShareToken(userId);
// if (!token) return { error: "Failed to generate token" };

//     console.log(token,userId,"testinToken")

//     // Save to DB
//     const link: any = await ShareLink.create(
//       {
//         token,
//         userId,
//         campaignId,
//         createdAt: new Date(),
//         expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
//       },
//       { new: true }
//     );
//     console.log(link,"testting")

//     const userAccess = await UserAccess.create({ campaignId, userId });
//    const userInvite = await User.create({
//     email: email,
//     password: "Swayam@11",
//       parentAdminId: userId,
//       invitedAt: new Date(),
//       inviteTokenId: link._id,
//     });

//     // Build shareable URL
//     const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
//     const normalizedPath = path.endsWith("/") ? path : `${path}/`; // ensure slash
//     const shareUrl = `${baseUrl}${normalizedPath}${token}`;

//     return shareUrl;
//   } catch (error) {
//     console.error("Error generating share link:", error);
//     return { error: "Failed to generate share link" };
//   }
// }

export async function UserAccessData() {
  try {
    // ✅ 1️⃣ Connect to database
    await connectToDB();

    // ✅ 2️⃣ Validate user authentication
    const user = await getUserFromToken();

    console.log(user,"okokoko")
    if (!user?.id) {
      return { error: "Unauthorized. Please login." };
    }

    const allUsersWithAccess = await UserAccess.find()
      .populate("userId") // populate only necessary fields
      .lean();

      const activeUser =await  User.findById({_id: user?.id});

    return {
      success: true,
      message: "Fetched all user access data successfully.",

      activeUser,
      allUsersWithAccess,
    };
  } catch (error) {
    console.error("❌ Error in UserAccessData:", error);
    return { error: "Failed to fetch user access data." };
  }
}
export async function SaveAssignedCampaigns(
  accessId: string,
  campaignIds: string[]
) {
  try {
    // ✅ 1️⃣ Connect to database
    await connectToDB();

    // ✅ 2️⃣ Validate user authentication
    const user = await getUserFromToken();
    if (!user?.id) {
      return { error: "Unauthorized. Please login." };
    }

    const updatedAssignedCampigns = await UserAccess.findByIdAndUpdate(
      { _id: accessId },
      { campaignId: campaignIds },
      { new: true }
    );

    return {
      success: true,
      message: "Fetched all user access data successfully.",
      user,
      updatedAssignedCampigns,
    };
  } catch (error) {
    console.error("❌ Error in UserAccessData:", error);
    return { error: "Failed to fetch user access data." };
  }
}
export async function deleteUserAccess(id: string) {
  try {
    // ✅ 1️⃣ Connect to database
    await connectToDB();

    const user = await getUserFromToken();
    if (!user?.id) {
      return { error: "Unauthorized. Please login." };
    }

    const deletedClient = await UserAccess.findByIdAndDelete({
      _id: id,
    },
    { new: true }
  );
  const userID = deletedClient?.userId;

  const delteUser = await User.findByIdAndDelete({
    _id: userID,
  },
  { new: true }
);

    return {
      success: true,
      message: "Fetched all user access data successfully.",
      user,
      deletedClient,
      delteUser,
    };
  } catch (error) {
    console.error("❌ Error in UserAccessData:", error);
    return { error: "Failed to fetch user access data." };
  }
}
