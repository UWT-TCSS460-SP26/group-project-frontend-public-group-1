import { auth, signIn, signOut } from "@/auth";
import Link from "next/link";
import { Button } from "./ui/Button";
import { Container } from "./ui/Container";

export default async function Header() {
  const session = await auth();

  return (
    <header className="bg-background border-b border-border py-4">
      <Container>
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <Link
            href="/"
            className="text-2xl font-black tracking-tighter hover:opacity-100 transition-opacity"
          >
            Movie<span className="text-brand-blue">Social</span>
          </Link>

          <nav className="flex items-center gap-6 flex-wrap">
            <Link
              href="/browse/movies"
              className="text-text-secondary hover:text-text-primary font-semibold transition-colors"
            >
              Browse
            </Link>

            <Link
              href="/about"
              className="text-text-secondary hover:text-text-primary font-semibold transition-colors"
            >
              About
            </Link>

            {session && (
              <Link
                href="/profile"
                className="text-text-secondary hover:text-text-primary font-semibold transition-colors"
              >
                Profile
              </Link>
            )}

            {session ? (
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <Button variant="ghost" size="sm" type="submit">
                  Sign Out
                </Button>
              </form>
            ) : (
              <form
                action={async () => {
                  "use server";
                  await signIn("tcss460");
                }}
              >
                <Button variant="secondary" size="sm" type="submit">
                  Sign In
                </Button>
              </form>
            )}
          </nav>
        </div>
      </Container>
    </header>
  );
}