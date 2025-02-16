import LoginButton from "@/components/LoginButton";
import LogoutButton from "@/components/LogoutButton";
import PhoneAuth from "@/components/PhoneAuth";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <PhoneAuth />
      <LoginButton />
      <LogoutButton />
    </div>
  );
}
