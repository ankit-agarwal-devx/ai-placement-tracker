import RegisterForm from "@/app/components/RegisterForm"

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-background via-background to-secondary/10 px-4 py-12">
      <div className="w-full max-w-5xl">
        <div className="mb-8 max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-secondary-foreground">
            HireFlow AI
          </p>
          <h1 className="mb-4 text-4xl font-semibold tracking-tight text-primary">
            Register once, start as a candidate by default.
          </h1>
          <p className="text-base text-muted-foreground">
            This registration flow saves your user account and creates the
            connected candidate profile in the same step.
          </p>
        </div>

        <RegisterForm />
      </div>
    </main>
  )
}
