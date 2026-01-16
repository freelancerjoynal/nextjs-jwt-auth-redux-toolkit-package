"use client";
import { useAuth } from "@/context/AuthContext";

export default function Profile() {
  const { user, loading } = useAuth(); // এখান থেকেই ডাটা পাবেন

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>User Profile</h1>
      <p>Email: {user?.email}</p>
      <p>name: {user?.name}</p>
      <p>Role: {user?.role}</p>
    </div>
  );
}