import { redirect } from "next/navigation"

import CandidateEditorForm from "@/app/components/CandidateEditorForm"
import AppShell from "@/app/components/AppShell"
import { getSession } from "@/lib/session"

export default async function CandidateCreatePage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  if (session.role !== "ADMIN") {
    redirect("/candidates")
  }

  return (
    <AppShell name={session.name} role={session.role}>
      <main className="min-h-full bg-background p-6">
        <div className="mb-6 max-w-2xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-secondary-foreground">
            Admin tools
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-primary">
            Create candidate profile
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This creates the user account and the connected candidate profile together.
          </p>
        </div>

        <CandidateEditorForm mode="create" role={session.role} />
      </main>
    </AppShell>
  )
}
