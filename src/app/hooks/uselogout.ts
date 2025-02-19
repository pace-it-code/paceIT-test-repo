"use client";

import { useRouter } from "next/navigation";

export function useLogout() {
  const router = useRouter();

  async function handleLogout() {
    try {
      const response = await fetch("/api/logout", { method: "POST" });

      if (response.ok) {
        localStorage.removeItem("userId");
        console.log("🔓 Logged out successfully");
        router.push("/auth"); // Redirect to cart after logout
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  return handleLogout;
}
