// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { signInSchema } from "@/lib/zod";
// import { toast } from "sonner";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";

// import { getLoggedInUser } from "@/actions/user";
// import { useLoader } from "@/hooks/useLoader";
// import { NewCustomInput } from "../NewCustomInput";
// import CustomButton from "../ui/CustomButton";

// export default function SignInForm() {
//   const router = useRouter();
//   const { startLoading, stopLoading } = useLoader();

//   // Use original schema (no terms)
//   const form = useForm<z.infer<typeof signInSchema>>({
//     resolver: zodResolver(signInSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const onSubmit = async (values: z.infer<typeof signInSchema>) => {
//     startLoading();
//     try {
//       const user = await getLoggedInUser(values);

//       if (user?.success) {
//         toast.success("Login Successful");

//         const campaignId = user?.campaignId;
//         if (campaignId) {
//           router.push(`/dashboard`);
//         } else {
//           router.push(`/add-campaign`);
//         }
//       } else {
//         toast.error(user?.error || "Invalid credentials");
//       }
//     } catch (error) {
//       toast.error("Something went wrong");
//     } finally {
//       stopLoading();
//     }
//   };

//   return (
//     <div className="p-6 bg-white shadow-lg rounded-2xl">
//       <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
//         Sign In
//       </h1>

//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//           <FormField
//             control={form.control}
//             name="email"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Email</FormLabel>
//                 <FormControl>
//                   <NewCustomInput placeholder="Enter your email" {...field} />
//                 </FormControl>
//                 <FormMessage className="error-msg" />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="password"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Password</FormLabel>
//                 <FormControl>
//                   <NewCustomInput
//                     placeholder="Enter your password"
//                     showPasswordToggle={true}
//                     type="password"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage className="error-msg" />
//               </FormItem>
//             )}
//           />
//           <p className="text-[12px] text-gray-600 text-start ">

//             By logging in, you agree to our {" "}
//             <a
//               href={`${process.env.NEXT_PUBLIC_BASE_URL}/term-and-conditions`}
//               target="_blank"
//               className="text-orange-600 underline hover:text-orange-700 transition"
//             >
//              Terms of Service
//             </a>{" "}
//             and{" "}
//             <a
//               href={`${process.env.NEXT_PUBLIC_BASE_URL}/privacy-policy`}
//               target="_blank"
//               className="text-orange-600 underline hover:text-orange-700 transition"
//             >
//               Privacy Policy
//             </a>
//           </p>
//           <div className="flex justify-between items-center text-sm">
//             <Link
//               href="/forgot-password"
//               className="text-[#182E57] hover:underline"
//             >
//               Forgot Password?
//             </Link>
//             <Link href="/sign-up" className="text-[#182E57] hover:underline">
//               Don&apos;t have an account? Sign up
//             </Link>
//           </div>

//           <div className="pt-4 flex justify-center">
//             <CustomButton type="submit" buttonName="Submit" />
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// }

// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { signInSchema } from "@/lib/zod";
// import { toast } from "sonner";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { getLoggedInUser } from "@/actions/user";
// import { useLoader } from "@/hooks/useLoader";

// export default function SignInForm() {
//   const router = useRouter();
//   const { startLoading, stopLoading } = useLoader();

//   const form = useForm<z.infer<typeof signInSchema>>({
//     resolver: zodResolver(signInSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const onSubmit = async (values: z.infer<typeof signInSchema>) => {
//     startLoading();
//     try {
//       const user = await getLoggedInUser(values);
//       if (user?.success) {
//         toast.success("Login Successful");
//         router.push(user?.campaignId ? `/dashboard` : `/add-campaign`);
//       } else {
//         toast.error(user?.error || "Invalid credentials");
//       }
//     } catch {
//       toast.error("Something went wrong");
//     } finally {
//       stopLoading();
//     }
//   };

//   return (
//     <div
//       className="relative min-h-screen w-full flex items-center justify-center overflow-hidden 
//   bg-[url('/images/signIn/loginBG.jpg')] bg-cover bg-center bg-no-repeat"
//     >
//       {/* 🔵 Navy overlay */}
//       {/* <div className="absolute top-0 left-0 w-full h-full bg-[#1E2D45]/90 clip-path-full"></div> */}

//       {/* Main content */}
//       <div className=" flex justify-start pl-10 ml-10 w-full items-start">
//         <div className="relative w-1/2 z-10 flex flex-col items-center ps-10 justify-center text-white  px-6 sm:px-0">
//           {/* Avatar + Lamp */}
//           <div className="flex flex-col items-center space-y-3 mb-6">
//             <div className=" rounded-full flex items-center justify-center shadow-md">
//               <img
//                 src="/images/signIn/avatar with man in green shirt and orange hat.png"
//                 alt="User"
//               />
//             </div>

//             <div className="relative">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="#2E3A54"
//                 viewBox="0 0 24 24"
//                 className="w-10 h-10 absolute -top-10 right-10"
//               >
//                 <path d="M12 2a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v10a3 3 0 1 1-6 0V8H4a1 1 0 1 1 0-2h3V3a1 1 0 0 1 1-1h4z" />
//               </svg>
//             </div>

//             <h2 className="text-2xl font-semibold tracking-wide mt-4">
//               WELCOME
//             </h2>
//           </div>

