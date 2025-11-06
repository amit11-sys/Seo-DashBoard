import { Suspense } from "react";
import ResetPswdForm from "@/components/forms/ResetPswdForm";

export const dynamic = "force-dynamic";

export default function ResetPassword() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#273F4F] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-600 font-medium">Loading...</p>
          </div>
        </div>
      }
    >
      <ResetPswdForm />
    </Suspense>
  );
}
