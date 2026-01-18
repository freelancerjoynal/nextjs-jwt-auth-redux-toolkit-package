"use client";

import { useState, Suspense, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lock, ArrowRight, Mail, ShieldCheck, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function OTPForm() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState("");
  const [resendSuccess, setResendSuccess] = useState(false);
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

  // Clear resend success message after 3 seconds
  useEffect(() => {
    if (resendSuccess) {
      const timer = setTimeout(() => {
        setResendSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [resendSuccess]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
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
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 10);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      setTimeout(() => {
        inputRefs.current[index - 1]?.focus();
      }, 10);
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
    setTimeout(() => {
      inputRefs.current[nextIndex]?.focus();
    }, 10);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    
    if (otpString.length !== 6) {
      setError("Please enter all 6 digits of the OTP");
      return;
    }

    setIsLoading(true);
    setError("");
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
      setError(err.message || "Invalid OTP. Please try again.");
      // Clear OTP on error
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
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
      
      setResendSuccess(true);
      setError("");
      setOtp(["", "", "", "", "", ""]);
      setCountdown(30);
      setCanResend(false);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border border-gray-200 bg-white">
          <CardHeader className="space-y-1 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4"
            >
              <ShieldCheck className="h-6 w-6 text-blue-600" />
            </motion.div>
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
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
            </motion.div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-6">
              <AnimatePresence mode="wait">
                {/* Error message */}
                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      {error}
                    </div>
                  </motion.div>
                )}
                
                {/* Resend success message */}
                {resendSuccess && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>New OTP sent successfully! Check your email.</span>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <div className="flex justify-center space-x-2">
                  {otp.map((digit, index) => (
                    <motion.div
                      key={index}
                      initial={{ y: 20, opacity: 0, scale: 0.5 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      transition={{ 
                        delay: 0.1 * index,
                        type: "spring",
                        stiffness: 200,
                        damping: 15
                      }}
                      whileFocus={{ scale: 1.05 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Input
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={index === 0 ? handlePaste : undefined}
                        maxLength={1}
                        className="w-12 h-14 text-center text-2xl font-bold text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                        disabled={isLoading}
                        required
                      />
                    </motion.div>
                  ))}
                </div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex justify-between items-center"
                >
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Code expires in 10 minutes
                  </p>
                  
                  {canResend ? (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        type="button"
                        variant="link"
                        className="p-0 h-auto text-sm text-blue-600 hover:text-blue-800 hover:no-underline"
                        onClick={handleResendOTP}
                        disabled={isLoading}
                      >
                        Resend OTP
                      </Button>
                    </motion.div>
                  ) : (
                    <p
                      key={countdown}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="text-sm text-gray-700"
                    >
                      Resend in {countdown}s
                    </p>
                  )}
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button
                  type="submit"
                  className="w-full h-11 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white transition-all relative overflow-hidden group"
                  disabled={isLoading || otp.join("").length !== 6}
                >
                  <motion.span
                    className="relative z-10 flex items-center justify-center"
                    animate={isLoading ? { opacity: 0 } : { opacity: 1 }}
                  >
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Verify & Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.span>
                  
                  {isLoading && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 className="h-5 w-5 text-white" />
                      </motion.div>
                    </motion.div>
                  )}
                  
                  {/* Button hover gradient effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center"
              >
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
              </motion.div>
            </form>
          </CardContent>
          <CardFooter className="border-t border-gray-200 pt-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-xs text-gray-500 text-center w-full"
            >
              <p className="flex items-center justify-center gap-1">
                <Lock className="h-3 w-3" />
                Your verification code expires in 10 minutes
              </p>
              <p className="mt-2">
                Check your spam folder if you don't see the email
              </p>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
      
      {/* Animated background elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ delay: 1, duration: 1 }}
        className="fixed inset-0 pointer-events-none overflow-hidden"
      >
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
          className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl"
        />
      </motion.div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mx-auto"
          >
            <Loader2 className="h-12 w-12 text-blue-600" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-lg font-medium text-gray-700"
          >
            Loading verification...
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.5 }}
            className="mt-2 text-sm text-gray-500"
          >
            Please wait while we prepare your OTP verification
          </motion.p>
        </motion.div>
      </div>
    }>
      <OTPForm />
    </Suspense>
  );
}