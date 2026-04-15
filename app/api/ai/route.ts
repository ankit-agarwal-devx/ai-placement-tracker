import { NextResponse } from "next/server"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/session"
import {
  buildApplicationHelp,
  buildInterviewPrep,
  buildJobMatch,
  buildResumeAnalysis,
  buildSkillRoadmap,
} from "@/lib/ai"

const aiRequestSchema = z.object({
  feature: z.enum([
    "resume-analysis",
    "job-match",
    "application-help",
    "interview-prep",
    "skill-roadmap",
  ]),
  jobId: z.string().min(1).optional(),
  resumeText: z.string().optional(),
  targetRole: z.string().optional(),
})

export async function POST(request: Request) {
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (session.role !== "STUDENT") {
    return NextResponse.json(
      { error: "These AI tools are currently available for candidate accounts only." },
      { status: 403 }
    )
  }

  const body = await request.json().catch(() => null)
  const parsed = aiRequestSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid AI request.", details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const candidate = await prisma.candidate.findUnique({
    where: { userId: session.userId },
    select: {
      name: true,
      skills: true,
      resume: true,
    },
  })

  if (!candidate) {
    return NextResponse.json(
      { error: "Candidate profile not found for this account." },
      { status: 404 }
    )
  }

  const { feature, jobId, resumeText, targetRole } = parsed.data

  if (feature === "resume-analysis") {
    return NextResponse.json(
      buildResumeAnalysis(candidate, { resumeText, targetRole })
    )
  }

  if (feature === "skill-roadmap") {
    return NextResponse.json(buildSkillRoadmap(candidate, { targetRole }))
  }

  if (!jobId) {
    return NextResponse.json(
      { error: "jobId is required for this AI feature." },
      { status: 400 }
    )
  }

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: {
      title: true,
      company: true,
      description: true,
    },
  })

  if (!job) {
    return NextResponse.json({ error: "Job not found." }, { status: 404 })
  }

  switch (feature) {
    case "job-match":
      return NextResponse.json(buildJobMatch(candidate, job))
    case "application-help":
      return NextResponse.json(buildApplicationHelp(candidate, job))
    case "interview-prep":
      return NextResponse.json(buildInterviewPrep(candidate, job))
    default:
      return NextResponse.json({ error: "Unsupported feature." }, { status: 400 })
  }
}
