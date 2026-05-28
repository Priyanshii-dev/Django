import AuthPage from "@/features/auth/AuthPage";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#f6f7f9] p-6">
      <AuthPage mode="login" />
    </main>
  );
}
