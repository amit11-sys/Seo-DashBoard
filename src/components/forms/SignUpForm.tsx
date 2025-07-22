
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
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUser } from "@/actions/user";
import { useLoader } from "@/hooks/useLoader";
import { NewCustomInput } from "../NewCustomInput"; // Optional, if using custom input
import CustomButton from "../ui/CustomButton"; // Optional, use `Button` if not
import { motion } from "framer-motion";
const SignupForm = () => {
  const router = useRouter();
  const { startLoading, stopLoading } = useLoader();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    startLoading();
    try {
      const user = await createUser(values);

      if (user?.success) {
        toast.success("Account created successfully");
        router.push("/sign-in");
      } else {
        toast.error(user?.error || "Registration failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      stopLoading();
    }
  };

  return (
    <motion.div 
     initial={{ opacity: 0, y: 30, scale: 0.80, }}
  animate={{ opacity: 1, y: 0, scale: 1,  }}
  transition={{
    type: "spring",
    stiffness: 80,
    damping: 15,
    duration: 0.6,
  }}
    className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-md">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Sign Up
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <NewCustomInput placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage  className="error-msg" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <NewCustomInput
                    placeholder="Enter your password"
                    type="password"
                     showPasswordToggle={true}
                    {...field}
                  />
                </FormControl>
                <FormMessage  className="error-msg" />
              </FormItem>
            )}
          />

          <div className="flex justify-end text-sm">
            <Link
              href="/sign-in"
              className="text-[#182E57] hover:underline"
            >
              Already have an account? Sign In
            </Link>
          </div>

          <div className="pt-4 flex justify-center">
            <CustomButton type="submit" buttonName="Submit" />
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

export default SignupForm;

