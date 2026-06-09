import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import ReviewCard from "@/components/profile/ReviewCard";
import ProfileAvatarPicker from "@/components/profile/ProfileAvatarPicker";
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
  return (
    getTokenValue(session?.accessToken) ??
    getTokenValue(session?.user?.accessToken) ??
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
          {
            cache: "force-cache",
          },
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

      return {
        ...review,
        displayTitle: "Unknown Title",
      };
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
    <main className="min-h-screen py-12">
      <Container>
        <Card
          hoverable={false}
          className="mx-auto max-w-4xl p-8 shadow-2xl sm:p-12"
        >
          <div className="mb-10 flex flex-col items-center gap-8 border-b border-border pb-10 text-center sm:flex-row sm:text-left">
            <ProfileAvatarPicker initial={initial} />

            <div>
              <h1 className="mb-2 text-4xl font-black tracking-tight">
                Your Profile
              </h1>

              <p className="text-lg font-medium text-text-secondary">
                {session.user?.email}
              </p>
            </div>
          </div>

          <div>
            <div className="mb-8">
              <h2 className="mb-2 text-2xl font-black">
                Reviews & Ratings
              </h2>

              <p className="text-text-secondary">
                Manage all of your movie and TV show reviews in one place.
              </p>
            </div>

            {reviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-surface px-8 py-16 text-center">
                <h3 className="mb-3 text-xl font-bold text-text-primary">
                  No reviews yet
                </h3>

                <p className="mx-auto mb-8 max-w-sm text-text-secondary">
                  Start exploring movies and TV shows, then leave a rating or
                  review to see them here.
                </p>

                <Link href="/">
                  <Button variant="secondary">Browse Trending</Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-6">
                {reviews.map((review) => (
                  <Card
                    key={review.id}
                    className="border-border/50 bg-background/50"
                  >
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