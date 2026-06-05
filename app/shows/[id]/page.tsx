import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";

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

type Review = {
  id: number;
  title: string;
  body: string;
  score: number;
  author?: {
    name?: string;
    email?: string;
  };
};

async function getBaseUrl() {
  const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!rawBaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
  }

  return rawBaseUrl.replace(/\/$/, "");
}

type SessionWithAccessToken = {
  accessToken?: string | { value?: string };
  user?: {
    accessToken?: string | { value?: string };
  };
};

function getTokenValue(token?: string | { value?: string }): string | undefined {
  if (typeof token === "string") {
    return token;
  }

  return token?.value;
}

function getAccessToken(session: SessionWithAccessToken | null): string | undefined {
  return getTokenValue(session?.accessToken) ?? getTokenValue(session?.user?.accessToken);
}

async function getShowDetail(id: string): Promise<ShowDetail> {
  const baseUrl = await getBaseUrl();

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

async function getShowReviews(id: string): Promise<Review[]> {
  const baseUrl = await getBaseUrl();

  const response = await fetch(`${baseUrl}/reviews?tmdbId=${id}&mediaType=TV`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return data.results ?? [];
}

export default async function ShowDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string; reviewStatus?: string }>;
}) {
  const { id } = await params;
  const { from, reviewStatus } = await searchParams;
  const show = await getShowDetail(id);
  const reviews = await getShowReviews(id);
  const session = await auth();

  async function createShowReview(formData: FormData) {
    "use server";

    const session = await auth();
    const token = getAccessToken(session as SessionWithAccessToken | null);

    if (!token) {
      redirect(`/shows/${id}?reviewStatus=signin`);
    }

    const title = String(formData.get("title") || "").trim();
    const body = String(formData.get("body") || "").trim();
    const score = Number(formData.get("score"));

    if (!title || !body || score < 1 || score > 10) {
      redirect(`/shows/${id}?reviewStatus=invalid`);
    }

    const baseUrl = await getBaseUrl();

    const response = await fetch(`${baseUrl}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        tmdbId: Number(id),
        mediaType: "TV",
        title,
        body,
        score,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Show review submit failed:", response.status, errorText);
      redirect(`/shows/${id}?reviewStatus=error`);
    }

    redirect("/browse/shows?reviewStatus=success"); 
  }

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

          <div style={reviewBoxStyle}>
            <h2 style={{ marginBottom: "0.25rem" }}>Rate this show</h2>
            <p style={{ color: "#aaa", marginBottom: "1.5rem" }}>
              Share your rating and thoughts with other viewers.
            </p>

            {reviewStatus === "success" && (
              <p style={{ color: "#86efac" }}>Review submitted successfully.</p>
            )}

            {reviewStatus === "invalid" && (
              <p style={{ color: "#fca5a5" }}>
                Please enter a title, review, and score from 1 to 10.
              </p>
            )}

            {reviewStatus === "error" && (
              <p style={{ color: "#fca5a5" }}>
                Could not submit your review. Check the terminal for the API error.
              </p>
            )}

            {session ? (
              <form action={createShowReview}>
                <label style={labelStyle}>Rating Score</label>
                <input
                  name="score"
                  type="number"
                  min="1"
                  max="10"
                  defaultValue="10"
                  required
                  style={inputStyle}
                />

                <label style={labelStyle}>Review Title</label>
                <input
                  name="title"
                  type="text"
                  placeholder="Short review title"
                  required
                  style={inputStyle}
                />

                <label style={labelStyle}>Review</label>
                <textarea
                  name="body"
                  placeholder="Write your thoughts..."
                  required
                  style={{
                    ...inputStyle,
                    minHeight: "100px",
                    borderRadius: "10px",
                    resize: "vertical",
                  }}
                />

                <button type="submit" style={buttonStyle}>
                  Post Review
                </button>
              </form>
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
                  <button type="submit" style={buttonStyle}>
                    Sign In
                  </button>
                </form>
              </div>
            )}

            <div style={{ marginTop: "2rem" }}>
              <h3>Community Reviews</h3>

              {reviews.length === 0 ? (
                <p style={{ color: "#d1d1d1" }}>No reviews yet.</p>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} style={reviewCardStyle}>
                    <strong>{review.title}</strong>
                    <p>Score: {review.score}/10</p>
                    <p>{review.body}</p>
                    {review.author?.name && (
                      <p style={{ color: "#aaa" }}>By {review.author.name}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

const reviewBoxStyle = {
  marginTop: "2rem",
  padding: "1.5rem",
  border: "1px solid #333",
  borderRadius: "14px",
  background: "#1f1f1f",
  color: "#f5f5f5",
};

const labelStyle = {
  display: "block",
  marginTop: "1rem",
  marginBottom: "0.5rem",
  fontWeight: "bold",
};

const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "8px",
  border: "1px solid #444",
  backgroundColor: "#111",
  color: "white",
};

const buttonStyle = {
  marginTop: "1rem",
  padding: "0.75rem 1.5rem",
  backgroundColor: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontWeight: "bold",
  cursor: "pointer",
};

const reviewCardStyle = {
  marginTop: "1rem",
  padding: "1rem",
  border: "1px solid #333",
  borderRadius: "10px",
  backgroundColor: "#111",
};