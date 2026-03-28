import LoginForm from "@/features/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
      <LoginForm />
    </main>
  );
}