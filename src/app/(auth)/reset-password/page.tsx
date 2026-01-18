"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function ResetPasswordPage() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user came from forgot-password page
    const storedEmail = sessionStorage.getItem("reset_email");
    if (!storedEmail) {
      router.replace("/forgot-password");
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await apiFetch("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email, otp }),
      });

      alert(data.message);
      
      // Clear the session after successful reset
      sessionStorage.removeItem("reset_email");
      
      router.push("/login");
    } catch (err: any) {
      alert(err.message || "Invalid OTP");
    }
  };

  // If email is not yet loaded from session, show nothing or a loader
  if (!email) return null;

  return (
    <form onSubmit={handleReset}>
      <p>Resetting password for: {email}</p>
      <input
        type="text"
        placeholder="Enter OTP"
        maxLength={6}
        onChange={(e) => setOtp(e.target.value)}
        required
      />
      <button type="submit">Verify & Get New Password</button>
    </form>
  );
}