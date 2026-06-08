import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

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

async function getMovieDetail(id: string): Promise<MovieDetail> {
  const baseUrl = await getBaseUrl();

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

async function getMovieReviews(id: string): Promise<Review[]> {
  const baseUrl = await getBaseUrl();

  const response = await fetch(
    `${baseUrl}/reviews?tmdbId=${id}&mediaType=MOVIE`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return data.results ?? [];
}

export default async function MovieDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string; reviewStatus?: string }>;
}) {
  const { id } = await params;
  const { from, reviewStatus } = await searchParams;
  const movie = await getMovieDetail(id);
  const reviews = await getMovieReviews(id);
  const session = await auth();

  async function createMovieReview(formData: FormData) {
    "use server";

    const session = await auth();
    const token = getAccessToken(session as SessionWithAccessToken | null);

    if (!token) {
      redirect(`/movies/${id}?reviewStatus=signin`);
    }

    const title = String(formData.get("title") || "").trim();
    const body = String(formData.get("body") || "").trim();
    const score = Number(formData.get("score"));

    if (!title || !body || score < 1 || score > 10) {
      redirect(`/movies/${id}?reviewStatus=invalid`);
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
        mediaType: "MOVIE",
        title,
        body,
        score,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Movie review submit failed:", response.status, errorText);
      redirect(`/movies/${id}?reviewStatus=error`);
    }

    redirect("/browse/movies?reviewStatus=success");
  }

  return (
    <main className="py-12">
      <Container>
        <Link 
          href={from || "/browse/movies"} 
          className="inline-flex items-center text-brand-blue font-bold mb-8 hover:underline"
        >
          ← Back to Catalog
        </Link>

        <section className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-12 items-start">
          {movie.poster && (
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src={movie.poster}
                alt={movie.title}
                fill
                priority
                className="object-cover"
              />
            </div>
          )}

          <div>
            <h1 className="text-5xl font-black mb-6 tracking-tight">{movie.title}</h1>

            <div className="flex flex-wrap gap-4 mb-8">
              {movie.releaseDate && (
                <div className="bg-surface border border-border px-3 py-1 rounded-full text-sm font-semibold">
                  {movie.releaseDate.split("-")[0]}
                </div>
              )}
              {movie.runtime && (
                <div className="bg-surface border border-border px-3 py-1 rounded-full text-sm font-semibold">
                  {movie.runtime} min
                </div>
              )}
              {movie.rating && (
                <div className="bg-brand-blue/10 border border-brand-blue/30 px-3 py-1 rounded-full text-sm font-bold text-brand-blue">
                  {movie.rating} TMDB
                </div>
              )}
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <p className="text-text-secondary mb-6">
                <span className="text-text-muted">Genres:</span> {movie.genres.join(", ")}
              </p>
            )}

            {movie.description && (
              <div className="mb-10">
                <h2 className="text-xl font-bold mb-3">Overview</h2>
                <p className="text-text-secondary leading-relaxed text-lg">{movie.description}</p>
              </div>
            )}

            <Card hoverable={false} className="p-8 mb-10">
              <h2 className="text-2xl font-black mb-1">Rate this movie</h2>
              <p className="text-text-secondary mb-8">
                Share your rating and thoughts with other viewers.
              </p>

              {reviewStatus === "success" && (
                <div className="mb-6 p-4 rounded-xl bg-green-900/30 border border-green-500/50 text-green-200 font-bold">
                  Review submitted successfully.
                </div>
              )}

              {(reviewStatus === "invalid" || reviewStatus === "error") && (
                <div className="mb-6 p-4 rounded-xl bg-red-900/30 border border-red-500/50 text-red-200 font-bold">
                  {reviewStatus === "invalid" 
                    ? "Please enter a title, review, and score from 1 to 10."
                    : "Could not submit your review. Please try again later."}
                </div>
              )}

              {session ? (
                <form action={createMovieReview} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-6">
                    <div>
                      <label className="block text-sm font-bold mb-2 text-text-muted">Score (1-10)</label>
                      <Input
                        name="score"
                        type="number"
                        min="1"
                        max="10"
                        defaultValue="10"
                        required
                      />
                    </div>
                    <div className="flex-grow">
                      <label className="block text-sm font-bold mb-2 text-text-muted">Review Title</label>
                      <Input
                        name="title"
                        type="text"
                        placeholder="Short review title"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2 text-text-muted">Your Review</label>
                    <Input
                      as="textarea"
                      name="body"
                      placeholder="Write your thoughts..."
                      required
                      className="min-h-[120px] resize-none"
                    />
                  </div>

                  <Button type="submit" variant="secondary" className="w-full sm:w-auto">
                    Post Review
                  </Button>
                </form>
              ) : (
                <div className="text-center py-6">
                  <p className="text-text-secondary mb-6">
                    Sign in to rate and review this movie.
                  </p>
                  <form
                    action={async () => {
                      "use server";
                      await signIn("tcss460");
                    }}
                  >
                    <Button type="submit" variant="secondary">
                      Sign In to Review
                    </Button>
                  </form>
                </div>
              )}
            </Card>

            <div className="space-y-6">
              <h3 className="text-2xl font-black">Community Reviews</h3>

              {reviews.length === 0 ? (
                <p className="text-text-muted italic">No reviews yet. Be the first to share your thoughts!</p>
              ) : (
                <div className="grid gap-4">
                  {reviews.map((review) => (
                    <Card key={review.id} className="bg-surface/50">
                      <div className="flex justify-between items-start mb-2">
                        <strong className="text-lg">{review.title}</strong>
                        <span className="bg-brand-blue text-white text-xs font-black px-2 py-1 rounded">
                          {review.score}/10
                        </span>
                      </div>
                      <p className="text-text-secondary leading-relaxed mb-4">{review.body}</p>
                      {review.author?.name && (
                        <p className="text-text-muted text-sm font-semibold">— {review.author.name}</p>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}
