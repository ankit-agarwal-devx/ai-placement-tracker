"use server"

import bcrypt from "bcrypt"
import { redirect } from "next/navigation"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import type { RegisterFormState } from "@/app/register/register-form-state"
import { assertTrustedOrigin } from "@/lib/security"
import {
  candidateNameSchema,
  emailSchema,
  optionalSkillsSchema,
  passwordSchema,
  resumeUrlSchema,
} from "@/lib/validation"

const registerSchema = z.object({
  name: candidateNameSchema,
  email: emailSchema,
  password: passwordSchema,
  skills: optionalSkillsSchema,
  resume: resumeUrlSchema,
})

export async function registerCandidate(
  _prevState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  await assertTrustedOrigin()

  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    skills: formData.get("skills"),
    resume: formData.get("resume"),
  })

  if (!parsed.success) {
    return {
      message: "Please fix the highlighted fields.",
      success: false,
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
      message: "An account with this email already exists.",
      success: false,
      fieldErrors: {
        email: ["This email is already registered."],
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
          skills: skills ?? "",
          resume: resume || null,
        },
      },
    },
  })

  redirect("/login")
}
