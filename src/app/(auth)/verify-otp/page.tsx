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
  const flow = searchParams.get("flow") || "login"; // signup or login flow detection

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // determine the correct endpoint based on flow
    const endpoint = flow === "signup" ? "/auth/verify-otp" : "/auth/verify-login-otp";

    try {
      const data = await apiFetch(endpoint, {
        method: "POST",
        body: JSON.stringify({ email, otp }),
      });

      // debug: check what data is coming from backend
      console.log("Verification Response:", data);

      if (data && data.user) {
        // successfully setting the global user state
        setUser(data.user);
        router.push("/dashboard");
      } else {
        // if backend sends user data directly without the 'user' key
        setUser(data);
        router.push("/dashboard");
      }
      
    } catch (err: any) {
      alert(err.message || "Invalid OTP");
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