import { auth, signOut } from "@/auth";
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
        }}
      >
        {/* LEFT SIDE */}
        <Link
          href="/"
          style={{
            color: "white",
            fontSize: "1.5rem",
            fontWeight: "900",
            textDecoration: "none",
          }}
        >
          🎬 Movie<span style={{ color: "#3b82f6" }}>Social</span>
        </Link>

        {/* RIGHT SIDE */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
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

          {session && (
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
          )}
        </div>
      </div>
    </header>
  );
}