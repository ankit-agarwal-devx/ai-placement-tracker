"use client"

import { useState, useTransition } from "react"

import AiInsightView from "@/app/components/AiInsightView"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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

const textAreaClassName =
  "min-h-32 w-full rounded-lg border border-primary/15 bg-card px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-secondary focus-visible:ring-3 focus-visible:ring-secondary/25"

export default function CandidateAiPanel() {
  const [targetRole, setTargetRole] = useState("")
  const [resumeText, setResumeText] = useState("")
  const [error, setError] = useState("")
  const [insight, setInsight] = useState<AiInsight | null>(null)
  const [isPending, startTransition] = useTransition()

  function runFeature(feature: "resume-analysis" | "skill-roadmap") {
    setError("")

    startTransition(async () => {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feature,
          targetRole,
          resumeText,
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
          <CardTitle className="text-xl">AI career assistant</CardTitle>
          <CardDescription className="text-sm leading-6">
            Use your profile plus optional pasted resume text to get feedback on strengths,
            missing keywords, and the next skills to build.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-2">
            <label htmlFor="target-role" className="text-sm font-medium text-primary">
              Target role
            </label>
            <Input
              id="target-role"
              value={targetRole}
              onChange={(event) => setTargetRole(event.target.value)}
              placeholder="Frontend Developer, Full Stack Engineer, Data Analyst..."
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="resume-text" className="text-sm font-medium text-primary">
              Paste resume text
            </label>
            <textarea
              id="resume-text"
              value={resumeText}
              onChange={(event) => setResumeText(event.target.value)}
              placeholder="Paste the experience, projects, and skills section of your resume here for deeper feedback."
              className={textAreaClassName}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={() => runFeature("resume-analysis")}
              disabled={isPending}
            >
              {isPending ? "Thinking..." : "Analyze resume"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => runFeature("skill-roadmap")}
              disabled={isPending}
            >
              Build skill roadmap
            </Button>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </CardContent>
      </Card>

      {insight ? <AiInsightView insight={insight} /> : null}
    </div>
  )
}
