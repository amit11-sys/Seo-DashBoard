// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { signUpSchema } from "@/lib/zod";
// import { toast } from "sonner";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";

// import { useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";
// import { createUser } from "@/actions/user";
// import { useLoader } from "@/hooks/useLoader";
// import { NewCustomInput } from "../NewCustomInput";
// import CustomButton from "../ui/CustomButton";
// import { motion } from "framer-motion";
// import { useEffect, useState } from "react";

// const SignupForm = () => {
//   const searchParams = useSearchParams();
//   const email = searchParams.get("invite");
//   const token = searchParams.get("token");
//   const msg = searchParams.get("msg");
//   const router = useRouter();
//   const { startLoading, stopLoading } = useLoader();

//   // Extend the signUpSchema to include terms checkbox
//   const formSchema = signUpSchema.extend({
//     terms: z.boolean().refine((val) => val === true, {
//       message: "You must accept the Terms & Conditions",
//     }),
//   });
//   const [openDialog, setOpenDialog] = useState(false);

//   useEffect(() => {
//     if (msg === "true") {
//       setOpenDialog(true);
//     }
//   }, [msg]);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       email: email || "",
//       password: "",
//       terms: false,
//     },
//   });

//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     startLoading();
//     try {
//       const user = await createUser(values, token || "");

//       if (user?.success) {
//         toast.success("Account created successfully");
//         router.push("/sign-in");
//       } else {
//         toast.error(user?.error || "Registration failed");
//       }
//     } catch (error) {
//       toast.error("Something went wrong");
//     } finally {
//       stopLoading();
//     }
//   };

//   return (
//     <>
//       <Dialog open={openDialog} onOpenChange={setOpenDialog}>
//         <DialogContent className="bg-white sm:max-w-[400px]">
//           <DialogHeader>
//             <DialogTitle>Sign Up Required</DialogTitle>
//             <DialogDescription>
//               Please sign up and create your password to continue.
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button onClick={() => setOpenDialog(false)}>Got it</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <motion.div
//         initial={{ opacity: 0, y: 30, scale: 0.8 }}
//         animate={{ opacity: 1, y: 0, scale: 1 }}
//         transition={{
//           type: "spring",
//           stiffness: 80,
//           damping: 15,
//           duration: 0.6,
//         }}
//         className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-md"
//       >
//         <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
//           Sign Up
//         </h1>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Email</FormLabel>
//                   <FormControl>
//                     <NewCustomInput placeholder="Enter your email" {...field} />
//                   </FormControl>
//                   <FormMessage className="error-msg" />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="password"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Password</FormLabel>
//                   <FormControl>
//                     <NewCustomInput
//                       placeholder="Enter your password"
//                       type="password"
//                       showPasswordToggle={true}
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage className="error-msg" />
//                 </FormItem>
//               )}
//             />

//             {/* Terms & Conditions Checkbox */}
//             <FormField
//               control={form.control}
//               name="terms"
//               render={({ field }) => (
//                 <FormItem className="flex-col items-start space-x-2">
//                   <div className="flex items-center gap-2">
//                     <FormControl>
//                       <input
//                         type="checkbox"
//                         id="terms"
//                         className="w-4 h-4 text-blue-600 border-gray-300 rounded"
//                         checked={field.value}
//                         onChange={(e) => field.onChange(e.target.checked)}
//                         onBlur={field.onBlur}
//                         name={field.name}
//                         ref={field.ref}
//                       />
//                     </FormControl>
//                     <label htmlFor="terms" className="text-sm text-gray-700">
//                       I agree to the{" "}
//                       <Link
//                         href={`${process.env.NEXT_PUBLIC_BASE_URL}/term-and-conditions`}
//                         target="_blank"
//                         className="text-blue-600 underline"
//                       >
//                         Terms & Conditions
//                       </Link>{" "}
//                       and{" "}
//                       <Link
//                         href={`${process.env.NEXT_PUBLIC_BASE_URL}/privacy-policy`}
//                         target="_blank"
//                         className="text-blue-600 underline"
//                       >
//                         Privacy Policy
//                       </Link>
//                     </label>
//                   </div>
//                   <div className="w-full flex justify-start items-start">
//                     <FormMessage className="error-msg ml-8" />
//                   </div>
//                 </FormItem>
//               )}
//             />

//             <div className="flex justify-end text-sm">
//               <Link href="/sign-in" className="text-[#182E57] hover:underline">
//                 Already have an account? Sign In
//               </Link>
//             </div>

//             <div className="pt-4 flex justify-center">
//               <CustomButton type="submit" buttonName="Submit" />
//             </div>
//           </form>
//         </Form>
//       </motion.div>
//     </>
//   );
// };

