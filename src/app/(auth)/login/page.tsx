import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-gray-100 px-4">
      <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white/80 p-8 shadow-2xl backdrop-blur">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-emerald-600">
            KOTOZE
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Everything You Need. One Place.
          </p>
        </div>

        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome Back
          </h2>

          <p className="mt-2 text-gray-500">
            Sign in to continue to your dashboard.
          </p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}