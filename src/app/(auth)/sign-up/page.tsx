export const dynamic = "force-dynamic";

import SignupForm from "@/components/forms/SignUpForm";
import React, { Suspense } from "react";

const SignUp = () => {
  return (
    <div>
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

      <SignupForm />
      </Suspense>
    </div>
  );
};

export default SignUp;
