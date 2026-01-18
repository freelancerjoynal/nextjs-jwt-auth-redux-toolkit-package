"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, ArrowRight, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    
    if (password.length === 0) {
      setError("Please enter your password");
      return;
    }
    
    setIsLoading(true);
    try {
      await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(err.message || "Failed to login. Please check your credentials.");
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
          <CardHeader className="space-y-1">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col space-y-2 text-left"
            >
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                  <LogIn className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Welcome Back
                </CardTitle>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <CardDescription className="text-gray-600">
                  Sign in to your account to continue
                </CardDescription>
              </motion.div>
            </motion.div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
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
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <motion.div
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 text-gray-900 transition-all"
                      required
                      disabled={isLoading}
                    />
                  </motion.div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-gray-700 font-medium flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Password
                    </Label>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        type="button"
                        variant="link"
                        className="p-0 h-auto text-xs text-gray-600 hover:text-gray-900"
                        onClick={() => router.push("/forgot-password")}
                      >
                        Forgot password?
                      </Button>
                    </motion.div>
                  </div>
                  <motion.div
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 text-gray-900 transition-all"
                      required
                      disabled={isLoading}
                    />
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button
                  type="submit"
                  className="w-full h-11 text-base font-medium bg-gray-900 hover:bg-gray-800 text-white transition-all relative overflow-hidden group"
                  disabled={isLoading}
                >
                  <motion.span
                    className="relative z-10 flex items-center justify-center"
                    animate={isLoading ? { opacity: 0 } : { opacity: 1 }}
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
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
                  
                  {/* Button hover effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                </Button>
              </motion.div>
            </form>
          </CardContent>
          <CardFooter className="border-t border-gray-200 pt-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center text-sm w-full"
            >
              <span className="text-gray-600">Don't have an account? </span>
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="link"
                  className="p-0 font-semibold text-gray-900 hover:text-gray-700"
                  onClick={() => router.push("/signup")}
                >
                  Create account
                </Button>
              </motion.span>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
      
      {/* Background decorative elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="fixed inset-0 pointer-events-none"
      >
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </motion.div>
    </div>
  );
}