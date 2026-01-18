"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, ArrowRight, KeyRound, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    
    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    try {
      await apiFetch("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      // Store email in session to allow access to reset page
      sessionStorage.setItem("reset_email", email);
      
      // Show success state before redirect
      setSuccess(true);
      
      // Automatic redirect to reset password page after 2 seconds
      setTimeout(() => {
        router.push("/reset-password");
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || "User not found. Please check your email.");
    } finally {
      setIsLoading(false);
    }
  };

  // Success state with animation
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
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
                className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
              >
                <CheckCircle className="h-8 w-8 text-green-600" />
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <CardTitle className="text-2xl font-bold text-gray-900">
                  OTP Sent Successfully!
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Check your email for the verification code
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent className="text-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">
                    Verification code sent to:
                  </p>
                  <p className="font-semibold text-green-900 mt-1">{email}</p>
                </div>
                
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Redirecting to reset page...</span>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button
                    onClick={() => router.push("/reset-password")}
                    className="w-full h-11 text-base font-medium bg-green-600 hover:bg-green-700 text-white"
                  >
                    Continue to Reset Password
                  </Button>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border border-gray-200 bg-white">
          <CardHeader className="space-y-1 text-center">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4"
            >
              <KeyRound className="h-6 w-6 text-blue-600" />
            </motion.div>
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <CardTitle className="text-2xl font-bold text-gray-900">
                Reset Your Password
              </CardTitle>
              <CardDescription className="text-gray-600">
                Enter your email address and we'll send you an OTP to reset your password
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                      {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-3"
              >
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </div>
                </Label>
                <motion.div
                  whileFocus={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all"
                    required
                    disabled={isLoading}
                  />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm text-gray-500"
                >
                  We'll send a 6-digit OTP to this email address
                </motion.p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button
                  type="submit"
                  className="w-full h-11 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 className="mr-2 h-4 w-4" />
                      </motion.div>
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      Send Reset OTP
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                className="bg-blue-50 border border-blue-200 rounded-lg p-4"
              >
                <h4 className="font-medium text-blue-800 text-sm mb-2">
                  <KeyRound className="inline h-4 w-4 mr-1" />
                  What happens next?
                </h4>
                <motion.ul 
                  className="text-xs text-blue-700 space-y-1"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1,
                        delayChildren: 0.2
                      }
                    }
                  }}
                >
                  {[
                    "✓ Check your email for a 6-digit OTP",
                    "✓ Enter the OTP on the next screen",
                    "✓ New password will be sent to your email"
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      variants={{
                        hidden: { opacity: 0, x: -10 },
                        visible: { opacity: 1, x: 0 }
                      }}
                    >
                      {item}
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            </form>
          </CardContent>
          <CardFooter className="border-t border-gray-200 pt-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center text-sm w-full"
            >
              <span className="text-gray-600">Remember your password? </span>
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="link"
                  className="p-0 font-semibold text-blue-600 hover:text-blue-800 hover:no-underline"
                  onClick={() => router.push("/login")}
                >
                  Back to Login
                </Button>
              </motion.span>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}