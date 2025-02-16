"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithRedirect, getRedirectResult, UserCredential } from "firebase/auth";
import { auth, googleProvider } from "../../utils/firebase";

export default function LoginButton() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  // ✅ Run Only Once to Avoid Multiple Redirect Checks
  useEffect(() => {
    let isMounted = true;

    async function checkRedirectResult() {
      console.log("🔍 Checking for redirect login result...");
      setLoading(true);

      try {
        const result: UserCredential | null = await getRedirectResult(auth);
        if (!isMounted) return;

        if (result) {
          const user = result.user;
          console.log("✅ Redirect Login Success:", user);
          alert(`🎉 Logged in as: ${user.displayName} (${user.email})`);

          // ✅ Store User ID
          localStorage.setItem("userId", user.uid);
          console.log("🔹 Stored user ID:", user.uid);

          // ✅ Save Token via API
          const token = await user.getIdToken();
          const response = await fetch("/api/auth/set-cookie", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });

          if (response.ok) {
            console.log("🍪 Token successfully stored in cookies");
          } else {
            console.warn("⚠️ Failed to store token in cookies:", response.status);
          }

          // ✅ Redirect to Home
          router.push("/");
        } else {
          console.log("ℹ️ No redirect result found.");
        }
      } catch (error) {
        console.error("❌ Redirect Login Error:", error);
        alert("⚠️ Error during redirect login. Check console.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    checkRedirectResult();

    return () => {
      isMounted = false; // Cleanup function to prevent memory leaks
    };
  }, [router]);

  // ✅ Start Google Sign-In Redirect
  const handleLogin = async () => {
    console.log("🔄 Initiating Google login redirect...");

    try {
      await signInWithRedirect(auth, googleProvider);
      console.log("✅ Redirect initiated.");
    } catch (error) {
      console.error("❌ Login Error:", error);
      alert("⚠️ Login failed. Check console for details.");
    }
  };

  return (
    <div>
      {loading ? <p className="text-gray-600">⏳ Checking login...</p> : null}
      <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded-md">
        Login with Google
      </button>
    </div>
  );
}
