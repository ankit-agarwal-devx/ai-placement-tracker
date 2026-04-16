"use client"

import { useState, useTransition } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type AdminAssessment = {
  candidateId: string
  applicationId: string
  candidateName: string
  score: number
  suitable: boolean
  summary: string
  strengths: string[]
  gaps: string[]
}

type ShortlistResult = {
  jobTitle: string
  threshold: number
  assessments: AdminAssessment[]
  shortlistedCount: number
}

export default function AdminShortlistPanel({ jobId }: { jobId: string }) {
  const [error, setError] = useState("")
  const [result, setResult] = useState<ShortlistResult | null>(null)
  const [isPending, startTransition] = useTransition()

  function runShortlist() {
    setError("")

    startTransition(async () => {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feature: "admin-shortlist",
          jobId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setResult(null)
        setError(data.error ?? "Unable to shortlist candidates right now.")
        return
      }

      setResult(data)
    })
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/15">
        <CardHeader>
          <CardTitle className="text-xl">AI shortlist assistant</CardTitle>
          <CardDescription className="text-sm leading-6">
            Score all applicants for this role with AI. Candidates above 70% are
            treated as suitable and will be marked as shortlisted automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button type="button" onClick={runShortlist} disabled={isPending}>
            {isPending ? "Scoring candidates..." : "Find suitable candidates"}
          </Button>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          {result ? (
            <p className="text-sm text-muted-foreground">
              {result.shortlistedCount} candidate
              {result.shortlistedCount === 1 ? "" : "s"} crossed the {result.threshold}%
              threshold.
            </p>
          ) : null}
        </CardContent>
      </Card>

      {result ? (
        <div className="space-y-4">
          {result.assessments.map((assessment) => (
            <Card key={assessment.applicationId} className="border-primary/10">
              <CardHeader className="gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <CardTitle className="text-lg">{assessment.candidateName}</CardTitle>
                  <CardDescription className="mt-1 leading-6">
                    {assessment.summary}
                  </CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={assessment.suitable ? "secondary" : "outline"}>
                    {assessment.score}% match
                  </Badge>
                  <Badge variant={assessment.suitable ? "default" : "outline"}>
                    {assessment.suitable ? "Shortlisted" : "Not shortlisted"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-secondary-foreground">
                    Strengths
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                    {assessment.strengths.map((item) => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-secondary-foreground">
                    Gaps
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                    {assessment.gaps.map((item) => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  )
}
