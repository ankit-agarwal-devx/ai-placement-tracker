import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import {
  ArrowRight,
  BriefcaseBusiness,
  ChartColumnIncreasing,
  Compass,
  MessagesSquare,
  Sparkles,
  Stars,
  UserRoundSearch,
} from "lucide-react"

import Footer from "@/app/components/Footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getSession } from "@/lib/session"

export const dynamic = "force-dynamic"

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

const spotlightCards = [
  {
    eyebrow: "Candidate Copilot",
    title: "Resume analysis, match scoring, and interview prep that feel connected.",
    body: "Candidates move from uncertainty to clear next steps with guided AI flows that stay grounded in their profile.",
    tone: "primary",
  },
  {
    eyebrow: "Admin Momentum",
    title: "A cleaner command center for jobs, applications, and shortlisting decisions.",
    body: "Recruiters and placement teams can scan activity faster, focus on stronger fits, and keep hiring progress visible.",
    tone: "secondary",
  },
  {
    eyebrow: "Shared Context",
    title: "One platform where candidate readiness and hiring movement live side by side.",
    body: "The experience is designed to support both discovery and decision-making without feeling overloaded.",
    tone: "tertiary",
  },
] as const

const metrics = [
  { label: "AI flows", value: "5", tone: "primary" },
  { label: "Core workspaces", value: "Jobs, apps, dashboard", tone: "secondary" },
  { label: "Audience", value: "Students + recruiters", tone: "tertiary" },
] as const

const journeySteps = [
  {
    icon: UserRoundSearch,
    title: "Build a candidate profile",
    copy: "Register once, add your skills and resume link, and keep your profile ready for matching and prep.",
    tone: "primary",
  },
  {
    icon: Sparkles,
    title: "Use AI to sharpen decisions",
    copy: "Get resume feedback, role fit signals, application help, and focused prep suggestions before key steps.",
    tone: "secondary",
  },
  {
    icon: BriefcaseBusiness,
    title: "Track live opportunities",
    copy: "Monitor openings, applications, and status changes from one place instead of scattered tools and spreadsheets.",
    tone: "tertiary",
  },
] as const

const featureBands = [
  {
    icon: ChartColumnIncreasing,
    title: "Signals before decisions",
    copy: "Use fit scores and profile context to guide action earlier in the process.",
    tone: "primary",
  },
  {
    icon: MessagesSquare,
    title: "Guidance before interviews",
    copy: "Turn application prep and interview practice into a steady workflow instead of a last-minute rush.",
    tone: "secondary",
  },
  {
    icon: Compass,
    title: "Direction without clutter",
    copy: "See what matters next whether you are applying, reviewing, or shortlisting.",
    tone: "tertiary",
  },
] as const

