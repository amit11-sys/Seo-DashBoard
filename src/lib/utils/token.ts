import crypto from 'crypto';
import bcrypt from "bcryptjs";
import Campaign from '../models/campaign.model';

export const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};
// ✅ Generate share token with campaignId inside
// export const generateShareToken =  (userId: string) => {
//   const randomHash = crypto.randomBytes(32).toString("hex");
//   const payload = { userId, randomHash };

//   // encode cleanly
//   const jsonString = JSON.stringify(payload);
//   return Buffer.from(jsonString, "utf-8").toString("base64url"); // use base64url (safe for URLs)
// };



export const generateShareToken = (email: string) => {
  if (!email) throw new Error("User ID is required for token generation");
  
  const randomHash = crypto.randomBytes(32).toString("hex");
  const payload = { email, randomHash }; // ✅ include userId

  // encode as URL-safe Base64
  return Buffer.from(JSON.stringify(payload), "utf-8").toString("base64url");
};
export const generateSingleShareToken = (campaignId: string) => {
  if (!campaignId) throw new Error("Campaign ID is required for token generation");
  
  const randomHash = crypto.randomBytes(32).toString("hex");
  const payload = { campaignId  , randomHash }; // ✅ include userId

  // encode as URL-safe Base64
  return Buffer.from(JSON.stringify(payload), "utf-8").toString("base64url");
};

/**
 * Generate a secure, URL-safe share token
 */
// export const generateShareToken = async (email: string) => {
//   if (!email) throw new Error("Email is required for token generation");

//   // random unique string
//   const randomHash = crypto.randomBytes(32).toString("hex");
//   const payload = { email, randomHash };

//   // encode payload for sending via URL
//   const encoded = Buffer.from(JSON.stringify(payload), "utf-8").toString("base64url");

//   // hash full payload for secure DB storage
//   const hashedToken = await bcrypt.hash(encoded, 10);

//   return {
//     token: encoded,        // ✅ token you send in the URL
//     hashedToken,           // ✅ token you store in DB
//     email,
//     randomHash,
//   };
// };



export const parseShareToken = async (token?: string) => {
  if (!token) {
    throw new Error("Missing token");
  }

  try {
    // decode
    const decoded = Buffer.from(token, "base64url").toString("utf-8");

    // parse
    const { email, randomHash } = JSON.parse(decoded);

    if (!email || !randomHash) {
      throw new Error("Invalid token structure");
    }

    return { email, randomHash };
  } catch (err) {
    console.error("Failed to parse token:", err, "input:", token);
    throw new Error("Invalid token");
  }
};


export const parseSingleShareToken = async (token?: string) => {
  if (!token) {
    throw new Error("Missing token");
  }

  try {
    // decode
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    console.log(decoded,"decode")
    // parse
    const { campaignId, randomHash } = JSON.parse(decoded);

    if (!campaignId || !randomHash) {
      throw new Error("Invalid token structure");
    }

    return { campaignId, randomHash };
  } catch (err) {
    console.error("Failed to parse token:", err, "input:", token);
    throw new Error("Invalid token");
  }
};

// export const parseShareToken = async (token?: string, hashedTokenFromDB?: string) => {
//   if (!token) throw new Error("Missing token");

//   try {
//     // decode base64 payload
//     const decoded = Buffer.from(token, "base64url").toString("utf-8");
//     const { email, randomHash } = JSON.parse(decoded);

//     if (!email || !randomHash) throw new Error("Invalid token structure");

//     // verify if the provided token matches hashed DB version
//     let isValid = false;
//     if (hashedTokenFromDB) {
//       isValid = await bcrypt.compare(token, hashedTokenFromDB);
//     }

//     return { valid: isValid, email, randomHash };
//   } catch (err) {
//     console.error("Failed to parse or verify token:", err);
//     throw new Error("Invalid token");
//   }
// };
