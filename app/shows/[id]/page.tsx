import Image from "next/image";
import Link from "next/link";
import { auth, signIn } from "@/auth";

type ShowDetail = {
  id: number;
  name: string;
  description?: string;
  posterUrl?: string | null;
  firstAirDate?: string;
  lastAirDate?: string;
  numberOfSeasons?: number;
  numberOfEpisodes?: number;
  status?: string;
  networks?: string[];
  genres?: string[];
};

async function getShowDetail(id: string): Promise<ShowDetail> {
  const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!rawBaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
  }

  const baseUrl = rawBaseUrl.replace(/\/$/, "");

  const response = await fetch(`${baseUrl}/shows/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to fetch show details: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  return response.json();
}

export default async function ShowDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const show = await getShowDetail(id);
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
        {show.posterUrl && (
          <Image
            src={show.posterUrl}
            alt={show.name}
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
          <h1>{show.name}</h1>

          {show.firstAirDate && (
            <p>
              <strong>First Air Date:</strong> {show.firstAirDate}
            </p>
          )}

          {show.lastAirDate && (
            <p>
              <strong>Last Air Date:</strong> {show.lastAirDate}
            </p>
          )}

          {show.status && (
            <p>
              <strong>Status:</strong> {show.status}
            </p>
          )}

          {show.numberOfSeasons && (
            <p>
              <strong>Seasons:</strong> {show.numberOfSeasons}
            </p>
          )}

          {show.numberOfEpisodes && (
            <p>
              <strong>Episodes:</strong> {show.numberOfEpisodes}
            </p>
          )}

          {show.networks && show.networks.length > 0 && (
            <p>
              <strong>Networks:</strong> {show.networks.join(", ")}
            </p>
          )}

          {show.genres && show.genres.length > 0 && (
            <p>
              <strong>Genres:</strong> {show.genres.join(", ")}
            </p>
          )}

          {show.description && (
            <>
              <h2>Overview</h2>
              <p>{show.description}</p>
            </>
          )}

          <div
            style={{
              marginTop: "2rem",
              padding: "1.5rem",
              border: "1px solid #ddd",
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
                  Sign in to rate and review this show.
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