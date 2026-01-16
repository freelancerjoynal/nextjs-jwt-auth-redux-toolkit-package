"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      // on success, redirect to verify-otp page with signup flow
      router.push(`/verify-otp?email=${email}&flow=signup`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <h1>create account</h1>
      <input 
        type="email" 
        placeholder="email" 
        onChange={(e) => setEmail(e.target.value)} 
        required 
      />
      <input 
        type="password" 
        placeholder="password" 
        onChange={(e) => setPassword(e.target.value)} 
        required 
      />
      <button type="submit">sign up</button>
    </form>
  );
}