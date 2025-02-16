"use client";
import { useState } from "react";

export default function PhoneAuth() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = () => {
    if (phone.length < 10) {
      alert("Please enter a valid phone number.");
      return;
    }
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    if (otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP.");
      return;
    }
    alert("OTP Verified Successfully!");
  };

  return (
    <div
      className="relative w-full h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/images/farm-background.jpg')" }} // Replace with actual image
    >
      <div className="bg-white bg-opacity-90 backdrop-blur-md p-8 rounded-lg shadow-xl max-w-sm w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800">Login with Phone</h1>
        <p className="text-gray-600 text-sm mb-4">Enter your phone number to receive an OTP</p>

        {/* 🔹 Phone Number Input */}
        <label className="block text-gray-700 text-sm font-medium text-left">Phone Number</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+91 9876543210"
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none mb-4 text-lg text-gray-900"
        />

        {/* 🔹 Send OTP Button */}
        <button
          onClick={handleSendOtp}
          className={`w-full py-2 text-lg font-semibold rounded-md transition ${
            otpSent ? "bg-gray-400 text-white cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"
          }`}
          disabled={otpSent}
        >
          {otpSent ? "OTP Sent ✔" : "Send OTP"}
        </button>

        {/* 🔹 OTP Input (Only Show When OTP is Sent) */}
        {otpSent && (
          <>
            <label className="block text-gray-700 text-sm font-medium text-left mt-4">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit OTP"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none mb-4 text-lg text-gray-900"
            />

            {/* 🔹 Verify OTP Button */}
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-semibold transition"
            >
              Verify OTP
            </button>
          </>
        )}

        {/* 🔹 Alternative Login Option */}
        <p className="text-gray-600 text-sm mt-4">
          Want to login with Email?{" "}
          <a href="/email-login" className="text-green-600 font-semibold hover:underline">
            Click Here
          </a>
        </p>
      </div>
    </div>
  );
}
