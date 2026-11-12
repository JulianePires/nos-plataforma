import { describe, expect, it } from "vitest";
import { magicLinkSchema } from "./schema";

describe("magicLinkSchema", () => {
  it("accepts a valid e-mail and trims it", () => {
    const result = magicLinkSchema.safeParse({ email: "  cliente@nos.local " });

    expect(result.success && result.data.email).toBe("cliente@nos.local");
  });

  it.each(["nao-e-email", "", null])(
    "rejects %j with a Portuguese message",
    (email) => {
      const result = magicLinkSchema.safeParse({ email });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.message).toBe(
        "Informe um e-mail válido.",
      );
    },
  );
});
