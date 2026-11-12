import type { Metadata } from "next";
import { LoginForm } from "../../../features/auth/components/login-form";

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
  const { error } = await searchParams;
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
