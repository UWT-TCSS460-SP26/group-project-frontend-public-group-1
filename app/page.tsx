import Image from "next/image";
import Link from "next/link";

type Item = {
  id: number;
  title?: string;
  name?: string;
  description?: string;
  releaseDate?: string;
  firstAirDate?: string;
  poster?: string;
  posterUrl?: string;
};

async function getTrending(type: string): Promise<Item[]> {
  const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!rawBaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
  }

  const baseUrl = rawBaseUrl.replace(/\/$/, "");
  const path =
    type === "shows" ? "/shows/search?page=1" : "/movies/search?page=1";

  const response = await fetch(`${baseUrl}${path}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch trending items");
  }

  const data = await response.json();
  return data.results ?? [];
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const type = params.type === "shows" ? "shows" : "movies";
  const items = await getTrending(type);

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "black",
        color: "white",
        padding: "2rem",
      }}
    >
      <section
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: "1.8rem" }}>
            {type === "shows" ? "Trending TV Shows" : "Trending Movies"}
          </h1>
          <p style={{ color: "#aaa", marginTop: "0.4rem" }}>
            Find your next favorite movie or show.
          </p>
        </div>

        <form
          action="/search"
          style={{
            display: "flex",
            gap: "0.75rem",
            flexWrap: "wrap",
          }}
        >
          <select name="type" defaultValue={type} style={inputStyle}>
            <option value="movies">Movies</option>
            <option value="shows">TV Shows</option>
          </select>

          <input
            name="q"
            type="text"
            placeholder={`Search ${type === "shows" ? "TV shows" : "movies"}...`}
            style={{ ...inputStyle, width: "260px" }}
          />

          <button type="submit" style={buttonStyle}>
            Search
          </button>
        </form>
      </section>

      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <Link href="/?type=movies" style={type === "movies" ? activeTab : tabStyle}>
          Movies
        </Link>

        <Link href="/?type=shows" style={type === "shows" ? activeTab : tabStyle}>
          TV Shows
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {items.map((item) => {
          const title = item.title || item.name || "Untitled";
          const poster = item.poster || item.posterUrl;
          const date = item.releaseDate || item.firstAirDate;
          const href =
            type === "shows" ? `/shows/${item.id}` : `/movies/${item.id}`;

          return (
            <Link key={item.id} href={href} style={cardStyle}>
              {poster && (
                <Image
                  src={poster}
                  alt={title}
                  width={500}
                  height={750}
                  style={{
                    width: "100%",
                    height: "270px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginBottom: "0.75rem",
                  }}
                />
              )}

              <h3 style={{ fontSize: "1rem", margin: "0 0 0.4rem" }}>
                {title}
              </h3>

              {date && <p style={{ color: "#aaa", margin: "0 0 0.5rem" }}>{date}</p>}

              {item.description && (
                <p style={{ color: "#ccc", fontSize: "0.9rem", lineHeight: "1.4" }}>
                  {item.description.slice(0, 90)}...
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </main>
  );
}

const inputStyle = {
  padding: "0.75rem 1rem",
  borderRadius: "999px",
  border: "1px solid #333",
  backgroundColor: "#111",
  color: "white",
};

const buttonStyle = {
  padding: "0.75rem 1.3rem",
  borderRadius: "999px",
  border: "1px solid white",
  backgroundColor: "white",
  color: "black",
  cursor: "pointer",
  fontWeight: "bold",
};

const tabStyle = {
  padding: "0.7rem 1.1rem",
  borderRadius: "999px",
  border: "1px solid #333",
  backgroundColor: "#111",
  color: "white",
  textDecoration: "none",
  fontWeight: "bold",
};

const activeTab = {
  ...tabStyle,
  backgroundColor: "#2563eb",
  borderColor: "#2563eb",
};

const cardStyle = {
  border: "1px solid #222",
  backgroundColor: "#111",
  borderRadius: "14px",
  padding: "0.75rem",
  textDecoration: "none",
  color: "white",
  display: "block",
};