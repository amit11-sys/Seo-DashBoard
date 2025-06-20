"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { forgotPswdSchema, signUpSchema } from "@/lib/zod";
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
import { createUser, forgotPswd } from "@/actions/user";
import { useLoader } from "@/hooks/useLoader";
import { useRouter } from "next/navigation";
import Link from "next/link";
const ForgotPswdForm = () => {
  const router = useRouter();
  const { startLoading, stopLoading } = useLoader();
  const form = useForm<z.infer<typeof forgotPswdSchema>>({
    resolver: zodResolver(forgotPswdSchema),
    defaultValues: {
      email: "",
      //   password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof forgotPswdSchema>) {
    startLoading(); // ✅ Start loading

    try {
      const user = await forgotPswd(values?.email);

      if (user?.success) {
        router.push("/sign-in");
        toast("Reset Password Email Sent Successfully");
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
     
      <h1 className="text-xl text-center font-semibold">FORGOT PASSWORD</h1>
      <p className="text-sm my-2 text-center italic">
        We will sent a reset link to your email, which redirects to a secure
        reset page. There, you can set a new password. Once submitted, your
        password is updated, and then you can log in with the new credentials.
      </p>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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

        {/* <FormField
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
        /> */}
        {/* <div className="flex justify-end mt-0"> */}

        {/* <Link href="/sign-in" className="text-sm text-right text-blue-600">Already have an account? Please Sign In!</Link> */}
        {/* </div> */}
        <div className="text-right">
        <Link className="text-blue-600 text-sm text-right" href="/sign-in">Return to Login</Link>
        </div>
        <div className="flex flex-col items-center justify-between">
          <Button type="submit" className="text-center">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ForgotPswdForm;
