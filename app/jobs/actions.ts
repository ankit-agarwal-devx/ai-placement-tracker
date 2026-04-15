"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

import type { JobFormState } from "@/app/jobs/job-form-state"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/session"

const jobSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters."),
  company: z.string().trim().min(2, "Company must be at least 2 characters."),
  description: z.string().trim().min(20, "Description must be at least 20 characters."),
})

export async function saveJob(
  _prevState: JobFormState,
  formData: FormData
): Promise<JobFormState> {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  if (session.role !== "ADMIN") {
    return {
      message: "Only admins can create or update jobs.",
    }
  }

  const parsed = jobSchema.safeParse({
    title: formData.get("title"),
    company: formData.get("company"),
    description: formData.get("description"),
  })

  if (!parsed.success) {
    return {
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  const jobIdValue = formData.get("jobId")
  const jobId = typeof jobIdValue === "string" && jobIdValue.length > 0 ? jobIdValue : null

  if (jobId) {
    await prisma.job.update({
      where: { id: jobId },
      data: parsed.data,
    })
  } else {
    await prisma.job.create({
      data: parsed.data,
    })
  }

  revalidatePath("/jobs")

  if (jobId) {
    revalidatePath(`/jobs/${jobId}`)
  }

  redirect("/jobs")
}

export async function applyToJob(jobId: string) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  if (session.role !== "STUDENT") {
    redirect(`/jobs/${jobId}?status=admin-only`)
  }

  const candidate = await prisma.candidate.findUnique({
    where: { userId: session.userId },
    select: { id: true },
  })

  if (!candidate) {
    redirect(`/jobs/${jobId}?status=missing-profile`)
  }

  const existingApplication = await prisma.application.findFirst({
    where: {
      jobId,
      userId: session.userId,
    },
    select: { id: true },
  })

  if (existingApplication) {
    redirect(`/jobs/${jobId}?status=already-applied`)
  }

  await prisma.application.create({
    data: {
      jobId,
      userId: session.userId,
      candidateId: candidate.id,
    },
  })

  revalidatePath("/jobs")
  revalidatePath(`/jobs/${jobId}`)
  revalidatePath("/dashboard")

  redirect(`/jobs/${jobId}?status=applied`)
}
