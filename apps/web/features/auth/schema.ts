import { z } from "zod";

const invalidEmail = "Informe um e-mail válido.";

export const magicLinkSchema = z.object({
  email: z
    .string({ error: invalidEmail })
    .trim()
    .pipe(z.email({ error: invalidEmail })),
});
