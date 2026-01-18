"use client";

import { useState, Suspense, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lock, ArrowRight, Mail, ShieldCheck } from "lucide-react";

function OTPForm() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUser } = useAuth();

  const email = searchParams.get("email");
  const flow = searchParams.get("flow") || "login";

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    // Allow only numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) {
        newOtp[index] = char;
      }
    });
    setOtp(newOtp);
    
    // Focus next available input
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    
    if (otpString.length !== 6) {
      alert("Please enter all 6 digits of the OTP");
      return;
    }

    setIsLoading(true);
    const endpoint = flow === "signup" ? "/auth/verify" : "/auth/verify-login-otp";

    try {
      const data = await apiFetch(endpoint, {
        method: "POST",
        body: JSON.stringify({ email, otp: otpString }),
      });

      console.log("Verification Response:", data);

      if (data && data.user) {
        setUser(data.user);
      } else {
        setUser(data);
      }
      
      router.push("/dashboard");
    } catch (err: any) {
      alert(err.message || "Invalid OTP. Please try again.");
      // Clear OTP on error
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setIsLoading(true);
    try {
      const endpoint = flow === "signup" ? "/auth/resend-otp" : "/auth/resend-login-otp";
      await apiFetch(endpoint, {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      
      alert("New OTP sent to your email!");
      setOtp(["", "", "", "", "", ""]);
      setCountdown(30);
      setCanResend(false);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      alert(err.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md shadow-xl border border-gray-200 bg-white">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Verify Your Email
          </CardTitle>
          <CardDescription className="text-gray-600">
            <div className="flex items-center justify-center gap-2 mt-2">
              <Mail className="h-4 w-4" />
              <span className="font-medium text-gray-700">{email}</span>
            </div>
            <p className="mt-3">
              Enter the 6-digit verification code sent to your email address
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-center space-x-2">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    maxLength={1}
                    className="w-12 h-14 text-center text-2xl font-bold text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    disabled={isLoading}
                    required
                  />
                ))}
              </div>
              
              <p className="text-center text-sm text-gray-500">
                Didn't receive the code?{" "}
                {canResend ? (
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 text-blue-600 hover:text-blue-800 hover:no-underline"
                    onClick={handleResendOTP}
                    disabled={isLoading}
                  >
                    Resend OTP
                  </Button>
                ) : (
                  <span className="text-gray-700 font-medium">
                    Resend in {countdown}s
                  </span>
                )}
              </p>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading || otp.join("").length !== 6}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify & Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => {
                  if (flow === "signup") {
                    router.push("/signup");
                  } else {
                    router.push("/login");
                  }
                }}
                disabled={isLoading}
              >
                ← Back to {flow === "signup" ? "Sign Up" : "Login"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="border-t border-gray-200 pt-6">
          <div className="text-xs text-gray-500 text-center w-full">
            <p className="flex items-center justify-center gap-1">
              <Lock className="h-3 w-3" />
              Your verification code expires in 10 minutes
            </p>
            <p className="mt-2">
              Check your spam folder if you don't see the email
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
          <p className="mt-2 text-gray-600">Loading verification...</p>
        </div>
      </div>
    }>
      <OTPForm />
    </Suspense>
  );
}