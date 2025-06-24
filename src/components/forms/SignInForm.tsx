
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
import { NewCustomInput } from "../NewCustomInput";
import CustomButton from "../ui/CustomButton";

export default function SignInForm() {
  const router = useRouter();
  const { startLoading, stopLoading } = useLoader();

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
        router.push("/dashboard");
      } else {
        toast.error(user?.error || "Invalid credentials");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Sign In
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
                <FormMessage />
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
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between items-center text-sm">
            <Link
              href="/forgot-password"
              className="text-[#182E57] hover:underline"
            >
              Forgot Password?
            </Link>
            <Link
              href="/sign-up"
              className="text-[#182E57] hover:underline"
            >
              Don't have an account? Sign up
            </Link>
          </div>

          <div className="pt-4 flex justify-center">
            <CustomButton type="submit" buttonName="Submit" />
          </div>
        </form>
      </Form>
    </div>
  );
}
