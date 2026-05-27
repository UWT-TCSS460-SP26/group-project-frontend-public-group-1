import Image from "next/image";
import Link from "next/link";

type ShowDetail = {
  id: number;
  name: string;
  description?: string;
  posterUrl?: string;
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
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { id } = await params;
  const { from } = await searchParams;
  const show = await getShowDetail(id);

  return (
    <main style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
      <Link href={from || "/?type=shows"}>← Back to TV Shows</Link>

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

          {show.status && (
            <p>
              <strong>Status:</strong> {show.status}
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
              padding: "1rem",
              border: "1px solid #444",
              borderRadius: "12px",
              background: "#1f1f1f",
              color: "#f5f5f5",
            }}
          >
            <h2 style={{ marginBottom: "0.5rem" }}>Ratings & Reviews</h2>
            <p style={{ color: "#d1d1d1" }}>
              Rating and review features are coming in Sprint 7.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}