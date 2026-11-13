import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { homeFor } from "../../../features/auth/access";
import { LoginForm } from "../../../features/auth/components/login-form";
import { getCurrentUser } from "../../../features/auth/queries";

export const metadata: Metadata = {
  title: "Entrar · Nós",
};

const errors: Record<string, string> = {
  link: "O link expirou ou já foi usado. Peça um novo.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [user, { error }] = await Promise.all([getCurrentUser(), searchParams]);
  if (user) redirect(homeFor(user.role));

  const message = typeof error === "string" ? errors[error] : undefined;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center gap-6 px-4">
      <h1 className="text-2xl font-semibold">Entrar</h1>
      {message && (
        <p role="alert" className="text-sm text-danger">
          {message}
        </p>
      )}
      <LoginForm />
    </main>
  );
}
