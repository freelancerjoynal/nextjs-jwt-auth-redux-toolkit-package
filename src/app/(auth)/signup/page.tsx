"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, ArrowRight, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Simple validation
    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    
    setIsLoading(true);
    try {
      await apiFetch("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      router.push(`/verify-otp?email=${encodeURIComponent(email)}&flow=signup`);
    } catch (err: any) {
      setError(err.message || "An error occurred during signup");
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
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4"
            >
              <UserPlus className="h-6 w-6 text-blue-600" />
            </motion.div>
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <CardTitle className="text-2xl font-bold text-gray-900">
                Create Your Account
              </CardTitle>
              <CardDescription className="text-gray-600">
                Join us today and start your journey
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-6">
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
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
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
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all"
                    required
                    disabled={isLoading}
                  />
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-3"
              >
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Password
                  </div>
                </Label>
                <motion.div
                  whileFocus={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all"
                    required
                    disabled={isLoading}
                  />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-xs text-gray-500"
                >
                  Password must be at least 8 characters long
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
                  className="w-full h-11 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white transition-all relative overflow-hidden group"
                  disabled={isLoading}
                >
                  <motion.span
                    className="relative z-10 flex items-center justify-center"
                    animate={isLoading ? { opacity: 0 } : { opacity: 1 }}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Account
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
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t border-gray-200 pt-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center text-sm"
            >
              <span className="text-gray-600">Already have an account? </span>
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="link"
                  className="p-0 font-semibold text-blue-600 hover:text-blue-800 hover:no-underline"
                  onClick={() => router.push("/login")}
                >
                  Sign in here
                </Button>
              </motion.span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-xs text-gray-500 text-center px-4"
            >
              <p>By creating an account, you agree to our</p>
              <p>
                <Button
                  variant="link"
                  className="p-0 text-xs text-blue-600 hover:text-blue-800"
                  onClick={() => console.log("Terms clicked")}
                >
                  Terms of Service
                </Button>
                {" "}and{" "}
                <Button
                  variant="link"
                  className="p-0 text-xs text-blue-600 hover:text-blue-800"
                  onClick={() => console.log("Privacy clicked")}
                >
                  Privacy Policy
                </Button>
              </p>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
      
      {/* Animated background elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="fixed inset-0 pointer-events-none overflow-hidden"
      >
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            rotate: [0, -180, -360]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
            delay: 5
          }}
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
      </motion.div>
    </div>
  );
}