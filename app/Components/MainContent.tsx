import Link from "next/link"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/Card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  getCachedAdminDashboardData,
  getCachedStudentDashboardData,
} from "@/lib/cached-data"

type MainContentProps = {
  session: {
    userId: string
    name: string
    role: "ADMIN" | "STUDENT"
  }
}

export default async function MainContent({ session }: MainContentProps) {
  if (session.role === "ADMIN") {
    const {
      candidateCount,
      jobCount,
      applicationCount,
      shortlistedCount,
      recentApplications,
    } = await getCachedAdminDashboardData()

    return (
      <main className="min-h-screen bg-background p-6">
        <div className="mb-6 max-w-3xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-secondary-foreground">
            Admin dashboard
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-primary">
            Hiring activity at a glance
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Monitor platform activity, recent applications, and shortlisting progress from one place.
          </p>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Candidates" value={candidateCount} tone="primary" />
          <StatCard title="Open jobs" value={jobCount} tone="secondary" />
          <StatCard title="Applications" value={applicationCount} tone="tertiary" />
          <StatCard title="Shortlisted" value={shortlistedCount} tone="primarySoft" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <Card>
            <CardHeader>
              <CardTitle>Recent applications</CardTitle>
              <CardDescription>
                The latest submissions across all jobs on the platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {recentApplications.length ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidate</TableHead>
                      <TableHead>Job</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applied on</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentApplications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell>{application.candidate.name}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium text-primary">{application.job.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {application.job.company}
                            </p>
                          </div>
                        </TableCell>
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
              ) : (
                <div className="p-6 text-sm text-muted-foreground">
                  No applications have been submitted yet.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle>Quick links</CardTitle>
              <CardDescription>Jump straight into the main hiring workflows.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <QuickLink
                href="/jobs/create"
                title="Create a new job"
                copy="Publish a new role and start collecting applications."
              />
              <QuickLink
                href="/applications"
                title="Review applications"
                copy="Check candidate progress and update the hiring pipeline."
              />
              <QuickLink
                href="/candidates"
                title="Manage candidates"
                copy="Edit profiles, resumes, and candidate-linked accounts."
              />
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  const { candidateProfile, applications, recentJobs } =
    await getCachedStudentDashboardData(session.userId)

  const selectedCount = applications.filter(
    (application) => application.status === "SELECTED"
  ).length

  const profileStrength = candidateProfile
    ? [candidateProfile.skills ? 1 : 0, candidateProfile.resume ? 1 : 0].reduce(
        (sum, value) => sum + value,
        1
      )
    : 0

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mb-6 max-w-3xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-secondary-foreground">
          Student dashboard
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-primary">
          Your placement progress
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Track applications, keep your profile ready, and discover new roles to apply for.
        </p>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Profile readiness"
          value={`${profileStrength}/3`}
          tone="primary"
        />
        <StatCard title="Applications" value={applications.length} tone="secondary" />
        <StatCard title="Selected" value={selectedCount} tone="tertiary" />
        <StatCard
          title="Resume uploaded"
          value={candidateProfile?.resume ? "Yes" : "No"}
          tone="primarySoft"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Your recent applications</CardTitle>
            <CardDescription>
              See the latest roles you applied for and where they stand now.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {applications.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
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
            ) : (
              <div className="p-6 text-sm text-muted-foreground">
                You have not applied to any jobs yet.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle>Profile snapshot</CardTitle>
              <CardDescription>
                Keep your candidate profile updated so AI insights and job matches stay useful.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-primary">Name:</span>{" "}
                {candidateProfile?.name ?? "Profile missing"}
              </p>
              <p>
                <span className="font-medium text-primary">Skills:</span>{" "}
                {candidateProfile?.skills
                  ? truncate(candidateProfile.skills, 90)
                  : "Add your skills to improve job matching."}
              </p>
              <p>
                <span className="font-medium text-primary">Resume:</span>{" "}
                {candidateProfile?.resume ? "Attached" : "Not added yet"}
              </p>
              <div className="pt-2">
                <Button asChild>
                  <Link href="/candidates">Update profile</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle>Recent opportunities</CardTitle>
              <CardDescription>
                Explore the latest roles available on the platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentJobs.length ? (
                recentJobs.map((job) => (
                  <div
                    key={job.id}
                    className="rounded-xl border border-primary/10 bg-primary/5 p-4"
                  >
                    <p className="font-medium text-primary">{job.title}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-secondary-foreground">
                      {job.company}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {truncate(job.description, 110)}
                    </p>
                    <Link
                      href={`/jobs/${job.id}`}
                      className="mt-3 inline-flex text-sm font-medium text-secondary-foreground underline-offset-4 hover:text-primary hover:underline"
                    >
                      Review role
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No jobs have been posted yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

function StatCard({
  title,
  value,
  tone,
}: {
  title: string
  value: string | number
  tone: "primary" | "secondary" | "tertiary" | "primarySoft"
}) {
  const toneClassName =
    tone === "primary"
      ? "border-l-primary bg-linear-to-br from-card via-card to-secondary/10"
      : tone === "secondary"
        ? "border-l-secondary bg-linear-to-br from-card via-card to-tertiary/10"
        : tone === "tertiary"
          ? "border-l-tertiary bg-linear-to-br from-card via-card to-primary/8"
          : "border-l-primary/60 bg-linear-to-br from-card via-card to-primary/10"

  return (
    <Card className={`border-l-4 ${toneClassName}`}>
      <CardContent className="p-5">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="mt-2 text-3xl font-semibold text-primary">{value}</p>
      </CardContent>
    </Card>
  )
}

function QuickLink({
  href,
  title,
  copy,
}: {
  href: string
  title: string
  copy: string
}) {
  return (
    <Link
      href={href}
      className="block rounded-xl border border-primary/10 bg-primary/5 p-4 transition-colors hover:bg-primary/8"
    >
      <p className="font-medium text-primary">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
    </Link>
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

function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value
  }

  return `${value.slice(0, maxLength).trimEnd()}...`
}
