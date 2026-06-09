import { auth, signIn, signOut } from "@/auth";
import Link from "next/link";
import NavProfileLink from "./NavProfileLink";
import { Button } from "./ui/Button";
import { Container } from "./ui/Container";

export default async function Header() {
  const session = await auth();

  return (
    <header className="bg-background border-b border-border py-4">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="text-2xl font-black tracking-tighter transition-opacity hover:opacity-100"
          >
            Movie<span className="text-brand-blue">Social</span>
          </Link>

          <nav className="flex flex-wrap items-center gap-6">
            <Link
              href="/browse/movies"
              className="font-semibold text-text-secondary transition-colors hover:text-text-primary"
            >
              Browse
            </Link>

            <Link
              href="/about"
              className="font-semibold text-text-secondary transition-colors hover:text-text-primary"
            >
              About
            </Link>

            {session && <NavProfileLink />}

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