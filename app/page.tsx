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
      <h1
        style={{
          color: "#3b82f6",
          margin: 0,
          fontSize: "1.8rem",
        }}
      >
        MovieSocial
      </h1>

      <form
        action="/search"
        style={{
          flex: 1,
          display: "flex",
          gap: "0.75rem",
          justifyContent: "center",
        }}
      >
        <input
          name="q"
          type="text"
          placeholder="Search movies..."
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

    <h2 style={{ marginBottom: "0.5rem" }}>Popular Movies</h2>

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
            border: "1px solid #333",
            backgroundColor: "#111",
            borderRadius: "12px",
            padding: "1rem",
            textDecoration: "none",
            color: "white",
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