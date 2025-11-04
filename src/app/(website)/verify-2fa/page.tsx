"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function page() {
  const params = useSearchParams();
  const email = params.get("email");
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [qr, setQr] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) return;
    fetch(`/api/generate-totp?email=${email}`)
      .then(r => r.json())
      .then(data => setQr(data.qrCodeDataURL));
  }, [email]);

  const verifyCode = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if(!data.success) {
        toast.error(data.message);
        return;
      }
      console.log("RAW RESPONSE:", data);

      toast.success(data?.message || "2FA Verified ✅");
      router.push("/dashboard");
    } catch (error) {
      console.error("Verify Error:", error);
      toast.error("Server error ⚠️");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f8f9fa] font-sans">
      
      <div className="bg-white/90 backdrop-blur shadow-xl border border-gray-200 rounded-2xl p-8 w-[380px] text-center animate-fadeIn">

        {/* Google logo style */}
        <div className="flex justify-center mb-3">
          <div className="text-3xl font-bold text-[#4285F4]">G</div>
          <div className="text-3xl font-bold text-[#EA4335]">o</div>
          <div className="text-3xl font-bold text-[#FBBC05]">o</div>
          <div className="text-3xl font-bold text-[#4285F4]">g</div>
          <div className="text-3xl font-bold text-[#34A853]">l</div>
          <div className="text-3xl font-bold text-[#EA4335]">e</div>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-1">Secure Your Account</h2>
        <p className="text-sm text-gray-600 mb-6">Enable 2-Step Verification</p>

        {step === 1 && (
          <>
            <p className="text-gray-600 mb-4 text-sm">
              Scan the QR code using Google Authenticator, Microsoft Authenticator or any TOTP app.
            </p>

            {qr ? (
              <img src={qr} className="w-44 h-44 mx-auto border rounded-lg shadow-sm" />
            ) : (
              <p className="text-gray-500">Loading QR...</p>
            )}

            <button
              onClick={() => setStep(2)}
              className="mt-6 w-full py-2.5 bg-[#1a73e8] hover:bg-[#1667d2] text-white font-medium rounded-lg shadow transition"
            >
              Next →
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-gray-600 mb-4 text-sm">
              Enter the 6-digit code from your Authenticator app.
            </p>

            <input
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="border border-gray-300 w-full p-3 rounded-xl text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-[#4285F4] transition"
              placeholder="••••••"
            />

            <button
              onClick={verifyCode}
              disabled={loading}
              className="mt-6 w-full py-2.5 bg-[#34A853] hover:bg-[#2c8e45] disabled:bg-gray-400 text-white font-medium rounded-lg shadow transition flex justify-center"
            >
              {loading ? (
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
              ) : (
                "Verify ✅"
              )}
            </button>
          </>
        )}
      </div>

      {/* Smooth fade animation */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}


