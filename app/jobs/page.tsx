import Link from "next/link"
import { redirect } from "next/navigation"

import AppShell from "@/app/components/AppShell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/session"

export default async function JobsPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      company: true,
      description: true,
      createdAt: true,
      applications: {
        select: { id: true },
      },
    },
  })

  return (
    <AppShell name={session.name} role={session.role}>
      <main className="min-h-full bg-background p-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-secondary-foreground">
              Jobs
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-primary">
              Explore open roles
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Candidates can browse openings and drill into role details. Admins can
              create new listings and update existing ones.
            </p>
          </div>

          {session.role === "ADMIN" ? (
            <Button asChild>
              <Link href="/jobs/create">Create job</Link>
            </Button>
          ) : null}
        </div>

        <div className="grid gap-4">
          {jobs.map((job) => (
            <Card key={job.id} className="border-primary/10">
              <CardHeader className="gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <CardTitle>{job.title}</CardTitle>
                  <CardDescription className="mt-1">{job.company}</CardDescription>
                </div>
                <Badge variant="secondary">
                  {job.applications.length} application{job.applications.length === 1 ? "" : "s"}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-6 text-muted-foreground">
                  {truncate(job.description, 190)}
                </p>
                <div className="flex flex-wrap gap-3 text-sm font-medium">
                  <Link
                    href={`/jobs/${job.id}`}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    View details
                  </Link>
                  {session.role === "ADMIN" ? (
                    <Link
                      href={`/jobs/create?jobId=${job.id}`}
                      className="text-secondary-foreground underline-offset-4 hover:underline"
                    >
                      Edit job
                    </Link>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}

          {jobs.length === 0 ? (
            <Card className="border-dashed border-primary/20">
              <CardContent className="p-6 text-sm text-muted-foreground">
                No jobs have been posted yet.
              </CardContent>
            </Card>
          ) : null}
        </div>
      </main>
    </AppShell>
  )
}

function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value
  }

  return `${value.slice(0, maxLength).trimEnd()}...`
}
