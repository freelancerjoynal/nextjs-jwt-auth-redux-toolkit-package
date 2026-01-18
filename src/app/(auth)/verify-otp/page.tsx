"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

function OTPForm() {
  const [otp, setOtp] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUser } = useAuth();

  const email = searchParams.get("email");
  const flow = searchParams.get("flow") || "login"; 

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Change: Match your backend routes exactly
    // Signup flow uses /auth/verify, Login flow uses /auth/verify-login-otp
    const endpoint = flow === "signup" ? "/auth/verify" : "/auth/verify-login-otp";

    try {
      const data = await apiFetch(endpoint, {
        method: "POST",
        body: JSON.stringify({ email, otp }),
      });

      console.log("Verification Response:", data);

      if (data && data.user) {
        setUser(data.user);
      } else {
        setUser(data);
      }
      
      router.push("/dashboard");
    } catch (err: any) {
      // If apiFetch throws an error, it might be due to the 500 error from the server
      alert(err.message || "An error occurred during verification");
    }
  };

  return (
    <form onSubmit={handleVerify}>
      <h1>Verify OTP for {email}</h1>
      <input 
        type="text" 
        placeholder="Enter 6-digit OTP" 
        maxLength={6}
        onChange={(e) => setOtp(e.target.value)} 
        required
      />
      <button type="submit">Verify & Continue</button>
    </form>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OTPForm />
    </Suspense>
  );
}