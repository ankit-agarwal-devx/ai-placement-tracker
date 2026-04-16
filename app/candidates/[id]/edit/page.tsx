import { notFound, redirect } from "next/navigation"

import CandidateEditorForm from "@/app/components/CandidateEditorForm"
import AppShell from "@/app/components/AppShell"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/session"

type CandidateEditPageProps = {
  params: Promise<{ id: string }>
}

export const dynamic = "force-dynamic"

export default async function CandidateEditPage({
  params,
}: CandidateEditPageProps) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const { id } = await params

  const candidate = await prisma.candidate.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      skills: true,
      resume: true,
      userId: true,
    },
  })

  if (!candidate) {
    notFound()
  }

  const canEdit =
    session.role === "ADMIN" || candidate.userId === session.userId

  if (!canEdit) {
    redirect("/candidates")
  }

  return (
    <AppShell name={session.name} role={session.role}>
      <main className="min-h-full bg-background p-6">
        <div className="mb-6 max-w-2xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-secondary-foreground">
            Candidate profile
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-primary">
            Edit {candidate.name}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Changes here keep both the candidate profile and linked user account in sync.
          </p>
        </div>

        <CandidateEditorForm
          candidate={candidate}
          mode="edit"
          role={session.role}
        />
      </main>
    </AppShell>
  )
}
