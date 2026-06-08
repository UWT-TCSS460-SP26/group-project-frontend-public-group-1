/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { SearchForm } from "@/components/ui/SearchForm";

type SearchItem = {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  description?: string;
  release_date?: string;
  releaseDate?: string;
  firstAirDate?: string;
  poster?: string;
  posterUrl?: string;
};

function SearchContent() {
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [type, setType] = useState(searchParams.get("type") || "movies");
  const [items, setItems] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function runSearch(query: string, searchType: string) {
    try {
      setLoading(true);
      setError("");

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");

      if (!baseUrl) {
        throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
      }

      const path = searchType === "shows" ? "/shows/search" : "/movies/search";
      const searchKey = searchType === "shows" ? "name" : "title";
      const url = `${baseUrl}${path}?${searchKey}=${encodeURIComponent(query)}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch results");
      }

      const data = await response.json();
      setItems(data.results || data);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while searching.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const query = searchParams.get("q");
    const searchType = searchParams.get("type") || "movies";

    if (query) {
      runSearch(query, searchType);
    }
  }, [searchParams]);

  return (
    <main className="py-12 min-h-screen">
      <Container>
        <section className="mb-12">
          <div className="flex justify-between items-end gap-6 flex-wrap mb-8">
            <div>
              <h1 className="text-4xl font-black mb-2">Search Results</h1>
              <p className="text-text-secondary text-lg">
                Showing results for &ldquo;{searchParams.get("q") || search}&rdquo;
              </p>
            </div>

            <SearchForm initialType={type} initialQuery={search} />
          </div>
        </section>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="animate-pulse text-xl font-bold text-text-muted">Loading results...</div>
          </div>
        )}

        {error && (
          <div className="text-center py-20 bg-surface border border-border rounded-2xl">
            <p className="text-red-400 font-bold">{error}</p>
          </div>
        )}

        {!loading && !error && items.length === 0 && searchParams.get("q") && (
          <div className="text-center py-20 bg-surface border border-border rounded-2xl">
            <p className="text-text-secondary text-xl">No results found for your search.</p>
          </div>
        )}

        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
          {items.map((item) => {
            const title = item.title || item.name || "Untitled";
            const poster = item.poster || item.posterUrl;
            const description = item.overview || item.description;
            const date = item.release_date || item.releaseDate || item.firstAirDate;

            const currentSearchUrl = `/search?type=${type}&q=${encodeURIComponent(search)}`;

            const href =
              type === "shows"
                ? `/shows/${item.id}?from=${encodeURIComponent(currentSearchUrl)}`
                : `/movies/${item.id}?from=${encodeURIComponent(currentSearchUrl)}`;

            return (
              <Link key={item.id} href={href} className="group">
                <Card className="h-full flex flex-col p-3 group-hover:border-brand-blue">
                  {poster && (
                    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl mb-4">
                      <Image
                        src={poster}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, 200px"
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  )}

                  <h2 className="font-bold text-lg mb-1 line-clamp-1">
                    {title}
                  </h2>

                  {date && (
                    <p className="text-text-secondary text-sm mb-3">
                      {date.split("-")[0]}
                    </p>
                  )}

                  {description && (
                    <p className="text-text-muted text-sm line-clamp-3 leading-relaxed">
                      {description}
                    </p>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>
      </Container>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <Container className="py-20">
        <div className="animate-pulse text-center font-bold text-text-muted">Loading Search...</div>
      </Container>
    }>
      <SearchContent />
    </Suspense>
  );
}
