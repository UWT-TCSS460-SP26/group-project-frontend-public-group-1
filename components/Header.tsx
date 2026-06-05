import { auth, signIn, signOut } from "@/auth";
import Link from "next/link";

export default async function Header() {
  const session = await auth();

  return (
    <header
      style={{
        backgroundColor: "#0b0b0b",
        borderBottom: "1px solid #222",
        padding: "1rem 2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <Link
          href="/"
          style={{
            color: "white",
            fontSize: "1.5rem",
            fontWeight: "900",
            textDecoration: "none",
          }}
        >
           Movie<span style={{ color: "#3b82f6" }}>Social</span>
        </Link>

        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/browse/movies"
            style={{
              color: "#ddd",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Browse
            </Link>

              <Link
                href="/about"
                style={{
                  color: "#ddd",
                  textDecoration: "none",
                  fontWeight: "600",
                }}
              >
                About
              </Link>

          {session && (
            <Link
              href="/profile"
              style={{
                color: "#ddd",
                textDecoration: "none",
                fontWeight: "600",
              }}
            
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
              <button
                type="submit"
                style={{
                  backgroundColor: "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "999px",
                  padding: "0.6rem 1rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Sign Out
              </button>
            </form>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn("tcss460");
              }}
            >
              <button
                type="submit"
                style={{
                  backgroundColor: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "999px",
                  padding: "0.6rem 1rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Sign In
              </button>
            </form>
          )}
        </nav>
      </div>
    </header>
  );
}