import Image from "next/image";
import Link from "next/link";
import { auth, signIn } from "@/auth";

type MovieDetail = {
  id: number;
  title: string;
  description?: string;
  releaseDate?: string;
  poster?: string;
  genres?: string[];
  runtime?: number;
  rating?: number;
};

async function getMovieDetail(id: string): Promise<MovieDetail> {
  const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!rawBaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
  }

  const baseUrl = rawBaseUrl.replace(/\/$/, "");

  const response = await fetch(`${baseUrl}/movies/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to fetch movie details: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  return response.json();
}

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movie = await getMovieDetail(id);
  const session = await auth();

  return (
    <main style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
      <Link href="/browse">← Back to Browse</Link>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(220px, 320px) 1fr",
          gap: "2rem",
          marginTop: "2rem",
          alignItems: "start",
        }}
      >
        {movie.poster && (
          <Image
            src={movie.poster}
            alt={movie.title}
            width={500}
            height={750}
            priority
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "12px",
            }}
          />
        )}

        <div>
          <h1>{movie.title}</h1>

          {movie.releaseDate && (
            <p>
              <strong>Release Date:</strong> {movie.releaseDate}
            </p>
          )}

          {movie.runtime && (
            <p>
              <strong>Runtime:</strong> {movie.runtime} minutes
            </p>
          )}

          {movie.rating && (
            <p>
              <strong>TMDB Rating:</strong> {movie.rating}/10
            </p>
          )}

          {movie.genres && movie.genres.length > 0 && (
            <p>
              <strong>Genres:</strong> {movie.genres.join(", ")}
            </p>
          )}

          {movie.description && (
            <>
              <h2>Overview</h2>
              <p>{movie.description}</p>
            </>
          )}

          <div
            style={{
              marginTop: "2rem",
              padding: "1.5rem",
              border: "1px solid #444",
              borderRadius: "12px",
              background: "#1f1f1f",
              color: "#f5f5f5",
            }}
          >
            <h2 style={{ marginBottom: "1rem" }}>Ratings & Reviews</h2>
            
            {session ? (
              <p style={{ color: "#d1d1d1" }}>
                Rate and review features are coming in Sprint 7.
              </p>
            ) : (
              <div style={{ textAlign: "center", padding: "1rem" }}>
                <p style={{ color: "#d1d1d1", marginBottom: "1.5rem" }}>
                  Sign in to rate and review this movie.
                </p>
                <form
                  action={async () => {
                    "use server";
                    await signIn("tcss460");
                  }}
                >
                  <button
                    type="submit"
                    style={{
                      padding: "0.75rem 2rem",
                      backgroundColor: "#3b82f6",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Sign In
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}