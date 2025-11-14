
// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { forgotPswdSchema } from "@/lib/zod";
// import { toast } from "sonner";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";

// import { forgotPswd } from "@/actions/user";
// import { useLoader } from "@/hooks/useLoader";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import CustomButton from "../ui/CustomButton"; // Replace with `Button` if you prefer
// import CustomInput from "../ui/CustomInput";
// import {motion} from "framer-motion";
// const ForgotPswdForm = () => {
//   const router = useRouter();
//   const { startLoading, stopLoading } = useLoader();

//   const form = useForm<z.infer<typeof forgotPswdSchema>>({
//     resolver: zodResolver(forgotPswdSchema),
//     defaultValues: {
//       email: "",
//     },
//   });

//   const onSubmit = async (values: z.infer<typeof forgotPswdSchema>) => {
//     startLoading();

//     try {
//       const user = await forgotPswd(values.email);

//       if (user?.success) {
//         toast.success("Reset password email sent successfully");
//         router.push("/sign-in");
//       } else {
//         toast.error(user?.error || "Reset failed");
//       }
//     } catch (error) {
//       toast.error("Something went wrong");
//     } finally {
//       stopLoading();
//     }
//   };

//   return (
//     <motion.div
//     initial={{ opacity: 0, y: 30, scale: 0.80, }}
//   animate={{ opacity: 1, y: 0, scale: 1,  }}
//   transition={{
//     type: "spring",
//     stiffness: 80,
//     damping: 15,
//     duration: 0.6,
//   }}
//      className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-md">
//       <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
//         Forgot Password
//       </h1>
//       <p className="text-sm text-gray-600 text-center mb-6 italic">
//         We will send a reset link to your email, which redirects to a secure reset page. There, you can set a new password. Once submitted, your password will be updated.
//       </p>

//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
//           <FormField
//             control={form.control}
//             name="email"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Email</FormLabel>
//                 <FormControl>
//                   {/* <Input type="email" placeholder="Enter your email" {...field} /> */}
//                   <CustomInput type="email" listName="Enter your email" {...field}/>
                
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <div className="flex justify-end">
//             <Link href="/sign-in" className="text-sm text-[#335488] hover:underline">
//               Return to Login
//             </Link>
//           </div>

//           <div className="pt-4 flex justify-center items-center">
//             <CustomButton type="submit" buttonName="Submit" />
//             {/* Or use <Button type="submit">Submit</Button> if not using CustomButton */}
//           </div>
//         </form>
//       </Form>
//     </motion.div>
//   );
// };

// export default ForgotPswdForm;





"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { forgotPswdSchema } from "@/lib/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { forgotPswd } from "@/actions/user";
import { useLoader } from "@/hooks/useLoader";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CustomButton from "../ui/CustomButton";
import CustomInput from "../ui/CustomInput";
import { motion } from "framer-motion";

const ForgotPswdForm = () => {
  const router = useRouter();
  const { startLoading, stopLoading } = useLoader();

  const form = useForm<z.infer<typeof forgotPswdSchema>>({
    resolver: zodResolver(forgotPswdSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof forgotPswdSchema>) => {
    startLoading();

    try {
      const user = await forgotPswd(values.email);

      if (user?.success) {
        toast.success("Reset password email sent successfully");
        router.push("/sign-in");
      } else {
        toast.error(user?.error || "Reset failed");
      }
    } catch (error) {
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
      <div className="flex justify-start pl-10 ml-10 w-full items-start">
        {/* Left Avatar Section */}
        <div className="relative w-1/2 z-10 flex flex-col items-center ps-10 justify-center text-white px-6 sm:px-0">
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
              FORGOT PASSWORD
            </h2>
          </div>

          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 15,
              duration: 0.6,
            }}
            className="w-full max-w-md p-10 rounded-2xl"
          >
            <p className="text-sm text-gray-200 text-center mb-6 italic">
              We’ll send a reset link to your email. It redirects to a secure
              page where you can set a new password.
            </p>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-md">Email</FormLabel>
                      <FormControl>
                        <input
                          type="email"
                          placeholder="Enter your email"
                          className="bg-transparent border-b-2 border-yellow-500 text-white w-full py-2 focus:outline-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                {/* Return to Login */}
                <div className="flex justify-end text-sm">
                  <Link
                    href="/sign-in"
                    className="text-white hover:text-yellow-400 transition"
                  >
                    Return to Login
                  </Link>
                </div>

                {/* Submit */}
                <div className="w-full pt-4">
                  <button
                    type="submit"
                    className="w-full bg-[#FDBE00] text-[#1E2D45] px-8 py-2 rounded-full font-semibold hover:bg-yellow-400 transition"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </Form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPswdForm;
