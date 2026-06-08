import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import ReviewCard from "@/components/profile/ReviewCard";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

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

function getAccessToken(session: SessionWithAccessToken | null): string {
  return getTokenValue(session?.accessToken) ?? getTokenValue(session?.user?.accessToken) ?? "";
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

  const accessToken = getAccessToken(session as SessionWithAccessToken);
  const reviews = await getMyReviews(accessToken);
  const initial = session.user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <main className="py-12 min-h-screen">
      <Container>
        <Card hoverable={false} className="max-w-4xl mx-auto p-8 sm:p-12 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center gap-8 mb-10 pb-10 border-b border-border text-center sm:text-left">
            <div className="w-24 h-24 rounded-full bg-linear-to-br from-brand-blue to-purple-600 flex items-center justify-center text-4xl font-black shadow-lg">
              {initial}
            </div>

            <div>
              <h1 className="text-4xl font-black mb-2 tracking-tight">Your Profile</h1>
              <p className="text-text-secondary text-lg font-medium">{session.user?.email}</p>
            </div>
          </div>

          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-black mb-2">Reviews & Ratings</h2>
              <p className="text-text-secondary">
                Manage all of your movie and TV show reviews in one place.
              </p>
            </div>

            {reviews.length === 0 ? (
              <div className="py-16 px-8 rounded-2xl bg-surface border border-dashed border-border text-center">
                <h3 className="text-xl font-bold mb-3 text-text-primary">No reviews yet</h3>
                <p className="text-text-secondary mb-8 max-w-sm mx-auto">
                  Start exploring movies and TV shows, then leave a rating or review to see them here.
                </p>
                <Link href="/">
                  <Button variant="secondary">
                    Browse Trending
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-6">
                {reviews.map((review) => (
                  <Card key={review.id} className="bg-background/50 border-border/50">
                    <ReviewCard review={review} accessToken={accessToken} />
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Card>
      </Container>
    </main>
  );
}