//           {/* Form */}
//           <div className="w-full max-w-md  p-10 rounded-2xl ">
//             <Form {...form}>
//               <form
//                 onSubmit={form.handleSubmit(onSubmit)}
//                 className="space-y-6"
//               >
//                 <FormField
//                   control={form.control}
//                   name="email"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-white text-md">
//                         Username
//                       </FormLabel>
//                       <FormControl>
//                         <input
//                           className="bg-transparent border-b-2 border-yellow-500 bg-none text-white w-full py-2 focus:outline-none"
//                           placeholder="Enter your email"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage className="text-red-400 text-xs" />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="password"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-white text-md">
//                         Password
//                       </FormLabel>
//                       <FormControl>
//                         <input
//                           type="password"
//                           className="bg-transparent border-b-2 border-gray-300 text-white w-full py-2 focus:outline-none"
//                           placeholder="Enter your password"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage className="text-red-400 text-xs" />
//                     </FormItem>
//                   )}
//                 />
//                 <p className="text-[12px] text-white text-start ">
//                   By logging in, you agree to our {" "}
//                   <a
//                     href={`${process.env.NEXT_PUBLIC_BASE_URL}/term-and-conditions`}
//                     target="_blank"
//                     className="text-orange-600 underline hover:text-orange-700 transition"
//                   >
//                     Terms of Service
//                   </a>{" "}
//                   and{" "}
//                   <a
//                     href={`${process.env.NEXT_PUBLIC_BASE_URL}/privacy-policy`}
//                     target="_blank"
//                     className="text-orange-600 underline hover:text-orange-700 transition"
//                   >
//                     Privacy Policy
//                   </a>
//                 </p>

//                 <div className="flex justify-end text-md mt-1">
//                   <Link
//                     href="/forgot-password"
//                     className="text-white hover:text-yellow-400 transition"
//                   >
//                     Forgot Password?
//                   </Link>
//                 </div>

//                 <div className=" w-full pt-4">
//                   <button
//                     type="submit"
//                     className="w-full bg-[#FDBE00] text-[#1E2D45] px-8 py-2 rounded-full font-semibold hover:bg-yellow-400 transition"
//                   >
//                     Sign In
//                   </button>
//                 </div>
//               </form>
//             </Form>
//           </div>
//         </div>
//       </div>

//       {/* 🟨 Curved yellow accent at bottom */}
//       {/* <div className="absolute bottom-0 w-full h-[200px] bg-[#FDBE00] clip-path-curve"></div> */}

//       {/* ✂️ Custom Tailwind clip-path styles */}
//       {/* <style jsx>{`
//     .clip-path-full {
//       clip-path: path('M0,0 H1000 V300 Q700,500 0,350 Z');
//     }
//     .clip-path-curve {
//       clip-path: path('M0,100 Q300,200 1000,100 L1000,200 L0,200 Z');
//     }
//   `}</style> */}
//     </div>
//   );
// }




"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signInSchema } from "@/lib/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getLoggedInUser } from "@/actions/user";
import { useLoader } from "@/hooks/useLoader";
import { useState } from "react";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";

export default function SignInForm() {
  const router = useRouter();
  const { startLoading, stopLoading } = useLoader();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    startLoading();
    try {
      const user = await getLoggedInUser(values);
      if (user?.success) {
        toast.success("Login Successful");
        router.push(user?.campaignId ? `/dashboard` : `/add-campaign`);
      } else {
        toast.error(user?.error || "Invalid credentials");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      stopLoading();
    }
  };

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden 
  bg-[url('/images/signIn/loginBG.jpg')] bg-cover bg-center bg-no-repeat"
    >
      <div className=" flex justify-start pl-10 ml-10 w-full items-start">
        <div className="relative w-1/2 z-10 flex flex-col items-center ps-10 justify-center text-white  px-6 sm:px-0">
          {/* Avatar + Lamp */}
          <div className="flex flex-col items-center space-y-3 mb-6">
            <div className=" rounded-full flex items-center justify-center shadow-md">
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
              WELCOME
            </h2>
          </div>

          {/* Form */}
          <div className="w-full max-w-md  p-10 rounded-2xl ">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-md">
                        Username
                      </FormLabel>
                      <FormControl>
                        <input
                          className="bg-transparent border-b-2 border-yellow-500 bg-none text-white w-full py-2 focus:outline-none"
                          placeholder="Enter your email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

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

                <p className="text-[12px] text-white text-start ">
                  By logging in, you agree to our{" "}
                  <a
                    href={`${process.env.NEXT_PUBLIC_BASE_URL}/term-and-conditions`}
                    target="_blank"
                    className="text-orange-600 underline hover:text-orange-700 transition"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href={`${process.env.NEXT_PUBLIC_BASE_URL}/privacy-policy`}
                    target="_blank"
                    className="text-orange-600 underline hover:text-orange-700 transition"
                  >
                    Privacy Policy
                  </a>
                </p>

                <div className="flex justify-end text-md mt-1">
                  <Link
                    href="/forgot-password"
                    className="text-white hover:text-yellow-400 transition"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className=" w-full pt-4">
                  <button
                    type="submit"
                    className="w-full bg-[#FDBE00] text-[#1E2D45] px-8 py-2 rounded-full font-semibold hover:bg-yellow-400 transition"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
