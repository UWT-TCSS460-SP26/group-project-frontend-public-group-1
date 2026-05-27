"use client";

import { useState } from "react";

type SearchItem = {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  description?: string;
  release_date?: string;
  releaseDate?: string;
  firstAirDate?: string;
  poster?: string;
  posterUrl?: string;
};

export default function SearchPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("movies");
  const [items, setItems] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

<<<<<<< Updated upstream
=======
  async function runSearch(query: string, searchType: string) {
    try {
      setLoading(true);
      setError("");

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");

      if (!baseUrl) {
        throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
      }

      const path = searchType === "shows" ? "/shows/search" : "/movies/search";
      const searchKey = searchType === "shows" ? "name" : "title";
      const url = `${baseUrl}${path}?${searchKey}=${encodeURIComponent(query)}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch results");
      }

      const data = await response.json();
      setItems(data.results || data);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while searching.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const query = searchParams.get("q");
    const searchType = searchParams.get("type") || "movies";

    setType(searchType);

    if (query) {
      setSearch(query);
      runSearch(query, searchType);
    }
  }, [searchParams]);

>>>>>>> Stashed changes
  async function handleSearch(event: React.FormEvent) {
    event.preventDefault();

    if (!search.trim()) {
      return;
    }

<<<<<<< Updated upstream
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
=======
    await runSearch(search, type);
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
          gap: "1rem",
          flexWrap: "wrap",
>>>>>>> Stashed changes
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
            flexWrap: "wrap",
          }}
        >
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={inputStyle}
          >
            <option value="movies">Movies</option>
            <option value="shows">TV Shows</option>
          </select>

          <input
            type="text"
            placeholder={`Search ${type === "movies" ? "movies" : "TV shows"}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...inputStyle, width: "260px" }}
          />

          <button type="submit" style={buttonStyle}>
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
<<<<<<< Updated upstream
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
=======
        {items.map((item) => {
          const title = item.title || item.name || "Untitled";
          const poster = item.poster || item.posterUrl;
          const description = item.overview || item.description;
          const date = item.release_date || item.releaseDate || item.firstAirDate;
>>>>>>> Stashed changes

          const currentSearchUrl = `/search?type=${type}&q=${encodeURIComponent(search)}`;

          const href =
            type === "shows"
              ? `/shows/${item.id}?from=${encodeURIComponent(currentSearchUrl)}`
              : `/movies/${item.id}?from=${encodeURIComponent(currentSearchUrl)}`;

<<<<<<< Updated upstream
            <p style={{ fontSize: "0.9rem", lineHeight: "1.4" }}>
              {movie.overview || "No overview available."}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
=======
          return (
            <a key={item.id} href={href} style={cardStyle}>
              {poster && (
                <img
                  src={poster}
                  alt={title}
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    marginBottom: "1rem",
                  }}
                />
              )}

              <h2 style={{ marginBottom: "0.5rem" }}>{title}</h2>

              <p style={{ color: "#aaa", marginBottom: "1rem" }}>
                {date || "No release date"}
              </p>

              <p style={{ fontSize: "0.9rem", lineHeight: "1.4" }}>
                {description || "No overview available."}
              </p>
            </a>
          );
        })}
      </div>
    </main>
  );
}

const inputStyle = {
  padding: "0.7rem",
  borderRadius: "999px",
  border: "1px solid #333",
  backgroundColor: "#111",
  color: "white",
};

const buttonStyle = {
  padding: "0.7rem 1.2rem",
  borderRadius: "999px",
  border: "1px solid white",
  backgroundColor: "white",
  color: "black",
  cursor: "pointer",
  fontWeight: "bold",
};

const cardStyle = {
  backgroundColor: "#111",
  border: "1px solid #333",
  borderRadius: "12px",
  padding: "1rem",
  textDecoration: "none",
  color: "white",
  display: "block",
};

export default function SearchPage() {
  return (
    <Suspense fallback={<main style={{ padding: "2rem" }}>Loading...</main>}>
      <SearchContent />
    </Suspense>
  );
>>>>>>> Stashed changes
}