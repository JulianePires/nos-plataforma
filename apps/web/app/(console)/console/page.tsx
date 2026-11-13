import { Button } from "@nos/seixu";
import { signOut } from "../../../features/auth/actions";

export default function Home() {
  return (
    <main>
      <h1>Nós Console</h1>
      <form action={signOut}>
        <Button type="submit" variant="secondary">
          Sair
        </Button>
      </form>
    </main>
  );
}
