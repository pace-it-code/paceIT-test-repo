"use client"; // If using client-side animations (optional)

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
}
