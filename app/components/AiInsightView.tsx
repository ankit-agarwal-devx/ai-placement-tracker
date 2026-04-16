"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Card"
import { Badge } from "@/components/ui/badge"

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

export default function AiInsightView({ insight }: { insight: AiInsight }) {
  return (
    <Card className="border-primary/15">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <CardTitle className="text-xl">{insight.title}</CardTitle>
          {typeof insight.score === "number" ? (
            <Badge variant="secondary">{insight.score}% match</Badge>
          ) : null}
        </div>
        <CardDescription className="text-sm leading-6">
          {insight.intro}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {insight.generatedText ? (
          <div className="rounded-lg border border-primary/10 bg-primary/5 p-4 text-sm leading-6 text-primary">
            {insight.generatedText}
          </div>
        ) : null}

        {insight.sections.map((section) => (
          <div key={section.heading}>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-secondary-foreground">
              {section.heading}
            </h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
              {section.items.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
