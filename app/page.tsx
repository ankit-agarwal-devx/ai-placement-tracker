import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

import Footer from "@/app/components/Footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Card"
import { Button } from "@/components/ui/button"
import { getSession } from "@/lib/session"

const heroImages = [
  {
    src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
    alt: "A collaborative hiring team working around a laptop",
  },
  {
    src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    alt: "Candidate interview preparation with laptop and notebook",
  },
  {
    src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    alt: "Professional workspace used for resume review and recruiting",
  },
] as const

const highlightCards = [
  {
    eyebrow: "Candidate Copilot",
    title: "Resume feedback, job-match scoring, and interview prep in one flow.",
    body: "Candidates can understand fit gaps before they apply and tailor their next move with AI-backed guidance.",
  },
  {
    eyebrow: "Hiring Workspace",
    title: "Track openings, applications, and shortlisted talent from a single dashboard.",
    body: "Admins can review hiring activity, open candidate profiles, and run AI shortlisting where it matters.",
  },
  {
    eyebrow: "Decision Support",
    title: "Move from raw applications to organized, role-specific candidate insights.",
    body: "The platform helps teams focus on stronger matches faster while keeping the final hiring call human.",
  },
] as const

const metrics = [
  { label: "Candidate tools", value: "5 AI flows" },
  { label: "Admin views", value: "Jobs, apps, shortlist" },
  { label: "Built for", value: "Students + recruiters" },
] as const

export default async function HomePage() {
  const session = await getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(83,115,255,0.14),_transparent_28%),radial-gradient(circle_at_85%_18%,_rgba(72,194,181,0.16),_transparent_24%),linear-gradient(180deg,_rgba(255,255,255,0.92),_rgba(244,247,255,0.98))]">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-8 lg:px-10">
        <header className="flex flex-col gap-5 rounded-[32px] border border-white/70 bg-white/75 px-6 py-5 shadow-[0_24px_80px_rgba(67,88,160,0.12)] backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-secondary-foreground">
              HireFlow AI
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-primary">
              Placement intelligence for candidates and hiring teams
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Create account</Link>
            </Button>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-full border border-primary/10 bg-white/80 px-4 py-2 text-sm text-primary shadow-sm">
              AI-guided placement tracker for modern campus hiring
            </div>

            <div className="space-y-5">
              <h2 className="max-w-3xl text-5xl font-semibold tracking-tight text-primary md:text-6xl">
                A smart career dashboard before the first application is even sent.
              </h2>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                Candidates get resume analysis, match scoring, application help, interview
                prep, and a focused skill roadmap. Admins get a cleaner view of jobs,
                applications, and AI-assisted shortlisting.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/register">Start as candidate</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Admin login</Link>
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {metrics.map((metric) => (
                <Card
                  key={metric.label}
                  className="border-white/70 bg-white/80 shadow-[0_20px_50px_rgba(67,88,160,0.08)]"
                  size="sm"
                >
                  <CardContent className="space-y-2 py-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary-foreground">
                      {metric.label}
                    </p>
                    <p className="text-xl font-semibold text-primary">{metric.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 sm:grid-rows-[240px_180px]">
            <div className="relative overflow-hidden rounded-[30px] border border-white/70 bg-white/60 shadow-[0_30px_90px_rgba(67,88,160,0.16)] sm:row-span-2">
              <Image
                src={heroImages[0].src}
                alt={heroImages[0].alt}
                fill
                sizes="(min-width: 1024px) 34vw, 100vw"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-primary/75 via-primary/25 to-transparent p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
                  Team view
                </p>
                <p className="mt-2 text-lg font-medium">
                  Bring hiring conversations, candidate data, and AI support into one shared place.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-[26px] border border-white/70 bg-white/60 shadow-[0_20px_60px_rgba(67,88,160,0.12)]">
              <Image
                src={heroImages[1].src}
                alt={heroImages[1].alt}
                width={1200}
                height={900}
                sizes="(min-width: 640px) 24vw, 100vw"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="overflow-hidden rounded-[26px] border border-white/70 bg-white/60 shadow-[0_20px_60px_rgba(67,88,160,0.12)]">
              <Image
                src={heroImages[2].src}
                alt={heroImages[2].alt}
                width={1200}
                height={900}
                sizes="(min-width: 640px) 24vw, 100vw"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        <section className="grid gap-5 pb-10 md:grid-cols-3">
          {highlightCards.map((card) => (
            <Card
              key={card.title}
              className="border-white/70 bg-white/78 shadow-[0_22px_60px_rgba(67,88,160,0.1)]"
            >
              <CardHeader>
                <CardDescription className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary-foreground">
                  {card.eyebrow}
                </CardDescription>
                <CardTitle className="text-2xl leading-tight">{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-7 text-muted-foreground">{card.body}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      </section>
      <Footer />
    </main>
  )
}
