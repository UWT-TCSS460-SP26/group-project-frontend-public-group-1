"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type EnrichedReview = {
  id: number;
  tmdbId: number;
  mediaType: "MOVIE" | "TV";
  title: string;
  body: string;
  score: number;
  createdAt: string;
  displayTitle: string;
  displayPoster?: string;
};

type ReviewCardProps = {
  review: EnrichedReview;
  accessToken: string;
};

export default function ReviewCard({ review, accessToken }: ReviewCardProps) {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(review.title);
  const [body, setBody] = useState(review.body);
  const [score, setScore] = useState(review.score);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");

  async function handleSave() {
    setError("");

    if (!title.trim() || !body.trim()) {
      setError("Title and body are required.");
      return;
    }

    if (score < 1 || score > 10) {
      setError("Score must be between 1 and 10.");
      return;
    }

    if (!baseUrl) {
      setError("Missing API base URL.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`${baseUrl}/reviews/${review.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          body,
          score,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to update review: ${response.status}`);
      }

      setIsEditing(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update review.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm("Are you sure you want to delete this review?");

    if (!confirmed) {
      return;
    }

    if (!baseUrl) {
      setError("Missing API base URL.");
      return;
    }

    setError("");
    setIsDeleting(true);

    try {
      const response = await fetch(`${baseUrl}/reviews/${review.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to delete review: ${response.status}`);
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete review.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex gap-6 p-5 border border-[#333] rounded-xl bg-[#181818] shadow-sm">
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
        <div className="flex justify-between items-start gap-4">
          <div>
            <Link
              href={
                review.mediaType === "MOVIE"
                  ? `/movies/${review.tmdbId}`
                  : `/shows/${review.tmdbId}`
              }
              className="text-xl font-bold text-blue-400 hover:underline"
            >
              {review.displayTitle}
            </Link>

            <div className="flex items-center gap-3 mt-1">
              <span className="px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-black border border-yellow-200">
                {score}/10
              </span>

              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setTitle(review.title);
                    setBody(review.body);
                    setScore(review.score);
                    setError("");
                  }}
                  disabled={isSaving}
                  className="px-4 py-1.5 text-xs font-bold text-gray-300 border border-[#444] rounded-lg hover:bg-[#222] disabled:opacity-50"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-1.5 text-xs font-bold text-gray-300 border border-[#444] rounded-lg hover:bg-[#222] transition-all"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-1.5 text-xs font-bold text-red-400 border border-red-900 rounded-lg hover:bg-[#2a1111] transition-all disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-1">
                Review Title
              </label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="w-full border border-[#444] rounded-lg px-3 py-2 text-white bg-[#222]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-1">
                Review Body
              </label>
              <textarea
                value={body}
                onChange={(event) => setBody(event.target.value)}
                className="w-full border border-[#444] rounded-lg px-3 py-2 text-white bg-[#222]"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-1">
                Score
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={score}
                onChange={(event) => setScore(Number(event.target.value))}
                className="w-24 border border-[#444] rounded-lg px-3 py-2 text-white bg-[#222]"
              />
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <h4 className="text-md font-bold text-white italic">
              &quot;{review.title}&quot;
            </h4>

            <p className="mt-2 text-sm text-gray-300 leading-relaxed">
              {review.body}
            </p>
          </div>
        )}

        {error && (
          <p className="mt-3 text-sm font-medium text-red-400">{error}</p>
        )}
      </div>
    </div>
  );
}