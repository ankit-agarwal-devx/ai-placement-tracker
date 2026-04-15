import LoginForm from "@/app/components/LoginForm"

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-background via-background to-tertiary/10 px-4 py-12">
      <div className="w-full max-w-5xl">
        <div className="mb-8 max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-secondary-foreground">
            HireFlow AI
          </p>
          <h1 className="mb-4 text-4xl font-semibold tracking-tight text-primary">
            Log in to continue your candidate journey.
          </h1>
          <p className="text-base text-muted-foreground">
            We&apos;ll verify your credentials and take you straight to the dashboard.
          </p>
        </div>

        <LoginForm />
      </div>
    </main>
  )
}
