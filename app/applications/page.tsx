import Link from "next/link"
import { redirect } from "next/navigation"

import AppShell from "@/app/components/AppShell"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/Card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getCachedApplications } from "@/lib/cached-data"
import { getSession } from "@/lib/session"

export default async function ApplicationsPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const applications = await getCachedApplications(session.role, session.userId)

  const selectedCount = applications.filter(
    (application) => application.status === "SELECTED"
  ).length

  return (
    <AppShell name={session.name} role={session.role}>
      <main className="min-h-full bg-background px-4 py-5 sm:px-6 sm:py-6">
        <div className="mb-6">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-secondary-foreground">
            Applications
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
            {session.role === "ADMIN" ? "All job applications" : "Your applications"}
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            {session.role === "ADMIN"
              ? "Admins can review every application submitted across the platform."
              : "Students can track each job they have applied for and monitor the current status."}
          </p>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <Card className="border-l-4 border-l-primary bg-linear-to-br from-card via-card to-secondary/10">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">
                {session.role === "ADMIN" ? "Total applications" : "Applications submitted"}
              </p>
              <p className="mt-2 text-3xl font-semibold text-primary">
                {applications.length}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-secondary bg-linear-to-br from-card via-card to-tertiary/10">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Selected</p>
              <p className="mt-2 text-3xl font-semibold text-primary">{selectedCount}</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-tertiary bg-linear-to-br from-card via-card to-primary/8">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Latest activity</p>
              <p className="mt-2 text-sm font-medium text-primary">
                {applications[0]
                  ? new Date(applications[0].createdAt).toLocaleDateString()
                  : "No applications yet"}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {session.role === "ADMIN" ? "Application overview" : "Application history"}
            </CardTitle>
            <CardDescription>
              {session.role === "ADMIN"
                ? "See the candidate, role, and progress for every submission."
                : "Open any job again to review the role details."}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {applications.length ? (
              <>
                <div className="grid gap-4 p-4 sm:hidden">
                  {applications.map((application) => (
                    <Card
                      key={application.id}
                      className="border border-primary/10 bg-primary/5 shadow-none"
                    >
                      <CardContent className="space-y-4 p-4">
                        {session.role === "ADMIN" ? (
                          <div className="space-y-1">
                            <p className="font-medium text-primary">
                              {application.candidate.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {application.candidate.email}
                            </p>
                          </div>
                        ) : null}

                        <div className="space-y-3 text-sm text-muted-foreground">
                          <p>
                            <span className="font-medium text-primary">Job:</span>{" "}
                            {application.job.title}
                          </p>
                          <p>
                            <span className="font-medium text-primary">Company:</span>{" "}
                            {application.job.company}
                          </p>
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-medium text-primary">Status</span>
                            <Badge variant={getStatusVariant(application.status)}>
                              {formatStatus(application.status)}
                            </Badge>
                          </div>
                          <p>
                            <span className="font-medium text-primary">Applied on:</span>{" "}
                            {new Date(application.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <Link
                          href={`/jobs/${application.job.id}`}
                          className="inline-flex text-sm font-medium text-secondary-foreground underline-offset-4 hover:text-primary hover:underline"
                        >
                          View job
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="hidden sm:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {session.role === "ADMIN" ? <TableHead>Candidate</TableHead> : null}
                        <TableHead>Job</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Applied on</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications.map((application) => (
                        <TableRow key={application.id}>
                          {session.role === "ADMIN" ? (
                            <TableCell>
                              <div className="space-y-1">
                                <p className="font-medium text-primary">
                                  {application.candidate.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {application.candidate.email}
                                </p>
                              </div>
                            </TableCell>
                          ) : null}
                          <TableCell>{application.job.title}</TableCell>
                          <TableCell>{application.job.company}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(application.status)}>
                              {formatStatus(application.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(application.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Link
                              href={`/jobs/${application.job.id}`}
                              className="font-medium text-secondary-foreground underline-offset-4 hover:text-primary hover:underline"
                            >
                              View job
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            ) : (
              <div className="p-6 text-sm text-muted-foreground">
                {session.role === "ADMIN"
                  ? "No applications have been submitted yet."
                  : "You have not applied to any jobs yet."}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </AppShell>
  )
}

function getStatusVariant(status: string) {
  switch (status) {
    case "SELECTED":
      return "default" as const
    case "INTERVIEW":
    case "SHORTLISTED":
      return "secondary" as const
    case "REJECTED":
      return "destructive" as const
    default:
      return "outline" as const
  }
}

function formatStatus(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase()
}
