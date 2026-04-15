import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import AppShell from "@/app/components/AppShell"
import { applyToJob } from "@/app/jobs/actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/session"

type JobDetailsPageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ status?: string | string[] }>
}

export default async function JobDetailsPage({
  params,
  searchParams,
}: JobDetailsPageProps) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const { id } = await params
  const resolvedSearchParams = await searchParams
  const status = Array.isArray(resolvedSearchParams.status)
    ? resolvedSearchParams.status[0]
    : resolvedSearchParams.status

  const job = await prisma.job.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      company: true,
      description: true,
      createdAt: true,
      applications: {
        select: {
          id: true,
          status: true,
          userId: true,
        },
      },
    },
  })

  if (!job) {
    notFound()
  }

  const currentApplication = job.applications.find(
    (application) => application.userId === session.userId
  )

  return (
    <AppShell name={session.name} role={session.role}>
      <main className="min-h-full bg-background p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-secondary-foreground">
              Job details
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-primary">
              {job.title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{job.company}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" asChild>
              <Link href="/jobs">Back to jobs</Link>
            </Button>
            {session.role === "ADMIN" ? (
              <Button asChild>
                <Link href={`/jobs/create?jobId=${job.id}`}>Edit job</Link>
              </Button>
            ) : null}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Card>
            <CardHeader>
              <CardTitle>About this role</CardTitle>
              <CardDescription>
                Posted on {new Date(job.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
                {job.description}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Application panel</CardTitle>
              <CardDescription>
                {session.role === "ADMIN"
                  ? "Admins can update the listing and monitor interest."
                  : "Candidates can apply once per role."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge variant="secondary">
                {job.applications.length} application{job.applications.length === 1 ? "" : "s"}
              </Badge>

              {status ? <StatusMessage status={status} /> : null}

              {session.role === "STUDENT" ? (
                currentApplication ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-primary">You have already applied.</p>
                    <Badge>{currentApplication.status}</Badge>
                  </div>
                ) : (
                  <form action={applyToJob.bind(null, job.id)}>
                    <Button type="submit" className="w-full">
                      Apply now
                    </Button>
                  </form>
                )
              ) : (
                <p className="text-sm text-muted-foreground">
                  Admin accounts cannot apply to jobs.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </AppShell>
  )
}

function StatusMessage({ status }: { status: string }) {
  const statusCopy: Record<string, { text: string; tone: "default" | "success" | "destructive" }> = {
    applied: {
      text: "Application submitted successfully.",
      tone: "success",
    },
    "already-applied": {
      text: "You have already applied to this job.",
      tone: "default",
    },
    "missing-profile": {
      text: "Your candidate profile is missing, so we could not submit the application.",
      tone: "destructive",
    },
    "admin-only": {
      text: "Only candidate accounts can apply to jobs.",
      tone: "destructive",
    },
  }

  const message = statusCopy[status]

  if (!message) {
    return null
  }

  return (
    <p
      className={
        message.tone === "destructive"
          ? "rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          : message.tone === "success"
            ? "rounded-lg border border-secondary/20 bg-secondary/10 px-3 py-2 text-sm text-secondary-foreground"
            : "rounded-lg border border-primary/10 bg-primary/6 px-3 py-2 text-sm text-primary"
      }
    >
      {message.text}
    </p>
  )
}
