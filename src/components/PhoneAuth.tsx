"use client";
import { useState } from "react";
import { auth,  signInWithPhoneNumber } from "../../utils/firebase";
import { ConfirmationResult } from "firebase/auth";
import { RecaptchaVerifier } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
const db = getFirestore();
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}

export default function PhoneAuth() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  // ✅ Setup reCAPTCHA before sending OTP
  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: (response: string) => {
        console.log("reCAPTCHA verified", response);
      },
    });
  };

  // ✅ Send OTP
  const sendOtp = async () => {
    setupRecaptcha();

    try {
      const confirmation = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      alert("OTP sent successfully!");
    } catch (error) {
      console.error("OTP sending failed:", error);
    }
  };

  // ✅ Verify OTP



  const verifyOtp = async () => {
    if (!confirmationResult) return;
  
    try {
      const result = await confirmationResult.confirm(otp);
      console.log("User verified:", result.user);
  
      const userId = result.user.uid; // ✅ Extract user ID
      localStorage.setItem("userId", userId); // ✅ Store in localStorage
  
      // ✅ Save user to Firestore
      const newUser = {
        id: userId,
        email: result.user.email || null,
        name: result.user.displayName || "Anonymous",
        cart: [],
        createdAt: new Date().toISOString(),
        phone: result.user.phoneNumber,
      };
  
      await setDoc(doc(db, "users", userId), newUser, { merge: true });
  
      alert("Phone number verified & saved!");
    } catch (error) {
      console.error("OTP verification failed:", error);
    }
  };
  

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Phone Authentication</h2>

      {/* Phone Input */}
      <input
        type="text"
        placeholder="+1234567890"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      <button onClick={sendOtp} className="bg-blue-500 text-white p-2 w-full">
        Send OTP
      </button>

      {/* OTP Input */}
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="border p-2 mt-2 mb-2 w-full"
      />
      <button onClick={verifyOtp} className="bg-green-500 text-white p-2 w-full">
        Verify OTP
      </button>

      {/* Invisible reCAPTCHA */}
      <div id="recaptcha-container"></div>
    </div>
  );
}
