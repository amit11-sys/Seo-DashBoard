"use server";

import { redirect } from "next/navigation";
import {
  ActiveUser,
  forgotPasswordAction,
  logout,
  newUserSignUp,
  resetPasswordAction,
  verifyUser,
} from "./queries";

export const createUser = async (formData: {
    email: string;
    password: string;
    terms: boolean;
}, token: string) => {
  const newUser = newUserSignUp(formData, token);
  if (!newUser) return redirect("/sign-in");
  return newUser;
};

export const getLoggedInUser = async (formData: any) => {
  const newUser = verifyUser(formData);
  if (!newUser){
       return redirect("/sign-in");
  }
  return newUser;
};

export const logoutUser = () => {
  const user = logout();
  return user;
};

export const forgotPswd = async (email:string) => {
  const user = await forgotPasswordAction(email);
  if (!user) return;
  return user;
};

export const resetPswd = async (formData:any,token:string,email:string) => {
  const user = await resetPasswordAction(formData,token,email);
  if (!user) return;
  return user;
};

export const  getActiveUser = (userId:string) => {
  const user = ActiveUser( userId);
  return user;
};
