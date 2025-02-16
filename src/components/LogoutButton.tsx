"use client";
import { useRouter } from "next/navigation";
import { auth } from "../../utils/firebase";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await auth.signOut(); // Firebase logout

    // ✅ Remove cookie via API
    await fetch("/api/auth/logout", { method: "POST" });

    router.push("/login");
  };

  return <button onClick={handleLogout}>Logout</button>;
}
