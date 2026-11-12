"use client";

import { Button, Input } from "@nos/seixu";
import { useActionState } from "react";
import { type MagicLinkState, requestMagicLink } from "../actions";

const initialState: MagicLinkState = { status: "idle" };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    requestMagicLink,
    initialState,
  );
  const invalid = state.status === "invalid";

  return (
    <form action={formAction} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Input
          label="E-mail"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? "email-error" : undefined}
        />
        {invalid && (
          <p id="email-error" className="text-sm text-danger">
            {state.error}
          </p>
        )}
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Enviando…" : "Receber link de acesso"}
      </Button>

      <p role="status" className="text-sm text-text-muted">
        {state.status === "sent" &&
          "Se o e-mail estiver cadastrado, o link chega em instantes."}
      </p>
    </form>
  );
}
