import Link from "next/link"
import { redirect } from "next/navigation"

import AppShell from "@/app/components/AppShell"
import CandidateAiPanel from "@/app/components/CandidateAiPanel"
import { Card, CardContent } from "@/components/Card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getCachedCandidates } from "@/lib/cached-data"
import { getSession } from "@/lib/session"

export default async function CandidatesPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const candidates = await getCachedCandidates(session.role, session.userId)

  return (
    <AppShell name={session.name} role={session.role}>
      <main className="min-h-full bg-background px-4 py-5 sm:px-6 sm:py-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-secondary-foreground">
              Candidates
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
              {session.role === "ADMIN" ? "Manage candidate profiles" : "Your candidate profile"}
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              {session.role === "ADMIN"
                ? "Admins can create candidate-linked user accounts and edit any candidate profile."
                : "Review and update your own profile details used for applications."}
            </p>
          </div>

          {session.role === "ADMIN" ? (
            <Button asChild className="w-full sm:w-auto">
              <Link href="/candidates/create">Create candidate</Link>
            </Button>
          ) : null}
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Card className="border-l-4 border-l-primary bg-linear-to-br from-card via-card to-secondary/10">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">
                {session.role === "ADMIN" ? "Total candidates" : "Profile count"}
              </p>
              <p className="mt-2 text-3xl font-semibold text-primary">{candidates.length}</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-secondary bg-linear-to-br from-card via-card to-tertiary/10">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Applications</p>
              <p className="mt-2 text-3xl font-semibold text-primary">
                {candidates.reduce((sum, candidate) => sum + candidate.applications.length, 0)}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-tertiary bg-linear-to-br from-card via-card to-primary/8">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Profiles with resume</p>
              <p className="mt-2 text-3xl font-semibold text-primary">
                {candidates.filter((candidate) => candidate.resume).length}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-0">
            {candidates.length ? (
              <>
                <div className="grid gap-4 p-4 lg:hidden">
                  {candidates.map((candidate) => (
                    <Card
                      key={candidate.id}
                      className="border border-primary/10 bg-primary/5 shadow-none"
                    >
                      <CardContent className="space-y-4 p-4">
                        <div className="space-y-1">
                          <p className="font-medium text-primary">{candidate.name}</p>
                          <p className="text-sm text-muted-foreground">{candidate.email}</p>
                        </div>

                        <div className="space-y-3 text-sm text-muted-foreground">
                          <p>
                            <span className="font-medium text-primary">Skills:</span>{" "}
                            {truncate(candidate.skills, 90)}
                          </p>
                          <div className="flex items-center justify-between gap-3">
                            <span>
                              <span className="font-medium text-primary">Applications:</span>{" "}
                              {candidate.applications.length}
                            </span>
                            <Badge variant="secondary">
                              {candidate.applications.length}
                            </Badge>
                          </div>
                          <p>
                            <span className="font-medium text-primary">Resume:</span>{" "}
                            {candidate.resume ? (
                              <a
                                href={candidate.resume}
                                target="_blank"
                                rel="noreferrer"
                                className="font-medium text-primary underline-offset-4 hover:underline"
                              >
                                Open
                              </a>
                            ) : (
                              "No resume"
                            )}
                          </p>
                        </div>

                        <Link
                          href={`/candidates/${candidate.id}/edit`}
                          className="inline-flex text-sm font-medium text-secondary-foreground underline-offset-4 hover:text-primary hover:underline"
                        >
                          Edit profile
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="hidden lg:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Skills</TableHead>
                        <TableHead>Applications</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {candidates.map((candidate) => (
                        <TableRow key={candidate.id}>
                          <TableCell>{candidate.name}</TableCell>
                          <TableCell>{candidate.email}</TableCell>
                          <TableCell>{truncate(candidate.skills, 45)}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {candidate.applications.length}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {candidate.resume ? (
                              <a
                                href={candidate.resume}
                                target="_blank"
                                rel="noreferrer"
                                className="font-medium text-primary underline-offset-4 hover:underline"
                              >
                                Open
                              </a>
                            ) : (
                              <span className="text-muted-foreground">No resume</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Link
                              href={`/candidates/${candidate.id}/edit`}
                              className="font-medium text-secondary-foreground underline-offset-4 hover:text-primary hover:underline"
                            >
                              Edit
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
                  ? "No candidates have been created yet."
                  : "Your candidate profile could not be found."}
              </div>
            )}
          </CardContent>
        </Card>

        {session.role === "STUDENT" && candidates.length > 0 ? (
          <div className="mt-6">
            <CandidateAiPanel />
          </div>
        ) : null}
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
