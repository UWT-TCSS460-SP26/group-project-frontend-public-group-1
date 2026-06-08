import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const teamMembers = [
  {
    name: "Harleen Bhardwaj",
    role: "Reviews, edit/delete functionality, browse/detail pages, Sprint 8 feedback fixes, and frontend polish.",
  },
  {
    name: "Harsimar Kaur",
    role: "Search, ratings/reviews features, issue creation, backend rating routes, and validation tasks.",
  },
  {
    name: "Jonathan Hernandez",
    role: "Sign-in/auth UI, profile activity visuals, signed-out placeholders, deployment, and issue routes.",
  },
  {
    name: "Nate Almanza",
    role: "Authentication middleware, rating update/delete routes, documentation, and backend auth setup.",
  },
];

export default function AboutPage() {
  return (
    <main className="py-12 min-h-screen">
      <Container>
        <Link
          href="/"
          className="inline-flex items-center text-brand-blue font-bold mb-8 hover:underline"
        >
          ← Back Home
        </Link>

        <section className="mb-12">
          <Card hoverable={false} className="p-8 sm:p-12 border-brand-blue/20 shadow-2xl">
            <p className="text-brand-blue font-black uppercase tracking-[0.2em] text-xs mb-4">
              About MovieSocial
            </p>

            <h1 className="text-4xl sm:text-6xl font-black mb-6 leading-[1.1] tracking-tight max-w-3xl">
              Built for discovering, rating, and reviewing movies and shows.
            </h1>

            <p className="text-text-secondary text-lg sm:text-xl leading-relaxed max-w-2xl">
              MovieSocial is our TCSS 460 consumer app. It lets users browse
              popular movies and TV shows, search for titles, view details, sign
              in, and interact with ratings and reviews through our upstream
              partner API.
            </p>
          </Card>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <section>
            <h2 className="text-3xl font-black mb-6">Team Contributions</h2>

            <div className="grid gap-4">
              {teamMembers.map((member) => (
                <Card key={member.name} className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-text-primary">{member.name}</h3>
                  <p className="text-text-secondary leading-relaxed">
                    {member.role}
                  </p>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-6">Powered By</h2>

            <div className="grid gap-4">
              {[
                { label: "Upstream Partner", value: "Group 9 API powers our browse, search, detail, rating, and review experience." },
                { label: "TMDB", value: "Provides movie and TV metadata like posters, titles, descriptions, ratings, and release information." },
                { label: "Auth²", value: "Supports OAuth2 sign-in and authenticated user actions." },
                { label: "Next.js", value: "Powers the frontend routing, pages, and app structure." },
              ].map((item) => (
                <Card key={item.label} className="p-6">
                  <h3 className="text-lg font-bold mb-2 text-brand-blue">{item.label}</h3>
                  <p className="text-text-secondary leading-relaxed">
                    {item.value}
                  </p>
                </Card>
              ))}
            </div>
          </section>
        </div>

        <section>
          <Card hoverable={false} className="p-8 sm:p-10 bg-surface/30">
            <h2 className="text-3xl font-black mb-4">Project Reflection</h2>
            <p className="text-text-secondary text-lg leading-relaxed max-w-4xl">
              Across the project, we learned how to build a consumer app on top of
              another team&apos;s API, work with OAuth2 authentication, attach
              bearer tokens to authenticated requests, handle API contract issues,
              and polish the app so it feels consistent across search, browse,
              detail, profile, and review flows.
            </p>
          </Card>
        </section>
      </Container>
    </main>
  );
}
