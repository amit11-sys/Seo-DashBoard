import { connectToDB } from "@/lib/db";
import bcrypt from "bcryptjs";
import User from "@/lib/models/user.model";
import { cookies } from "next/headers";
import jwt, { SignOptions, Secret } from "jsonwebtoken";
import { generateToken, parseShareToken } from "@/lib/utils/token";
import { generateResetEmail } from "@/lib/template/html_template";
import { mailSender } from "../mail";
// import { getUserCampaign } from "../campaign";
import Campaign from "@/lib/models/campaign.model";
import UserAccess from "@/lib/models/userAccess.model";
import { generateTOTP } from "../google/queries";

export const newUserSignUp = async (formData: {
    email: string;
    password: string;
    terms: boolean;
}, token: string) => {
  try {
    await connectToDB();
    const userData = await User.findOne({ email: formData.email });
    const isTokenValid =userData?.inviteTokenId === token;
    let user = null;


    if(isTokenValid){


    const { email, password } = formData;
      const tokenData = await parseShareToken(token)

      if(tokenData?.email !== email){
        return { error: "Invalid permission for the provided email." };
      }
    // Validate required fields
    if (!email?.trim() || !password?.trim()) {
      return { error: "All fields are required." };
    }

    // Check if the email already exists
    // const existedUser = await User.findOne({ email });
    // if (existedUser) {
    //   return { error: "Email already in use." };
    // }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    // user = await User.create({
    //   email,
    //   password: hashedPassword,
    //   role: 3,
    // });
      user = await User.findOneAndUpdate(
  { email }, 
  {
    $set: {
      password: hashedPassword,
      // parentAdminId: new mongoose.Types.ObjectId(userId),
      // invitedAt: new Date(),
      // inviteTokenId: link?.token,
    },
  },
  { new: true } 
);

        
    await User.updateOne(
      { email }, 
      {
        $set: {
          inviteTokenId: null,
        },
      }
    );

  await generateTOTP(email)


    }else{
          return( {error:"Registration is currently no allow. Please contact support for assistance."})

    }
   
   

    if (!user) {
      return { error: "Something went wrong while registering the user." };
    }

    // Return success response
    return {
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    console.error("Signup Error:", error);
    return { error: "Internal Server Error." };
  }
};

const isPasswordCorrect = async (password: string, user_pass: string) => {
  return await bcrypt.compare(password, user_pass);
};

function generateAccessToken(user: any) {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  const secret: Secret = `${process.env.ACCESS_TOKEN_SECRET}`; // Type explicitly
  const options: SignOptions = { expiresIn: "2h" }; // Type explicitly

  return jwt.sign(payload, secret, options);
}

function generateRefreshToken(user: any) {
  const payload = {
    id: user.id,
    email: user.email,
  };

  const secret =  `${process.env.REFRESH_TOKEN_SECRET}`;
  const options = { expiresIn: 7 };

  return jwt.sign(payload, secret, options);
}

export const generateAccessAndRefreshToken = async (userId: any) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    return { error: "Something went wrong while generating JWT" };
  }
};

export const verifyUser = async (formData: any) => {
  try {
    await connectToDB();
    const { email, password } = formData;

    // Validate email and password
    if (!email?.trim() || !password?.trim()) {
      return { error: "Email and Password are required." };
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    // console.log(user, "user-Data");
    if (!user) {
      return { error: "User does not exist." };
    }
    if(user?.role!=2 && user?.role!=3){
      return { error: "You are not authorized to access this panel." };
    }
    // Validate password
    const isPasswordValid = await isPasswordCorrect(password, user.password);
    if (!isPasswordValid) {
      return { error: "Invalid User Credentials." };
    }
      const CampaignData = await User.findById({ _id: user?.id });
    console.log(CampaignData,"dataCam")
    const UserAccessData = await UserAccess.findOne({ userId: user?.id });
    const UserRole = CampaignData?.role;

let campaign=[];
    if(UserRole==3){

       campaign = await Campaign.find({  _id: { $in: UserAccessData?.campaignId }, });
    }else if(UserRole==2){


       campaign = await Campaign.find({ userId: user?.id });
    }
    // console.log(campaign[0]._id,"campaign id")
    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    // // Set cookies
    // if (accessToken) {
    //   cookies().set("accessToken", accessToken, {
    //     // httpOnly: true,
    //     // secure: true,
    //   });
    // }
    // if (refreshToken) {
    //   cookies().set("refreshToken", refreshToken, {
    //     // httpOnly: true,
    //     // secure: true,
    //   });
    // }
    const campaignId = campaign[0]?._id;
    // Return success response
    return {
      success: true,
      message: "Login Successful",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
      campaignId,
    };
  } catch (error) {
    console.error("Login Error:", error);
    return { error: "Internal Server Error." };
  }
};

export async function forgotPasswordAction(email: string) {
  try {
    await connectToDB();
    const user = await User.findOne({ email });

    if (!user) return { error: "No user found with that email." };

    const token = await generateToken();
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
console.log(token,"tokenfor forget")
  const forgetUpdateddata =   await User.updateOne(
      { email }, // Filter to find the user
      {
        $set: {
          resetToken: token,
          resetTokenExpires: expires,
        },
      }
    );
    console.log(forgetUpdateddata,"forgetupdateddata")

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}&email=${email}`;

    await mailSender(
      email,
      "Reset Your Password",
      generateResetEmail(resetLink) // your HTML template
    );
    // console.log(send_mail);

    return { success: "true", message: "Reset email sent successfully." };
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return { error: "Internal Server Error." };
  }
}

export async function resetPasswordAction(formData: any,token:string,email:string) {
  try {
    await connectToDB();
    const {  password } = formData;
      console.log(token,password,"checkredetyttt")
    if (!token || !password) {
      return { error: "Missing token or password" };
    }
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gte: Date.now() },
    });

    if (!user) return { error: "Invaid or expired token" };
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate(
      { resetToken: token },
      {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      }
    );

    return { success: "true", message: "Password resetted successfully." };
  } catch (error) {
    console.error("Reset Password Error:", error);
    return { error: "Internal Server Error." };
  }
}

export const logout = async () => {
  try {
    cookies().set("accessToken", "", { maxAge: -1, path: "/" });
    cookies().set("refreshToken", "", { maxAge: -1, path: "/" });

    return { success: true, message: "Logged out successfully" };
  } catch (error) {
    console.error("Logout Error:", error);
    return { error: "Failed to logout" };
  }
};


export const  ActiveUser = async (userId:string) =>{
  try {
    await connectToDB();

    const user = await User.findById({ _id: userId  });

    if(!user){
      return { success: false, error: "User not found" };
    } else {
      return { success: true, message: "User Data Fetched", user };
    }
  } catch (error) {
    console.error("Error activating user:", error);
    return { error: "Failed to activate user" };
  }
} 