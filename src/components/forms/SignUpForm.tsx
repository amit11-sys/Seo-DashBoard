

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
import { NewCustomInput } from "../NewCustomInput";
import CustomButton from "../ui/CustomButton";
import { motion } from "framer-motion";

const SignupForm = () => {
  const router = useRouter();
  const { startLoading, stopLoading } = useLoader();

  // Extend the signUpSchema to include terms checkbox
  const formSchema = signUpSchema.extend({
    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept the Terms & Conditions",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      terms: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
      initial={{ opacity: 0, y: 30, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 80,
        damping: 15,
        duration: 0.6,
      }}
      className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-md"
    >
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
                <FormMessage className="error-msg" />
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
                <FormMessage className="error-msg" />
              </FormItem>
            )}
          />

          {/* Terms & Conditions Checkbox */}
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex-col items-start space-x-2">
                <div className="flex items-center gap-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      id="terms"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <label htmlFor="terms" className="text-sm text-gray-700">
                    I agree to the{" "}
                    <Link
                      href={`${process.env.NEXT_PUBLIC_BASE_URL}/term-and-conditions`}
                      target="_blank"
                      className="text-blue-600 underline"
                    >
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      href={`${process.env.NEXT_PUBLIC_BASE_URL}/privacy-policy`}
                      target="_blank"
                      className="text-blue-600 underline"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                <div className="w-full flex justify-start items-start">
                  <FormMessage className="error-msg ml-8" />
                </div>
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
