import { ArrowRight, ShieldCheck, Sparkles, Target } from "lucide-react"

import LoginForm from "@/app/components/LoginForm"
import { Badge } from "@/components/ui/badge"

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,_color-mix(in_oklab,var(--color-secondary)_30%,transparent),transparent_28%),radial-gradient(circle_at_bottom_right,_color-mix(in_oklab,var(--color-tertiary)_45%,transparent),transparent_30%),linear-gradient(160deg,var(--color-background),color-mix(in_oklab,var(--color-primary)_6%,var(--color-background)))] px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute left-[8%] top-20 h-40 w-40 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute right-[10%] top-16 h-48 w-48 rounded-full bg-primary/18 blur-3xl" />
        <div className="absolute bottom-10 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-tertiary/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-6xl rounded-[2rem] border border-primary/12 bg-card/80 p-3 shadow-[0_30px_120px_-30px_color-mix(in_oklab,var(--color-primary)_28%,transparent)] backdrop-blur xl:p-4">
        <div className="grid overflow-hidden rounded-[1.6rem] border border-white/40 bg-linear-to-br from-card via-card to-accent/30 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="relative flex flex-col justify-between gap-10 border-b border-primary/10 px-6 py-8 sm:px-8 sm:py-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-12">
            <div className="space-y-6">
              <Badge variant="secondary" className="px-3 py-1 text-[0.72rem] tracking-[0.2em] uppercase">
                HireFlow AI Access
              </Badge>

              <div className="space-y-4">
                <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-primary sm:text-5xl">
                  Log in to your placement workspace with clarity and momentum.
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                  Step back into your hiring dashboard with a cleaner, faster sign-in flow
                  designed for candidates and administrators across every screen size.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-primary/12 bg-primary/8 p-4">
                <ShieldCheck className="mb-3 size-5 text-primary" />
                <p className="text-sm font-semibold text-primary">Protected access</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Secure entry into your dashboard and workflows.
                </p>
              </div>
              <div className="rounded-2xl border border-secondary/18 bg-secondary/12 p-4">
                <Target className="mb-3 size-5 text-secondary-foreground" />
                <p className="text-sm font-semibold text-secondary-foreground">Focused actions</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Continue applications, reviews, and shortlists quickly.
                </p>
              </div>
              <div className="rounded-2xl border border-tertiary/22 bg-tertiary/16 p-4">
                <Sparkles className="mb-3 size-5 text-tertiary-foreground" />
                <p className="text-sm font-semibold text-tertiary-foreground">AI-ready tools</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Jump straight into profile, match, and prep insights.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-primary/10 bg-background/70 px-4 py-3 text-sm text-muted-foreground">
              <ArrowRight className="size-4 text-primary" />
              Sign in and continue your candidate journey without losing context.
            </div>
          </section>

          <section className="flex items-center justify-center px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
            <LoginForm />
          </section>
        </div>
      </div>
    </main>
  )
}