// export default SignupForm;





"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUpSchema } from "@/lib/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createUser } from "@/actions/user";
import { useLoader } from "@/hooks/useLoader";
import { useEffect, useState } from "react";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";

const SignupForm = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("invite");
  const token = searchParams.get("token");
  const msg = searchParams.get("msg");
  const router = useRouter();
  const { startLoading, stopLoading } = useLoader();
  const [showPassword, setShowPassword] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const formSchema = signUpSchema.extend({
    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept the Terms & Conditions",
    }),
  });

  useEffect(() => {
    if (msg === "true") {
      setOpenDialog(true);
    }
  }, [msg]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email || "",
      password: "",
      terms: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    startLoading();
    try {
      const user = await createUser(values, token || "");
      if (user?.success) {
        toast.success("Account created successfully");
        router.push("/sign-in");
      } else {
        toast.error(user?.error || "Registration failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      stopLoading();
    }
  };

  return (
    <>
      {/* Signup Notice Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-white sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Sign Up Required</DialogTitle>
            <DialogDescription>
              Please sign up and create your password to continue.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setOpenDialog(false)}>Got it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Background Section */}
      <div
        className="relative min-h-screen w-full flex items-center justify-center overflow-hidden 
      bg-[url('/images/signIn/loginBG.jpg')] bg-cover bg-center bg-no-repeat"
      >
        <div className="flex justify-start pl-10 ml-10 w-full items-start">
          <div className="relative w-1/2 z-10 flex flex-col items-center ps-10 justify-center text-white px-6 sm:px-0">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-3 mb-6">
              <div className="rounded-full flex items-center justify-center shadow-md">
                <img
                  src="/images/signIn/avatar with man in green shirt and orange hat.png"
                  alt="User"
                />
              </div>

              <div className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#2E3A54"
                  viewBox="0 0 24 24"
                  className="w-10 h-10 absolute -top-10 right-10"
                >
                  <path d="M12 2a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v10a3 3 0 1 1-6 0V8H4a1 1 0 1 1 0-2h3V3a1 1 0 0 1 1-1h4z" />
                </svg>
              </div>

              <h2 className="text-2xl font-semibold tracking-wide mt-4">
                CREATE ACCOUNT
              </h2>
            </div>

            {/* Form Section */}
            <div className="w-full max-w-md p-10 rounded-2xl">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-md">
                          Email
                        </FormLabel>
                        <FormControl>
                          <input
                            className="bg-transparent border-b-2 border-yellow-500 text-white w-full py-2 focus:outline-none"
                            placeholder="Enter your email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Password */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-md">
                          Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              className="bg-transparent border-b-2 border-gray-300 text-white w-full py-2 focus:outline-none pr-10"
                              placeholder="Enter your password"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-2 top-2 text-gray-300 hover:text-yellow-400"
                            >
                              {showPassword ? (
                                <RiEyeOffLine size={20} />
                              ) : (
                                <RiEyeLine size={20} />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Terms */}
                  <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem className="flex flex-col space-y-1">
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <input
                              type="checkbox"
                              id="terms"
                              className="w-4 h-4 text-yellow-500 border-gray-300 rounded"
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                            />
                          </FormControl>
                          <label
                            htmlFor="terms"
                            className="text-sm text-white"
                          >
                            I agree to the{" "}
                            <Link
                              href={`${process.env.NEXT_PUBLIC_BASE_URL}/term-and-conditions`}
                              target="_blank"
                              className="text-orange-500 underline"
                            >
                              Terms & Conditions
                            </Link>{" "}
                            and{" "}
                            <Link
                              href={`${process.env.NEXT_PUBLIC_BASE_URL}/privacy-policy`}
                              target="_blank"
                              className="text-orange-500 underline"
                            >
                              Privacy Policy
                            </Link>
                          </label>
                        </div>
                        <FormMessage className="text-red-400 text-xs ml-6" />
                      </FormItem>
                    )}
                  />

                  {/* Sign In Link */}
                  <div className="flex justify-end text-sm">
                    <Link
                      href="/sign-in"
                      className="text-white hover:text-yellow-400 transition"
                    >
                      Already have an account? Sign In
                    </Link>
                  </div>

                  {/* Submit */}
                  <div className="w-full pt-4">
                    <button
                      type="submit"
                      className="w-full bg-[#FDBE00] text-[#1E2D45] px-8 py-2 rounded-full font-semibold hover:bg-yellow-400 transition"
                    >
                      Sign Up
                    </button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupForm;

