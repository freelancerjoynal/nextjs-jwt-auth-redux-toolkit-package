"use client";
import { useAuth } from "@/context/AuthContext";

export default function LogoutBtn() {
  const { logout } = useAuth();

  return (
    <button onClick={logout}>
      Sign Out
    </button>
  );
}