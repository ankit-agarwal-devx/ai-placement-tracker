"use client"

import { useState, useTransition } from "react"

import AiInsightView from "@/app/components/AiInsightView"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Card"
import { Button } from "@/components/ui/button"

type AiInsight = {
  feature: string
  title: string
  intro: string
  score?: number
  generatedText?: string
  sections: Array<{
    heading: string
    items: string[]
  }>
}

export default function JobAiPanel({ jobId }: { jobId: string }) {
  const [error, setError] = useState("")
  const [insight, setInsight] = useState<AiInsight | null>(null)
  const [activeFeature, setActiveFeature] = useState("")
  const [isPending, startTransition] = useTransition()

  function runFeature(
    feature: "job-match" | "application-help" | "interview-prep"
  ) {
    setError("")
    setActiveFeature(feature)

    startTransition(async () => {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feature,
          jobId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setInsight(null)
        setError(data.error ?? "Unable to generate AI guidance right now.")
        return
      }

      setInsight(data)
    })
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/15">
        <CardHeader>
          <CardTitle className="text-xl">AI application coach</CardTitle>
          <CardDescription className="text-sm leading-6">
            Compare your profile with this role, draft a short fit statement, and
            practice role-specific interview questions before you apply.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={() => runFeature("job-match")}
              disabled={isPending}
            >
              {isPending && activeFeature === "job-match" ? "Thinking..." : "Check match score"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => runFeature("application-help")}
              disabled={isPending}
            >
              {isPending && activeFeature === "application-help" ? "Thinking..." : "Generate application help"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => runFeature("interview-prep")}
              disabled={isPending}
            >
              {isPending && activeFeature === "interview-prep" ? "Thinking..." : "Prepare interview questions"}
            </Button>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </CardContent>
      </Card>

      {insight ? <AiInsightView insight={insight} /> : null}
    </div>
  )
}