export default async function HomePage() {
  const session = await getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_color-mix(in_oklab,var(--color-primary)_20%,transparent),transparent_28%),radial-gradient(circle_at_88%_12%,_color-mix(in_oklab,var(--color-secondary)_26%,transparent),transparent_22%),radial-gradient(circle_at_52%_88%,_color-mix(in_oklab,var(--color-tertiary)_26%,transparent),transparent_28%),linear-gradient(180deg,var(--color-background),color-mix(in_oklab,var(--color-accent)_32%,var(--color-background)))]">
      <div className="pointer-events-none absolute inset-0 opacity-75">
        <div className="absolute left-[6%] top-20 h-48 w-48 rounded-full bg-primary/18 blur-3xl" />
        <div className="absolute right-[9%] top-28 h-56 w-56 rounded-full bg-secondary/18 blur-3xl" />
        <div className="absolute bottom-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-tertiary/18 blur-3xl" />
      </div>

      <section className="relative mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-6 sm:px-6 lg:px-10">
        <header className="flex flex-col gap-5 rounded-[30px] border border-white/50 bg-card/78 px-5 py-4 shadow-[0_24px_90px_-32px_color-mix(in_oklab,var(--color-primary)_28%,transparent)] backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-secondary-foreground">
              HireFlow AI
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-primary">
              Placement intelligence with visual clarity and momentum
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button variant="tertiary" asChild>
              <Link href="/register">Create account</Link>
            </Button>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(340px,0.98fr)] lg:items-center">
          <div className="space-y-8">
            <Badge variant="secondary" className="px-4 py-2 text-[0.74rem] uppercase tracking-[0.22em]">
              AI-guided placement tracker
            </Badge>

            <div className="space-y-5">
              <h2 className="max-w-4xl text-5xl font-semibold tracking-tight text-primary sm:text-6xl xl:text-7xl">
                A vivid home base for candidates and hiring teams to move faster.
              </h2>
              <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                HireFlow AI brings resume feedback, job-match insights, application
                guidance, interview prep, job tracking, and shortlisting into one
                expressive workspace that still feels focused and responsive.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="h-11 rounded-xl px-5" asChild>
                <Link href="/register">
                  Start as candidate
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-11 rounded-xl px-5" asChild>
                <Link href="/login">Explore dashboard access</Link>
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {metrics.map((metric) => (
                <Card
                  key={metric.label}
                  className={
                    metric.tone === "primary"
                      ? "border-primary/16 bg-linear-to-br from-card via-card to-primary/10"
                      : metric.tone === "secondary"
                        ? "border-secondary/18 bg-linear-to-br from-card via-card to-secondary/12"
                        : "border-tertiary/22 bg-linear-to-br from-card via-card to-tertiary/14"
                  }
                  size="sm"
                >
                  <CardContent className="space-y-2 py-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      {metric.label}
                    </p>
                    <p className="text-xl font-semibold text-primary">{metric.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 sm:grid-rows-[250px_190px]">
            <div className="relative overflow-hidden rounded-[32px] border border-white/55 bg-card/60 shadow-[0_30px_100px_-35px_color-mix(in_oklab,var(--color-primary)_32%,transparent)] sm:row-span-2">
              <Image
                src={heroImages[0].src}
                alt={heroImages[0].alt}
                fill
                sizes="(min-width: 1024px) 35vw, 100vw"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-primary/85 via-primary/26 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 space-y-3 p-6 text-primary-foreground">
                <Badge variant="secondary" className="bg-white/18 text-white ring-white/25">
                  Unified team view
                </Badge>
                <p className="max-w-sm text-xl font-medium leading-8">
                  See candidate progress, applications, and AI-assisted signals in one shared surface.
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[26px] border border-white/55 bg-card/60 shadow-[0_24px_70px_-32px_color-mix(in_oklab,var(--color-secondary)_30%,transparent)]">
              <Image
                src={heroImages[1].src}
                alt={heroImages[1].alt}
                fill
                sizes="(min-width: 640px) 24vw, 100vw"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-secondary/70 via-transparent to-transparent" />
            </div>

            <div className="relative overflow-hidden rounded-[26px] border border-white/55 bg-card/60 shadow-[0_24px_70px_-32px_color-mix(in_oklab,var(--color-tertiary)_34%,transparent)]">
              <Image
                src={heroImages[2].src}
                alt={heroImages[2].alt}
                fill
                sizes="(min-width: 640px) 24vw, 100vw"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-tertiary/72 via-transparent to-transparent" />
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          {spotlightCards.map((card) => (
            <Card
              key={card.title}
              className={
                card.tone === "primary"
                  ? "border-primary/16 bg-linear-to-br from-card via-card to-primary/8 shadow-[0_24px_70px_-38px_color-mix(in_oklab,var(--color-primary)_28%,transparent)]"
                  : card.tone === "secondary"
                    ? "border-secondary/18 bg-linear-to-br from-card via-card to-secondary/10 shadow-[0_24px_70px_-38px_color-mix(in_oklab,var(--color-secondary)_26%,transparent)]"
                    : "border-tertiary/22 bg-linear-to-br from-card via-card to-tertiary/12 shadow-[0_24px_70px_-38px_color-mix(in_oklab,var(--color-tertiary)_28%,transparent)]"
              }
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

        <section className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <Card className="border-primary/15 bg-[linear-gradient(160deg,color-mix(in_oklab,var(--color-card)_92%,white),color-mix(in_oklab,var(--color-primary)_8%,var(--color-card)))]">
            <CardHeader className="space-y-3">
              <Badge variant="tertiary" className="w-fit">How It Flows</Badge>
              <CardTitle className="text-3xl">A smoother placement journey from first profile edit to final shortlist.</CardTitle>
              <CardDescription className="max-w-xl text-sm leading-7">
                The platform is built to feel useful at every step, whether you are a student figuring out where to improve or an admin managing active hiring movement.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {journeySteps.map((step) => {
                const Icon = step.icon

                return (
                  <div
                    key={step.title}
                    className={
                      step.tone === "primary"
                        ? "rounded-2xl border border-primary/14 bg-primary/8 p-4"
                        : step.tone === "secondary"
                          ? "rounded-2xl border border-secondary/18 bg-secondary/12 p-4"
                          : "rounded-2xl border border-tertiary/22 bg-tertiary/14 p-4"
                    }
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <div className="rounded-xl bg-background/80 p-2 shadow-sm">
                        <Icon className="size-5 text-primary" />
                      </div>
                      <p className="font-semibold text-primary">{step.title}</p>
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">{step.copy}</p>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <div className="grid gap-6">
            <Card className="border-secondary/16 bg-[linear-gradient(150deg,color-mix(in_oklab,var(--color-card)_92%,white),color-mix(in_oklab,var(--color-secondary)_10%,var(--color-card)))]">
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <CardDescription className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary-foreground">
                      Why it stands out
                    </CardDescription>
                    <CardTitle className="mt-2 text-3xl">A brighter, more readable front door for the whole platform.</CardTitle>
                  </div>
                  <Stars className="size-8 text-tertiary-foreground" />
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-3">
                {featureBands.map((band) => {
                  const Icon = band.icon

                  return (
                    <div
                      key={band.title}
                      className={
                        band.tone === "primary"
                          ? "rounded-2xl border border-primary/14 bg-background/80 p-4"
                          : band.tone === "secondary"
                            ? "rounded-2xl border border-secondary/18 bg-background/80 p-4"
                            : "rounded-2xl border border-tertiary/22 bg-background/80 p-4"
                      }
                    >
                      <Icon className="mb-3 size-5 text-primary" />
                      <p className="font-semibold text-primary">{band.title}</p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{band.copy}</p>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-tertiary/20 bg-linear-to-br from-card via-card to-tertiary/10">
              <CardContent className="grid gap-5 px-4 py-5 md:grid-cols-[1fr_auto] md:items-center">
                <div className="space-y-3">
                  <Badge variant="secondary" className="w-fit">Ready to explore</Badge>
                  <p className="text-3xl font-semibold tracking-tight text-primary">
                    Enter as a candidate, or log in and continue the hiring flow where you left it.
                  </p>
                  <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                    The landing page now mirrors the same palette energy as the rest of the product while staying clear and responsive from small screens to desktop.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 md:justify-end">
                  <Button variant="tertiary" size="lg" className="h-11 rounded-xl px-5" asChild>
                    <Link href="/register">Create account</Link>
                  </Button>
                  <Button variant="outline" size="lg" className="h-11 rounded-xl px-5" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </section>

      <Footer />
    </main>
  )
}
