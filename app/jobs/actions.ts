"use server"

import { revalidatePath, revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

import type { JobFormState } from "@/app/jobs/job-form-state"
import { prisma } from "@/lib/prisma"
import { assertTrustedOrigin } from "@/lib/security"
import { getSession } from "@/lib/session"
import {
  companySchema,
  jobDescriptionSchema,
  jobTitleSchema,
} from "@/lib/validation"

const jobSchema = z.object({
  title: jobTitleSchema,
  company: companySchema,
  description: jobDescriptionSchema,
})

export async function saveJob(
  _prevState: JobFormState,
  formData: FormData
): Promise<JobFormState> {
  await assertTrustedOrigin()

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
  revalidateTag("jobs", "max")
  revalidateTag("dashboard", "max")

  if (jobId) {
    revalidatePath(`/jobs/${jobId}`)
  }

  redirect("/jobs")
}

export async function applyToJob(jobId: string) {
  await assertTrustedOrigin()

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
  revalidateTag("jobs", "max")
  revalidateTag("applications", "max")
  revalidateTag("dashboard", "max")

  redirect(`/jobs/${jobId}?status=applied`)
}
