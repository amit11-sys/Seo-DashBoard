import {
  // getAuthToken,
  googleAnalyticsAccountID,
  googleAnalyticsPropertyID,
  GoogleConsoleDataByDate,
  GoogleSearchDataByDimension,
  refreshGoogleAccessToken,
} from "./queries";

export const googleAuthHandler = async (code: any) => {
  // console.log("running callback fn");

  //   const code = req.query;
  if (!code) {
    // throw new ApiError(400, 'No Code');
    console.log("error in code recieved ");
  }
  // console.log(code, "here is the code");

  //   const { id_token, access_token } = await getAuthToken({ code });
  // const data = await getAuthToken({ code });
  // console.log(data, "getauthdata");
  // const googleUser = jwt.decode(id_token);
  // console.log(googleUser);
  // const googleUser = await getGoogleUser(access_token, id_token);
  // console.log(googleUser);

  // const analyticData = await getGoogleAnalyticsData(access_token, id_token);
  // console.log(analyticData);


  // Redirect the user to the frontend URL with the tokens
  //   res.redirect(frontendUrl);
};
export const getGoogleConsoleDataByDate = async (newCompaignId: any,date:any) => {
  const data = await GoogleConsoleDataByDate(newCompaignId,date);

  return data;
};
          
export const getGoogleSearchDataByDimension = async (newCompaignId: any,dimension:any,date:any) => {
  const data = await GoogleSearchDataByDimension(newCompaignId,dimension,date);

  return data;
};
          
export const getRefreshGoogleAccessToken = async (newCompaignId: string) => {
  const data = await refreshGoogleAccessToken(newCompaignId);

  return data;
};
export const getGoogleAnalyticsAccountID = async (access_token: string,nameMatch : string) => {
  const data = await googleAnalyticsAccountID(access_token,nameMatch);

  return data;
};
export const getGoogleAnalyticsPropertyID = async (access_token: string , accountId: string,nameMatch : string) => {
  const data = await googleAnalyticsPropertyID(access_token, accountId,nameMatch);

  return data;
};