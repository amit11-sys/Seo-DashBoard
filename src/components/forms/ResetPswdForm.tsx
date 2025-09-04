
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { resetPswdSchema } from "@/lib/zod";
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
import { resetPswd } from "@/actions/user";
import { useLoader } from "@/hooks/useLoader";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CustomButton from "../ui/CustomButton"; // Optional, replace with Button if not using
import {motion} from "framer-motion";
const ResetPswdForm = () => {
  const router = useRouter();
  const { startLoading, stopLoading } = useLoader();

  const form = useForm<z.infer<typeof resetPswdSchema>>({
    resolver: zodResolver(resetPswdSchema),
    defaultValues: {
      password: "",
      confirm_pswd: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof resetPswdSchema>) => {
    startLoading();
    try {
      const user = await resetPswd(values);

      if (user?.success) {
        toast.success("Password changed successfully");
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
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
        Reset Password
      </h1>
      <p className="text-sm text-gray-600 text-center mb-6 italic">
        You will receive a secure link via email to reset your password. Once completed, use your new password to log in.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter new password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirm_pswd"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Confirm new password" {...field} />
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

          <div className="pt-4">
            <CustomButton type="submit" buttonName="Submit" />
            {/* Or use: <Button type="submit">Submit</Button> */}
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

export default ResetPswdForm;
