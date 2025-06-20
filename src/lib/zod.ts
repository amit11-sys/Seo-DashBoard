import { z } from "zod";
const passwordValidation = z.string().regex(
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
  'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character. Special character include @$!%*?&#'
)
export const signUpSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: passwordValidation,
});

export const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string(),
});

export const forgotPswdSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  // password: passwordValidation,
});

export const resetPswdSchema = z
  .object({
    password: passwordValidation,
    confirm_pswd: z.string(),
  })
  .refine((data) => data.password === data.confirm_pswd, {
    path: ['confirm_pswd'], // set error path to the field
    message: 'Passwords do not match',
  });

  export const campaignSchema = z.object({
    name: z.string().min(3, { message: "Campaign Name should not be empty and should of min. 3 characters" }),
    url: z.string().url({ message: "Invalid URL" }),
  });
