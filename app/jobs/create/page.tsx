import { notFound, redirect } from "next/navigation"

import AppShell from "@/app/components/AppShell"
import JobEditorForm from "@/app/components/JobEditorForm"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/session"

type JobsCreatePageProps = {
  searchParams: Promise<{ jobId?: string | string[] }>
}

export default async function JobsCreatePage({ searchParams }: JobsCreatePageProps) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  if (session.role !== "ADMIN") {
    redirect("/jobs")
  }

  const resolvedSearchParams = await searchParams
  const jobId = Array.isArray(resolvedSearchParams.jobId)
    ? resolvedSearchParams.jobId[0]
    : resolvedSearchParams.jobId

  const job = jobId
    ? await prisma.job.findUnique({
        where: { id: jobId },
        select: {
          id: true,
          title: true,
          company: true,
          description: true,
        },
      })
    : null

  if (jobId && !job) {
    notFound()
  }

  return (
    <AppShell name={session.name} role={session.role}>
      <main className="min-h-full bg-background p-6">
        <div className="mb-6 max-w-2xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-secondary-foreground">
            Admin tools
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-primary">
            {job ? "Update job listing" : "Post a new job"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Admins can create openings and refresh job details from this page.
          </p>
        </div>

        <JobEditorForm job={job} />
      </main>
    </AppShell>
  )
}
