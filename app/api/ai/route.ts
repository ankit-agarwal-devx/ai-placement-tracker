import { revalidatePath, revalidateTag } from "next/cache"
import { NextResponse } from "next/server"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/session"
import {
  buildAdminShortlist,
  buildApplicationHelp,
  buildInterviewPrep,
  buildJobMatch,
  buildResumeAnalysis,
  buildSkillRoadmap,
} from "@/lib/ai"

const aiRequestSchema = z.object({
  feature: z.enum([
    "admin-shortlist",
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
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json().catch(() => null)
    const parsed = aiRequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid AI request.", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { feature, jobId, resumeText, targetRole } = parsed.data

    if (feature === "admin-shortlist") {
      if (session.role !== "ADMIN") {
        return NextResponse.json(
          { error: "Only admin accounts can run AI shortlisting." },
          { status: 403 }
        )
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
          id: true,
          title: true,
          company: true,
          description: true,
          applications: {
            select: {
              id: true,
              status: true,
              candidate: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  skills: true,
                  resume: true,
                },
              },
            },
          },
        },
      })

      if (!job) {
        return NextResponse.json({ error: "Job not found." }, { status: 404 })
      }

      if (job.applications.length === 0) {
        return NextResponse.json(
          { error: "No applications are available for this job yet." },
          { status: 400 }
        )
      }

      const shortlist = buildAdminShortlist({
        job: {
          id: job.id,
          title: job.title,
          company: job.company,
          description: job.description,
        },
        candidates: job.applications.map((application) => ({
          applicationId: application.id,
          candidateId: application.candidate.id,
          candidateName: application.candidate.name,
          email: application.candidate.email,
          skills: application.candidate.skills,
          resume: application.candidate.resume,
          currentStatus: application.status,
        })),
      })

      const shortlistedIds = shortlist.assessments
        .filter((assessment) => assessment.score > 70)
        .map((assessment) => assessment.applicationId)

      if (shortlistedIds.length > 0) {
        await prisma.application.updateMany({
          where: {
            id: { in: shortlistedIds },
            status: { notIn: ["SELECTED", "REJECTED"] },
          },
          data: {
            status: "SHORTLISTED",
          },
        })

        revalidatePath("/applications")
        revalidatePath("/jobs")
        revalidatePath(`/jobs/${jobId}`)
        revalidateTag("applications", "max")
        revalidateTag("jobs", "max")
        revalidateTag("dashboard", "max")
      }

      return NextResponse.json({
        ...shortlist,
        shortlistedCount: shortlistedIds.length,
      })
    }

    if (session.role !== "STUDENT") {
      return NextResponse.json(
        { error: "These AI tools are currently available for candidate accounts only." },
        { status: 403 }
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
  } catch (error) {
    console.error("AI route error:", error)

    const message = getFriendlyAiErrorMessage(error)

    return NextResponse.json({ error: message }, { status: 503 })
  }
}

function getFriendlyAiErrorMessage(error: unknown) {
  const details =
    error instanceof Error && error.message.trim().length > 0
      ? error.message
      : ""

  if (
    details.includes("temporarily overloaded") ||
    details.includes("UNAVAILABLE") ||
    details.includes("high demand")
  ) {
    return "AI is busy right now. Please try again in a moment."
  }

  if (
    details.includes("quota") ||
    details.includes("RESOURCE_EXHAUSTED") ||
    details.includes("rate limit")
  ) {
    return "AI usage limit reached. Please try again later."
  }

  if (
    details.includes("API key") ||
    details.includes("GEMINI_API_KEY") ||
    details.includes("API_KEY_INVALID")
  ) {
    return "AI service is not configured correctly right now."
  }

  if (
    details.includes("ZodError") ||
    details.includes("Invalid input") ||
    details.includes("required")
  ) {
    return "AI returned an unexpected result. Please try again."
  }

  return "Unable to generate AI guidance right now. Please try again."
}
