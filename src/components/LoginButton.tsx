"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup, getIdToken } from "firebase/auth";
import { auth, googleProvider, db } from "../../utils/firebase";
import { doc, setDoc } from "firebase/firestore";
import Cookies from "js-cookie";

export default function LoginButton() {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      // ✅ Perform OAuth authentication
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await getIdToken(user);

      // ✅ Save token as a cookie with expiry of 7 days
      Cookies.set("authToken", token, { expires: 7, secure: true, sameSite: "Strict" });

      // ✅ Save user details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString(),
        cart: [],
      }, { merge: true });

      console.log("User saved to Firestore:", user);
      
      // ✅ Redirect to dashboard
      router.push("/");
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
