"use server"

import bcrypt from "bcrypt"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

import type { CandidateFormState } from "@/app/candidates/candidate-form-state"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/session"

const createCandidateSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z.email("Enter a valid email address.").transform((value) => value.toLowerCase()),
  password: z.string().min(6, "Password must be at least 6 characters."),
  skills: z.string().trim().min(2, "Skills must be at least 2 characters."),
  resume: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || value.startsWith("http://") || value.startsWith("https://"),
      "Resume must be a valid URL."
    ),
})

const updateCandidateSchema = createCandidateSchema.omit({ password: true }).extend({
  password: z.string().optional(),
})

export async function createCandidateProfile(
  _prevState: CandidateFormState,
  formData: FormData
): Promise<CandidateFormState> {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  if (session.role !== "ADMIN") {
    return {
      message: "Only admins can create candidate accounts.",
    }
  }

  const parsed = createCandidateSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    skills: formData.get("skills"),
    resume: formData.get("resume"),
  })

  if (!parsed.success) {
    return {
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  const { name, email, password, skills, resume } = parsed.data

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  })

  if (existingUser) {
    return {
      message: "A user with this email already exists.",
      fieldErrors: {
        email: ["This email is already in use."],
      },
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "STUDENT",
      candidate: {
        create: {
          name,
          email,
          skills,
          resume: resume || null,
        },
      },
    },
  })

  revalidatePath("/candidates")
  revalidatePath("/dashboard")
  redirect("/candidates")
}

export async function updateCandidateProfile(
  candidateId: string,
  _prevState: CandidateFormState,
  formData: FormData
): Promise<CandidateFormState> {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const candidate = await prisma.candidate.findUnique({
    where: { id: candidateId },
    select: {
      id: true,
      userId: true,
      user: {
        select: {
          email: true,
        },
      },
    },
  })

  if (!candidate) {
    redirect("/candidates")
  }

  const canEdit =
    session.role === "ADMIN" || candidate.userId === session.userId

  if (!canEdit) {
    redirect("/candidates")
  }

  const parsed = updateCandidateSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    skills: formData.get("skills"),
    resume: formData.get("resume"),
  })

  if (!parsed.success) {
    return {
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  const { name, email, password, skills, resume } = parsed.data

  if (email !== candidate.user.email) {
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })

    if (existingUser) {
      return {
        message: "Another user already uses this email.",
        fieldErrors: {
          email: ["This email is already in use."],
        },
      }
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.candidate.update({
      where: { id: candidateId },
      data: {
        name,
        email,
        skills,
        resume: resume || null,
      },
    })

    await tx.user.update({
      where: { id: candidate.userId },
      data: {
        name,
        email,
        ...(password
          ? {
              password: await bcrypt.hash(password, 10),
            }
          : {}),
      },
    })
  })

  revalidatePath("/candidates")
  revalidatePath(`/candidates/${candidateId}/edit`)
  revalidatePath("/applications")
  revalidatePath("/dashboard")
  redirect("/candidates")
}
