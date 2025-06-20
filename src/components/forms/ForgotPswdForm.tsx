
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
import { Input } from "@/components/ui/input";
import { forgotPswd } from "@/actions/user";
import { useLoader } from "@/hooks/useLoader";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CustomButton from "../ui/CustomButton"; // Replace with `Button` if you prefer
import CustomInput from "../ui/CustomInput";

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
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-md">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
        Forgot Password
      </h1>
      <p className="text-sm text-gray-600 text-center mb-6 italic">
        We will send a reset link to your email, which redirects to a secure reset page. There, you can set a new password. Once submitted, your password will be updated.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  {/* <Input type="email" placeholder="Enter your email" {...field} /> */}
                  <CustomInput type="email" listName="Enter your email" {...field}/>
                
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Link href="/sign-in" className="text-sm text-[#335488] hover:underline">
              Return to Login
            </Link>
          </div>

          <div className="pt-4 flex justify-center items-center">
            <CustomButton type="submit" buttonName="Submit" />
            {/* Or use <Button type="submit">Submit</Button> if not using CustomButton */}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPswdForm;
