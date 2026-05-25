import Image from "next/image";

type MovieItem = {
  id: number;
  title: string;
  description?: string;
  releaseDate?: string;
  poster?: string;
};

async function getPopularMovies(): Promise<MovieItem[]> {
  const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!rawBaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
  }

  const baseUrl = rawBaseUrl.replace(/\/$/, "");

  const response = await fetch(`${baseUrl}/movies/search?page=1`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to fetch popular movies: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  const data = await response.json();

  return data.results ?? [];
}

export default async function BrowsePage() {
  const movies = await getPopularMovies();

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Browse Popular Movies</h1>
      <p>Explore popular movies before searching.</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "1rem",
          marginTop: "1.5rem",
        }}
      >
        {movies.map((movie) => (
          <a
            key={movie.id}
            href={`/movies/${movie.id}`}
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "1rem",
              textDecoration: "none",
              color: "inherit",
              display: "block",
            }}
          >
            {movie.poster && (
              <Image
                src={movie.poster}
                alt={movie.title}
                width={500}
                height={750}
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "8px",
                  marginBottom: "0.75rem",
                }}
              />
            )}

            <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
              {movie.title}
            </h2>

            {movie.releaseDate && <p>{movie.releaseDate}</p>}

            {movie.description && (
              <p>
                {movie.description.length > 120
                  ? `${movie.description.slice(0, 120)}...`
                  : movie.description}
              </p>
            )}
          </a>
        ))}
      </div>
    </main>
  );
}