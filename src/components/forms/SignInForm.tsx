"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signInSchema, signUpSchema } from "@/lib/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createUser, getLoggedInUser } from "@/actions/user";
import { useLoader } from "@/hooks/useLoader";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    startLoading(); // ✅ Start loading

    try {
      const user = await getLoggedInUser(values);

      if (user?.success) {
        router.push("/");
        toast("Login Successfully");
      } else {
        toast(user?.error);
      }
    } catch (error) {
      toast("Something went wrong");
    } finally {
      stopLoading();
    }
  }


  return (
    <Form {...form}>
      <h1 className="text-xl text-center font-semibold">SIGN IN</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
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
                <Input placeholder="Enter your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Link href="/forgot-password" className="text-sm text-right text-blue-600">Forgot Password</Link>
        <div className="flex flex-col items-center justify-between">
          <Button type="submit" className="text-center">Submit</Button>
        </div>
      </form>
    </Form>
  );
}
