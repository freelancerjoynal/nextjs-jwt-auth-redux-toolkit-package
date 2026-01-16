"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const data = await apiFetch("/auth/profile");
      setUser(data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const logout = async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
      setUser(null);
      window.location.href = "/login";
    } catch (err) {
      console.error("logout failed", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout, refreshUser: fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);