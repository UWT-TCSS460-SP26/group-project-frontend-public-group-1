import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SearchForm } from "@/components/ui/SearchForm";

type CommunityItem = {
  tmdbId: number;
  mediaType: "MOVIE" | "TV";
  averageScore: number;
  reviewCount: number;
  tmdb: {
    title: string;
    poster: string | null;
    releaseDate: string;
  };
};

async function getCommunityFeed(sort: string = "rating"): Promise<CommunityItem[]> {
  const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!rawBaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
  }

  const baseUrl = rawBaseUrl.replace(/\/$/, "");
  const response = await fetch(`${baseUrl}/community?sort=${sort}&minReviews=1&limit=21`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch community feed");
  }

  const data = await response.json();
  return data.results ?? [];
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const params = await searchParams;
  const sort = params.sort === "reviews" ? "reviews" : "rating";
  const items = await getCommunityFeed(sort);
  
  const topPick = items[0];
  const remainingItems = items.slice(1);

  return (
    <main className="pb-20">
      {/* Hero Section - The Discovery Highlight */}
      {topPick && (
        <section className="relative w-full h-[70vh] min-h-[500px] mb-12 overflow-hidden border-b border-border">
          <Image
            src={topPick.tmdb.poster || ""}
            alt={`Background for ${topPick.tmdb.title}`}
            fill
            priority
            className="object-cover opacity-40 blur-sm scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
          
          <Container className="relative h-full flex items-center">
            <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-12 items-center">
              <div className="hidden md:block relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 scale-105">
                <Image
                  src={topPick.tmdb.poster || ""}
                  alt={`Top community pick: ${topPick.tmdb.title}`}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/20 border border-brand-blue/30 text-brand-blue text-xs font-black uppercase tracking-widest mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-blue"></span>
                  </span>
                  Community Top Pick
                </div>
                
                <h1 className="text-5xl sm:text-7xl font-black mb-4 tracking-tighter leading-[0.9]">
                  {topPick.tmdb.title}
                </h1>
                
                <div className="flex items-center gap-6 mb-8 text-lg">
                  <div className="flex flex-col">
                    <span className="text-text-muted text-xs font-bold uppercase tracking-wider">Avg Score</span>
                    <span className="text-white font-black text-2xl">{topPick.averageScore}/10</span>
                  </div>
                  <div className="w-px h-10 bg-border" />
                  <div className="flex flex-col">
                    <span className="text-text-muted text-xs font-bold uppercase tracking-wider">Reviews</span>
                    <span className="text-white font-black text-2xl">{topPick.reviewCount}</span>
                  </div>
                </div>

                <Link href={topPick.mediaType === "TV" ? `/shows/${topPick.tmdbId}?from=/` : `/movies/${topPick.tmdbId}?from=/`}>
                  <Button size="lg" variant="secondary" className="px-10">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </section>
      )}

      <Container>
        <section className="flex justify-between items-end gap-6 flex-wrap mb-10">
          <div>
            <h2 className="text-3xl font-black mb-2 tracking-tight">
              Community Pulse
            </h2>
            <p className="text-text-secondary">
              Discover what other members are watching and reviewing.
            </p>
          </div>

          <div className="flex items-center gap-4">
             <SearchForm />
          </div>
        </section>

        <div className="flex gap-3 mb-8 border-b border-border pb-6">
          <Link href="/?sort=rating">
            <Button variant={sort === "rating" ? "secondary" : "ghost"} size="sm">
              Top Rated
            </Button>
          </Link>

          <Link href="/?sort=reviews">
            <Button variant={sort === "reviews" ? "secondary" : "ghost"} size="sm">
              Most Discussed
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-8">
          {remainingItems.map((item) => {
            const href = item.mediaType === "TV" ? `/shows/${item.tmdbId}?from=/` : `/movies/${item.tmdbId}?from=/`;

            return (
              <Link key={`${item.mediaType}-${item.tmdbId}`} href={href} className="group">
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl mb-4 shadow-lg group-hover:shadow-brand-blue/20 transition-all duration-300">
                  {item.tmdb.poster ? (
                    <Image
                      src={item.tmdb.poster}
                      alt={`Poster for ${item.tmdb.title}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 200px"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-surface flex items-center justify-center text-text-muted italic">
                      No Poster
                    </div>
                  )}
                  
                  {/* Community Badge Overlay */}
                  <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg p-2 flex flex-col items-center min-w-[45px]">
                    <span className="text-brand-blue font-black text-sm leading-none">{item.averageScore}</span>
                    <span className="text-[8px] font-black text-text-muted uppercase mt-0.5 tracking-tighter">Score</span>
                  </div>
                </div>

                <h3 className="font-bold text-lg mb-1 line-clamp-1 group-hover:text-brand-blue transition-colors">
                  {item.tmdb.title}
                </h3>

                <div className="flex items-center justify-between">
                  <p className="text-text-secondary text-xs font-bold uppercase tracking-wider">
                    {item.tmdb.releaseDate.split("-")[0]}
                  </p>
                  <p className="text-text-muted text-[10px] font-black uppercase">
                    {item.reviewCount} Reviews
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </main>
  );
}
