"use client";

import { useState } from "react";

type Movie = {
  id: number;
  title: string;
  overview?: string;
  release_date?: string;
  poster?: string;
};

export default function SearchPage() {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(event: React.FormEvent) {
    event.preventDefault();

    if (!search.trim()) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/movies/search?title=${encodeURIComponent(
        search
      )}`;

      console.log("Search URL:", url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();

      console.log(data);

      setMovies(data.results || data);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while searching.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "black",
        color: "white",
        padding: "2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <a
          href="/"
          style={{
            color: "#3b82f6",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "1.5rem",
          }}
        >
          MovieSocial
        </a>

        <form
          onSubmit={handleSearch}
          style={{
            flex: 1,
            display: "flex",
            gap: "0.75rem",
            justifyContent: "center",
          }}
        >
          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "0.7rem",
              width: "260px",
              borderRadius: "999px",
              border: "1px solid #333",
              backgroundColor: "#111",
              color: "white",
            }}
          />

          <button
            type="submit"
            style={{
              padding: "0.7rem 1.2rem",
              borderRadius: "999px",
              border: "1px solid white",
              backgroundColor: "white",
              color: "black",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Search
          </button>
        </form>
      </div>

      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}

      {error && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {movies.map((movie) => (
          <div
            key={movie.id}
            style={{
              backgroundColor: "#111",
              border: "1px solid #333",
              borderRadius: "12px",
              padding: "1rem",
            }}
          >
            {movie.poster && (
              <img
                src={movie.poster}
                alt={movie.title}
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                }}
              />
            )}

            <h2 style={{ marginBottom: "0.5rem" }}>{movie.title}</h2>

            <p style={{ color: "#aaa", marginBottom: "1rem" }}>
              {movie.release_date || "No release date"}
            </p>

            <p style={{ fontSize: "0.9rem", lineHeight: "1.4" }}>
              {movie.overview || "No overview available."}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}