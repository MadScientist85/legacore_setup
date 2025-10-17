import { RegisterForm } from "@/components/auth/register-form"

export const metadata = {
  title: "Register | LEGACORE",
  description: "Create your LEGACORE account",
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <RegisterForm />
    </div>
  )
}
