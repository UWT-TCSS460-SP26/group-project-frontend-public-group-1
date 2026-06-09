"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

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
    <div className="grid w-full max-w-full grid-cols-[80px_minmax(0,1fr)] gap-4 overflow-hidden sm:flex sm:gap-6">
      {review.displayPoster ? (
        <div className="w-20 flex-shrink-0 overflow-hidden rounded-lg shadow-lg sm:w-24">
          <Image
            src={review.displayPoster}
            alt={review.displayTitle}
            width={96}
            height={144}
            className="aspect-[2/3] w-full object-cover"
          />
        </div>
      ) : (
        <div className="w-20 flex-shrink-0 rounded-lg bg-background-secondary sm:w-24" />
      )}

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 flex-col items-start justify-between gap-4 sm:flex-row">
          <div className="min-w-0 flex-1">
            <Link
              href={
                review.mediaType === "MOVIE"
                  ? `/movies/${review.tmdbId}`
                  : `/shows/${review.tmdbId}`
              }
              className="block max-w-full break-words text-lg font-black text-text-primary transition-colors hover:text-brand-blue sm:text-xl"
            >
              {review.displayTitle}
            </Link>

            <div className="mt-1 flex flex-wrap items-center gap-3">
              <span className="rounded bg-brand-blue px-2 py-0.5 text-[10px] font-black text-white">
                {score}/10
              </span>

              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {isEditing ? (
              <>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  variant="secondary"
                >
                  {isSaving ? "Saving..." : "Save"}
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsEditing(false);
                    setTitle(review.title);
                    setBody(review.body);
                    setScore(review.score);
                    setError("");
                  }}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-red-400 hover:bg-red-900/20 hover:text-red-300"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[100px_1fr]">
              <div>
                <label className="mb-1 block text-[10px] font-black uppercase text-text-muted">
                  Score
                </label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={score}
                  onChange={(event) => setScore(Number(event.target.value))}
                  className="py-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-black uppercase text-text-muted">
                  Review Title
                </label>
                <Input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="py-2"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-black uppercase text-text-muted">
                Your Review
              </label>
              <Input
                as="textarea"
                value={body}
                onChange={(event) => setBody(event.target.value)}
                className="min-h-[100px] resize-none py-2"
              />
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <h4 className="break-words text-md font-bold italic text-text-primary">
              &ldquo;{review.title}&rdquo;
            </h4>

            <p className="mt-2 line-clamp-4 break-words text-sm leading-relaxed text-text-secondary">
              {review.body}
            </p>
          </div>
        )}

        {error && <p className="mt-3 text-xs font-bold text-red-400">{error}</p>}
      </div>
    </div>
  );
}