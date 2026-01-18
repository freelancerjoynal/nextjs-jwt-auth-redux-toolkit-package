"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, ArrowRight, KeyRound } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
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
      
      // Show success message before redirect
    //   alert("OTP sent successfully! Redirecting to reset password page...");
      
      // Automatic redirect to reset password page
      router.push("/reset-password");
    } catch (err: any) {
      setError(err.message || "User not found. Please check your email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md shadow-xl border border-gray-200 bg-white">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <KeyRound className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Reset Your Password
          </CardTitle>
          <CardDescription className="text-gray-600">
            Enter your email address and we'll send you an OTP to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-3">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </div>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
                disabled={isLoading}
              />
              <p className="text-sm text-gray-500">
                We'll send a 6-digit OTP to this email address
              </p>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                <>
                  Send Reset OTP
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 text-sm mb-2">
                  <KeyRound className="inline h-4 w-4 mr-1" />
                  What happens next?
                </h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>✓ Check your email for a 6-digit OTP</li>
                  <li>✓ Enter the OTP on the next screen</li>
                  <li>✓ New password will be sent to your email</li>
                </ul>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="border-t border-gray-200 pt-6">
          <div className="text-center text-sm w-full">
            <span className="text-gray-600">Remember your password? </span>
            <Button
              variant="link"
              className="p-0 font-semibold text-blue-600 hover:text-blue-800 hover:no-underline"
              onClick={() => router.push("/login")}
            >
              Back to Login
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}