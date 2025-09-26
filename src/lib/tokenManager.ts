// ---------------------------
// Token Manager Library
// ---------------------------

import Campaign from "./models/campaign.model";

let accessToken:string = "";    // current access token
let refreshToken:string = "";   // refresh token
let refreshing:any = null; 
let tokenExpired: number = 0;
let compaignId:string = "";
    // promise for ongoing refresh
let apiQueue = Promise.resolve(); // queue to serialize API calls
const client_secret = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET;
const client_id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
/**
 * Initialize tokens
 * @param {string} initialAccessToken
 * @param {string} initialRefreshToken
 */
export function initTokens( campaignId: string, initialAccessToken: string, initialRefreshToken : string, initialExpiry : number) {

  accessToken = initialAccessToken;
  refreshToken = initialRefreshToken;
  tokenExpired = initialExpiry;
  compaignId = campaignId;

  console.table({initialAccessToken,initialRefreshToken,initialExpiry,campaignId,table:"tableOKhia"},)
}

/**
 * Check if token is expired
 * @param {string} token
 */
function isExpired(expiry: number | null | undefined): boolean {
  if (!expiry) return true; // no expiry → expired
  const now = Date.now();   // current timestamp (ms)
  return now >= expiry;     // true if expired, false if still valid
}


/**
 * Refresh access token
 */

async function refreshAccessToken() {
  if (!refreshing) {
    const body = new URLSearchParams({
      client_id: client_id ?? "",
      client_secret: client_secret ?? "",
      refresh_token: refreshToken ?? "",
      grant_type: "refresh_token",
    });
    console.log(body,"okbody")
    refreshing = fetch(`${process.env.NEXT_PUBLIC_GOOGLE_AUTH_TOKEN}`, {
      method: 'POST',
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    })
      .then(res => res.json())
      .then(async data => {
          const newExpiry = Date.now() + data.expires_in * 1000;

         await Campaign.findByIdAndUpdate(
         { _id : compaignId},
          {
            googleAccessToken: data?.access_token,
            googleAccessTokenExpiry: newExpiry,
            ...(data?.refresh_token && { googleRefreshToken: refreshToken }),
          },
          { new: true }
        );
        console.log(data, "dataRefresh");
        accessToken = data?.access_token;
        refreshToken = data?.refreshToken || refreshToken;
        refreshing = null;
        return accessToken;
      })
      .catch(err => {
        refreshing = null;
        throw err;
      });
  }
  return refreshing;
}

/**
 * Get a valid token (refresh if needed)
 */
async function getValidToken() {
  if (isExpired(tokenExpired)) {
    return await refreshAccessToken();
  }
  return accessToken;
}

/**
 * Centralized API call (serialized to prevent race conditions)
 * @param {string} endpoint
 * @param {object} options
 */
export async function  callApi(endpoint:any, options = {}) {

  console.log(endpoint, "endpointok");
  console.log(options, "optionsok");
  // enqueue API calls to run sequentially
  apiQueue = apiQueue.then(async () => {
    const token = await getValidToken();
    const headers = {
      // ...options.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(endpoint, { ...options, headers });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const json = await response.json();
    console.log(json, "apiQui");
    return json;
  });
  const json = await apiQueue;
  console.log(json, "apiQueue");
  return json;
}
