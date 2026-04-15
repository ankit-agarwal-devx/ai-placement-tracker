"use server"

import bcrypt from "bcrypt"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import type { RegisterFormState } from "@/app/register/register-form-state"

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z.email("Enter a valid email address.").transform((value) => value.toLowerCase()),
  password: z.string().min(6, "Password must be at least 6 characters."),
  skills: z.string().trim().optional(),
  resume: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || value.startsWith("http://") || value.startsWith("https://"),
      "Resume must be a valid URL."
    ),
})

export async function registerCandidate(
  _prevState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
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

  return {
    message: "Registration successful. Your candidate profile has been created.",
    success: true,
  }
}
