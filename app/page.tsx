export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #1f2937 0%, #050505 45%, #000 100%)",
        color: "white",
        padding: "3rem",
      }}
    >
      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          paddingTop: "8rem",
          textAlign: "center",
        }}
      >
        <p style={{ color: "#9ca3af", marginBottom: "1rem" }}>
          Your movie and TV discovery app
        </p>

        <h1
          style={{
            fontSize: "4rem",
            lineHeight: "1.1",
            marginBottom: "1.5rem",
          }}
        >
          Discover movies and TV shows in one place.
        </h1>

        <p
          style={{
            color: "#d1d5db",
            fontSize: "1.1rem",
            lineHeight: "1.7",
            maxWidth: "650px",
            margin: "0 auto 2rem",
          }}
        >
          Search for your favorite titles, explore results from our partner API,
          and view details before ratings and reviews arrive in Sprint 7.
        </p>

        <a
          href="/search"
          style={{
            display: "inline-block",
            padding: "1rem 1.8rem",
            backgroundColor: "white",
            color: "black",
            borderRadius: "999px",
            textDecoration: "none",
            fontWeight: "bold",
            boxShadow: "0 0 25px rgba(255,255,255,0.25)",
          }}
        >
          Start Searching
        </a>
      </section>
    </main>
  );
}