import crypto from 'crypto';

export const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};
// ✅ Generate share token with campaignId inside
export const generateShareToken = (campaignId: string) => {
  const randomHash = crypto.randomBytes(32).toString("hex");
  const payload = { campaignId, randomHash };

  // encode cleanly
  const jsonString = JSON.stringify(payload);
  return Buffer.from(jsonString, "utf-8").toString("base64url"); // use base64url (safe for URLs)
};



export const parseShareToken = async (token?: string) => {
  if (!token) {
    throw new Error("Missing token");
  }

  try {
    // decode
    const decoded = Buffer.from(token, "base64url").toString("utf-8");

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
