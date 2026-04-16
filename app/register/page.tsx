import { BriefcaseBusiness, CheckCircle2, Orbit, UserRoundPlus } from "lucide-react"

import RegisterForm from "@/app/components/RegisterForm"
import { Badge } from "@/components/ui/badge"

export default function RegisterPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_right,_color-mix(in_oklab,var(--color-primary)_24%,transparent),transparent_28%),radial-gradient(circle_at_bottom_left,_color-mix(in_oklab,var(--color-secondary)_28%,transparent),transparent_34%),linear-gradient(150deg,var(--color-background),color-mix(in_oklab,var(--color-tertiary)_10%,var(--color-background)))] px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-75">
        <div className="absolute left-[12%] top-14 h-44 w-44 rounded-full bg-primary/18 blur-3xl" />
        <div className="absolute right-[12%] top-28 h-40 w-40 rounded-full bg-tertiary/24 blur-3xl" />
        <div className="absolute bottom-12 right-1/3 h-52 w-52 rounded-full bg-secondary/18 blur-3xl" />
      </div>

      <div className="relative w-full max-w-6xl rounded-[2rem] border border-primary/12 bg-card/80 p-3 shadow-[0_30px_120px_-30px_color-mix(in_oklab,var(--color-tertiary)_26%,transparent)] backdrop-blur xl:p-4">
        <div className="grid overflow-hidden rounded-[1.6rem] border border-white/40 bg-linear-to-br from-card via-card to-secondary/8 lg:grid-cols-[1fr_1.04fr]">
          <section className="order-2 flex items-center justify-center px-4 py-6 sm:px-6 sm:py-8 lg:order-1 lg:px-10 lg:py-10">
            <RegisterForm />
          </section>

          <section className="order-1 flex flex-col justify-between gap-10 border-b border-primary/10 px-6 py-8 sm:px-8 sm:py-10 lg:order-2 lg:border-b-0 lg:border-l lg:px-12 lg:py-12">
            <div className="space-y-6">
              <Badge variant="tertiary" className="px-3 py-1 text-[0.72rem] tracking-[0.2em] uppercase">
                Candidate Onboarding
              </Badge>

              <div className="space-y-4">
                <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-primary sm:text-5xl">
                  Create one account and launch your profile in a single step.
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                  Registration creates both your platform login and connected candidate
                  identity, giving you a polished starting point for jobs, AI insights,
                  and application tracking.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-primary/12 bg-primary/8 p-4">
                <UserRoundPlus className="mb-3 size-5 text-primary" />
                <p className="text-sm font-semibold text-primary">One smooth setup</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  User account and candidate profile are created together.
                </p>
              </div>
              <div className="rounded-2xl border border-secondary/18 bg-secondary/12 p-4">
                <BriefcaseBusiness className="mb-3 size-5 text-secondary-foreground" />
                <p className="text-sm font-semibold text-secondary-foreground">Job-ready data</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Add skills and resume details that power matching workflows.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-tertiary/25 bg-linear-to-br from-tertiary/18 via-background to-secondary/10 p-5">
              <div className="mb-3 flex items-center gap-2">
                <Orbit className="size-5 text-tertiary-foreground" />
                <p className="text-sm font-semibold text-tertiary-foreground">
                  What you unlock immediately
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 size-4 text-primary" />
                  A centered dashboard entry point built for student workflows.
                </div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 size-4 text-secondary-foreground" />
                  Cleaner visibility for applications, jobs, and profile updates.
                </div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 size-4 text-tertiary-foreground" />
                  AI-assisted resume, roadmap, and matching features.
                </div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 size-4 text-primary" />
                  Responsive access that still feels polished on smaller screens.
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
