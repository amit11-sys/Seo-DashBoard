"use server";

import { redirect } from "next/navigation";
import {
  forgotPasswordAction,
  logout,
  newUserSignUp,
  resetPasswordAction,
  verifyUser,
} from "./queries";

export const createUser = async (formData: any) => {
  const newUser = newUserSignUp(formData);
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

export const resetPswd = async (formData:any) => {
  const user = await resetPasswordAction(formData);
  if (!user) return;
  return user;
};

