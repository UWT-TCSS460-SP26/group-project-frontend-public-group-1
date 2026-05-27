import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

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

async function getMyReviews(accessToken: string): Promise<EnrichedReview[]> {
  const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!rawBaseUrl) throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
  const baseUrl = rawBaseUrl.replace(/\/$/, "");

  // 1. Fetch user's reviews
  const reviewsResponse = await fetch(`${baseUrl}/reviews/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!reviewsResponse.ok) {
    if (reviewsResponse.status === 401) return [];
    throw new Error(`Failed to fetch reviews: ${reviewsResponse.status}`);
  }

  const reviews: Review[] = await reviewsResponse.json();

  // 2. Enrich with TMDB metadata
  const enrichedReviews = await Promise.all(
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
      } catch (e) {
        console.error(`Failed to enrich review ${review.id}:`, e);
      }
      return { ...review, displayTitle: "Unknown Title" };
    }),
  );

  return enrichedReviews;
}

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const reviews = await getMyReviews(session.accessToken as string);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">User Profile</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Top Section: Account & JWT Info */}
        <div className="p-8 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Account Details</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="text-lg text-gray-900">{session.user?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <p className="text-lg text-gray-900">{session.user.role || "User"}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-red-700 border-b pb-2">Verification Info (JWT)</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Access Token</label>
                  <textarea 
                    readOnly 
                    className="w-full h-20 p-2 mt-1 text-[10px] font-mono border border-gray-300 rounded bg-gray-50 text-gray-900"
                    value={session.accessToken || "No access token found"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">ID Token</label>
                  <textarea 
                    readOnly 
                    className="w-full h-20 p-2 mt-1 text-[10px] font-mono border border-gray-300 rounded bg-gray-50 text-gray-900"
                    value={session.idToken || "No ID token found"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Activity */}
        <div className="p-8 bg-gray-50">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">My Activity</h2>
          
          {reviews.length === 0 ? (
            <p className="text-gray-500 italic">You haven't rated or reviewed anything yet.</p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="flex gap-6 p-5 border border-gray-200 rounded-xl bg-white shadow-sm">
                  {review.displayPoster && (
                    <div className="flex-shrink-0 w-24">
                      <Image 
                        src={review.displayPoster} 
                        alt={review.displayTitle} 
                        width={96} 
                        height={144} 
                        className="rounded-lg shadow-md"
                      />
                    </div>
                  )}
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link 
                          href={review.mediaType === "MOVIE" ? `/movies/${review.tmdbId}` : `/shows/${review.tmdbId}`}
                          className="text-xl font-bold text-blue-600 hover:underline"
                        >
                          {review.displayTitle}
                        </Link>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-black border border-yellow-200">
                            {review.score}/10
                          </span>
                          <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-4 py-1.5 text-xs font-bold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
                          Edit
                        </button>
                        <button className="px-4 py-1.5 text-xs font-bold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-all">
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-md font-bold text-gray-800 italic">"{review.title}"</h4>
                      <p className="mt-2 text-sm text-gray-600 leading-relaxed">{review.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
