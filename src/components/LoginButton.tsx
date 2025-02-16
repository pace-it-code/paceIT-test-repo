"use client";
import { useRouter } from "next/navigation";
import { signInWithPopup, getIdToken } from "firebase/auth";
import { auth, googleProvider } from "../../utils/firebase";

export default function LoginButton() {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      // ✅ Perform OAuth authentication
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // ✅ Get Firebase ID Token
      const token = await user.getIdToken();

      // ✅ Store token in HTTP-only cookie via API
      await fetch("/api/auth/set-cookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      console.log("User Logged In:", user);

      // ✅ Redirect to dashboard
      router.push("/");
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  return (
    <div>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
}
