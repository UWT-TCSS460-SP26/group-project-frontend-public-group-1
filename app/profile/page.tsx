import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import ReviewCard from "@/components/profile/ReviewCard";

type Review = {
  id: number;
  tmdbId: number;
  mediaType: "MOVIE" | "TV";
  title: string;
  body: string;
  score: number;
  createdAt: string;
};

type EnrichedReview = Review & {
  displayTitle: string;
  displayPoster?: string;
};

function getAccessToken(session: unknown): string {
  return (
    (session as any)?.accessToken?.value ||
    (session as any)?.accessToken ||
    (session as any)?.user?.accessToken?.value ||
    (session as any)?.user?.accessToken ||
    ""
  );
}

async function getMyReviews(accessToken: string): Promise<EnrichedReview[]> {
  const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!rawBaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
  }

  const baseUrl = rawBaseUrl.replace(/\/$/, "");

  const reviewsResponse = await fetch(`${baseUrl}/reviews/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!reviewsResponse.ok) {
    if (reviewsResponse.status === 401) return [];
    throw new Error(`Failed to fetch reviews: ${reviewsResponse.status}`);
  }

  const reviews: Review[] = await reviewsResponse.json();

  return Promise.all(
    reviews.map(async (review) => {
      try {
        const endpoint = review.mediaType === "MOVIE" ? "movies" : "shows";

        const metaResponse = await fetch(
          `${baseUrl}/${endpoint}/${review.tmdbId}`,
          { cache: "force-cache" },
        );

        if (metaResponse.ok) {
          const meta = await metaResponse.json();

          return {
            ...review,
            displayTitle: meta.title || meta.name || "Unknown Title",
            displayPoster: meta.poster || meta.posterUrl,
          };
        }
      } catch (error) {
        console.error(`Failed to enrich review ${review.id}:`, error);
      }

      return { ...review, displayTitle: "Unknown Title" };
    }),
  );
}

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const accessToken = getAccessToken(session);
  const reviews = await getMyReviews(accessToken);
  const initial = session.user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#050505",
        color: "white",
        padding: "2rem",
      }}
    >
      <section
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            backgroundColor: "#111",
            border: "1px solid #2a2a2a",
            borderRadius: "24px",
            padding: "2rem",
            boxShadow: "0 20px 40px rgba(0,0,0,0.45)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.25rem",
              marginBottom: "2rem",
              borderBottom: "1px solid #2a2a2a",
              paddingBottom: "1.5rem",
            }}
          >
            <div
              style={{
                width: "84px",
                height: "84px",
                borderRadius: "999px",
                background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.2rem",
                fontWeight: "bold",
              }}
            >
              {initial}
            </div>

            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "2rem",
                  color: "white",
                }}
              >
                Your Profile
              </h1>

              <p
                style={{
                  marginTop: "0.4rem",
                  color: "#aaa",
                }}
              >
                {session.user?.email}
              </p>
            </div>
          </div>

          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "1.6rem",
                color: "white",
              }}
            >
              Reviews & Ratings
            </h2>

            <p
              style={{
                marginTop: "0.4rem",
                marginBottom: "1.5rem",
                color: "#aaa",
              }}
            >
              Manage all of your movie and TV show reviews in one place.
            </p>

            {reviews.length === 0 ? (
              <div
                style={{
                  padding: "2rem",
                  borderRadius: "18px",
                  backgroundColor: "#181818",
                  border: "1px dashed #333",
                  textAlign: "center",
                }}
              >
                <h3 style={{ marginTop: 0 }}>No reviews yet</h3>

                <p style={{ color: "#aaa" }}>
                  Start exploring movies and TV shows, then leave a rating or
                  review.
                </p>

                <Link
                  href="/"
                  style={{
                    display: "inline-block",
                    marginTop: "1rem",
                    padding: "0.75rem 1.25rem",
                    borderRadius: "999px",
                    backgroundColor: "#2563eb",
                    color: "white",
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  Browse Trending
                </Link>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gap: "1rem",
                }}
              >
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    style={{
                      backgroundColor: "#181818",
                      border: "1px solid #333",
                      borderRadius: "18px",
                      padding: "1rem",
                    }}
                  >
                    <ReviewCard review={review} accessToken={accessToken} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}