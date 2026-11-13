import { defineConfig } from "vitest/config";

// Node by default: route handlers and the proxy need the runtime's own Request.
// Component tests opt in to jsdom with a `// @vitest-environment jsdom` header.
export default defineConfig({
  // Next's tsconfig keeps JSX as "preserve" for its own compiler; tests need it transformed.
  oxc: { jsx: { runtime: "automatic" } },
  test: {
    environment: "node",
    setupFiles: ["./test-setup.ts"],
  },
});
