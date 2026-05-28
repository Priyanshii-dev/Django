import AuthPage from "@/features/auth/AuthPage";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center bg-app-bg px-4 py-8 dark:bg-app-bg-dark sm:px-6">
      <AuthPage mode="register" />
    </main>
  );
}
