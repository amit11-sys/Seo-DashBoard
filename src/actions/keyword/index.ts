"use server";

import {  saveMultipleKeyword } from "./queries";

// export const addKeyword=async (keyword:{})=>{
//     const addKeyword= await saveKeyword(keyword)
//     return addKeyword
// }

export const addMultipleKeyword = async (formData: {}) => {
  // console.log(keyword,"rttdt");

  const addKeyword = await saveMultipleKeyword(formData);
  return addKeyword;
};
