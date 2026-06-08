import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SearchForm } from "@/components/ui/SearchForm";
import { FilterBar } from "@/components/ui/FilterBar";

type ShowItem = {
  id: number;
  name: string;
  description?: string;
  firstAirDate?: string;
  poster?: string;
};

async function getShows(
  sort: string = "popularity", 
  order: string = "desc",
  after?: string,
  before?: string
): Promise<ShowItem[]> {
  const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!rawBaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
  }

  const baseUrl = rawBaseUrl.replace(/\/$/, "");

  let url = `${baseUrl}/shows/search?page=1&limit=40&sort=${sort}&order=${order}&lang=en`;
  if (after) url += `&after=${after}-01-01`;
  if (before) url += `&before=${before}-12-31`;

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return data.results ?? [];
}

export default async function BrowseTVPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    reviewStatus?: string; 
    sort?: string; 
    order?: string;
    after?: string;
    before?: string;
  }>;
}) {
  const { 
    reviewStatus, 
    sort = "popularity", 
    order = "desc",
    after = "",
    before = ""
  } = await searchParams;
  
  const shows = await getShows(sort, order, after, before);

  const sortOptions = [
    { value: "popularity", label: "Popularity" },
    { value: "date", label: "Air Date" },
    { value: "rating", label: "Rating" },
    { value: "name", label: "Name" },
  ];

  return (
    <main className="py-12">
      <Container>
        <section className="flex justify-between items-end gap-6 flex-wrap mb-10">
          <div>
            <h1 className="text-4xl font-black mb-2 tracking-tight">TV Show Catalog</h1>
            <p className="text-text-secondary text-lg">
              Explore the complete collection of series.
            </p>
          </div>

          <SearchForm initialType="shows" />
        </section>

        <div className="flex flex-col gap-10 mb-12">
          <div className="flex gap-3 border-b border-border pb-6">
            <Link href="/browse/movies">
              <Button variant="outline" size="sm">
                Movies
              </Button>
            </Link>

            <Link href="/browse/shows">
              <Button variant="secondary" size="sm">
                TV Shows
              </Button>
            </Link>
          </div>

          <FilterBar 
            currentSort={sort} 
            currentOrder={order}
            currentAfter={after}
            currentBefore={before}
            baseUrl="/browse/shows" 
            options={sortOptions} 
          />
        </div>

        {reviewStatus === "success" && (
          <div className="mb-8 p-4 rounded-xl bg-green-900/30 border border-green-500/50 text-green-200 font-bold">
            Review posted successfully.
          </div>
        )}

        {shows.length === 0 ? (
          <div className="text-center py-20 bg-surface/50 border border-dashed border-border rounded-2xl">
            <p className="text-text-secondary text-xl font-bold">No shows found matching these filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
            {shows.map((show) => (
              <Link key={show.id} href={`/shows/${show.id}?from=/browse/shows`} className="group">
                <Card className="h-full flex flex-col p-3 group-hover:border-brand-blue transition-all duration-300">

                  {show.poster && (
                    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl mb-4">
                      <Image
                        src={show.poster}
                        alt={`Poster for ${show.name}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 200px"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  )}

                  <h2 className="font-bold text-lg mb-1 line-clamp-1 group-hover:text-brand-blue transition-colors">
                    {show.name}
                  </h2>

                  {show.firstAirDate && (
                    <p className="text-text-secondary text-sm mb-3">
                      {show.firstAirDate.split("-")[0]}
                    </p>
                  )}

                  {show.description && (
                    <p className="text-text-muted text-sm line-clamp-3 leading-relaxed">
                      {show.description}
                    </p>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}
