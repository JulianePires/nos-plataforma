import { redirect } from "next/navigation";
import { homeFor } from "../../features/auth/access";
import { getCurrentUser } from "../../features/auth/queries";

// Placeholder until the landing page (S6) takes over "/".
export default async function Root() {
  const user = await getCurrentUser();
  redirect(user ? homeFor(user.role) : "/login");
}
