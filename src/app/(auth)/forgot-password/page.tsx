"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      // Store email in session to allow access to reset page
      sessionStorage.setItem("reset_email", email);
      
      // Automatic redirect to reset password page
      router.push("/reset-password");
    } catch (err: any) {
      alert(err.message || "User not found");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Enter email"
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Send OTP</button>
    </form>
  );
}