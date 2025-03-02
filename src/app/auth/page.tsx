import LoginButton from "@/components/LoginButton";
import LogoutButton from "@/components/LogoutButton";
import PhoneAuth from "@/components/PhoneAuth";

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <PhoneAuth />
      <LoginButton />
      <LogoutButton />
    </div>
  );
}