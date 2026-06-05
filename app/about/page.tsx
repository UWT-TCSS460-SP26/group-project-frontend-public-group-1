import Link from "next/link";

const teamMembers = [
  {
    name: "Harleen Bhardwaj",
    role: "Reviews, edit/delete functionality, browse/detail pages, Sprint 8 feedback fixes, and frontend polish.",
  },
  {
    name: "Harsimar Kaur",
    role: "Search, ratings/reviews features, issue creation, backend rating routes, and validation tasks.",
  },
  {
    name: "Jonathan Hernandez",
    role: "Sign-in/auth UI, profile activity visuals, signed-out placeholders, deployment, and issue routes.",
  },
  {
    name: "Nate Almanza",
    role: "Authentication middleware, rating update/delete routes, documentation, and backend auth setup.",
  },
];

export default function AboutPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "2rem",
        backgroundColor: "#0b0b0b",
        color: "#f5f5f5",
      }}
    >
      <section style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Link
          href="/"
          style={{
            color: "#60a5fa",
            textDecoration: "none",
            fontWeight: "700",
          }}
        >
          ← Back Home
        </Link>

        <section
          style={{
            marginTop: "1.5rem",
            marginBottom: "1.5rem",
            padding: "2rem",
            borderRadius: "18px",
            backgroundColor: "#111",
            border: "1px solid #222",
          }}
        >
          <p
            style={{
              color: "#60a5fa",
              fontWeight: "800",
              marginBottom: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontSize: "0.8rem",
            }}
          >
            About MovieSocial
          </p>

          <h1
            style={{
              fontSize: "2.75rem",
              lineHeight: "1.1",
              marginBottom: "1rem",
              maxWidth: "850px",
            }}
          >
            Built for discovering, rating, and reviewing movies and shows.
          </h1>

          <p
            style={{
              color: "#d1d5db",
              fontSize: "1.05rem",
              lineHeight: "1.7",
              maxWidth: "780px",
            }}
          >
            MovieSocial is our TCSS 460 consumer app. It lets users browse
            popular movies and TV shows, search for titles, view details, sign
            in, and interact with ratings and reviews through our upstream
            partner API.
          </p>
        </section>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1rem",
          }}
        >
          <section
            style={{
              backgroundColor: "#111",
              border: "1px solid #222",
              borderRadius: "18px",
              padding: "1.5rem",
            }}
          >
            <h2 style={{ marginBottom: "1rem" }}>Team Contributions</h2>

            <div style={{ display: "grid", gap: "0.75rem" }}>
              {teamMembers.map((member) => (
                <div
                  key={member.name}
                  style={{
                    padding: "1rem",
                    borderRadius: "12px",
                    backgroundColor: "#0b0b0b",
                    border: "1px solid #222",
                  }}
                >
                  <h3 style={{ marginBottom: "0.35rem" }}>{member.name}</h3>
                  <p style={{ color: "#d1d5db", lineHeight: "1.6" }}>
                    {member.role}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section
            style={{
              backgroundColor: "#111",
              border: "1px solid #222",
              borderRadius: "18px",
              padding: "1.5rem",
            }}
          >
            <h2 style={{ marginBottom: "1rem" }}>Powered By</h2>

            <div style={{ display: "grid", gap: "1rem", color: "#d1d5db" }}>
              <p>
                <strong style={{ color: "#f5f5f5" }}>Upstream Partner:</strong>{" "}
                Group 9 API powers our browse, search, detail, rating, and
                review experience.
              </p>

              <p>
                <strong style={{ color: "#f5f5f5" }}>TMDB:</strong> Provides
                movie and TV metadata like posters, titles, descriptions,
                ratings, and release information.
              </p>

              <p>
                <strong style={{ color: "#f5f5f5" }}>Auth²:</strong> Supports
                OAuth2 sign-in and authenticated user actions.
              </p>

              <p>
                <strong style={{ color: "#f5f5f5" }}>Next.js:</strong> Powers
                the frontend routing, pages, and app structure.
              </p>
            </div>
          </section>
        </div>

        <section
          style={{
            marginTop: "1rem",
            backgroundColor: "#111",
            border: "1px solid #222",
            borderRadius: "18px",
            padding: "1.5rem",
          }}
        >
          <h2 style={{ marginBottom: "1rem" }}>Project Reflection</h2>
          <p
            style={{
              color: "#d1d5db",
              lineHeight: "1.7",
              maxWidth: "900px",
            }}
          >
            Across the project, we learned how to build a consumer app on top of
            another team&apos;s API, work with OAuth2 authentication, attach
            bearer tokens to authenticated requests, handle API contract issues,
            and polish the app so it feels consistent across search, browse,
            detail, profile, and review flows.
          </p>
        </section>
      </section>
    </main>
  );
}
