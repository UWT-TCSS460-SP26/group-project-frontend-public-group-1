import Image from "next/image";

type ShowItem = {
  id: number;
  title: string;
  description?: string;
  releaseDate?: string;
  poster?: string;
};

async function getPopularTVShows(): Promise<ShowItem[]> {
  const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!rawBaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
  }

  const baseUrl = rawBaseUrl.replace(/\/$/, "");

  const response = await fetch(`${baseUrl}/shows/search?page=1`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to fetch popular TV shows: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  const data = await response.json();

  return data.results ?? [];
}

export default async function BrowseTVPage() {
  const shows = await getPopularTVShows();

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Browse Popular TV Shows</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "1rem",
          marginTop: "1.5rem",
        }}
      >
        {shows.map((show) => (
          <a
            key={show.id}
            href={`/shows/${show.id}`}
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "1rem",
              textDecoration: "none",
              color: "inherit",
              display: "block",
            }}
          >
            {show.poster && (
              <Image
                src={show.poster}
                alt={show.title}
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
              {show.title}
            </h2>

            {show.releaseDate && <p>{show.releaseDate}</p>}

            {show.description && (
              <p>
                {show.description.length > 120
                  ? `${show.description.slice(0, 120)}...`
                  : show.description}
              </p>
            )}
          </a>
        ))}
      </div>
    </main>
  );
}