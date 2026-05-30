/* eslint-disable react-hooks/set-state-in-effect */
"use client";

// search
"use client";
//search
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

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

function SearchContent() {
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const [type, setType] = useState(searchParams.get("type") || "movies");
  const [items, setItems] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

      if (query) {
        runSearch(query, searchType);
      }
    }, [searchParams]);

  async function handleSearch(event: React.FormEvent) {
    event.preventDefault();

    if (!search.trim()) {
      return;
    }

    await runSearch(search, type);
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
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
          <Link
      href="/"
      style={{
        color: "#3b82f6",
        textDecoration: "none",
        fontWeight: "bold",
        fontSize: "1.5rem",
      }}
    >
      MovieSocial
    </Link>

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
        {items.map((item) => {
          const title = item.title || item.name || "Untitled";
          const poster = item.poster || item.posterUrl;
          const description = item.overview || item.description;
          const date = item.release_date || item.releaseDate || item.firstAirDate;

          const currentSearchUrl = `/search?type=${type}&q=${encodeURIComponent(search)}`;

          const href =
            type === "shows"
              ? `/shows/${item.id}?from=${encodeURIComponent(currentSearchUrl)}`
              : `/movies/${item.id}?from=${encodeURIComponent(currentSearchUrl)}`;

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
}