"use server"

import bcrypt from "bcrypt"
import { redirect } from "next/navigation"
import { z } from "zod"

import type { LoginFormState } from "@/app/login/login-form-state"
import { prisma } from "@/lib/prisma"
import { createSession } from "@/lib/session"

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address.").transform((value) => value.toLowerCase()),
  password: z.string().min(1, "Password is required."),
})

export async function loginUser(
  _prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return {
      message: "",
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  const { email, password } = parsed.data

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      password: true,
    },
  })

  if (!user) {
    return {
      message: "",
      fieldErrors: {
        email: ["No account found with this email."],
      },
    }
  }

  const passwordMatches = await bcrypt.compare(password, user.password)

  if (!passwordMatches) {
    return {
      message: "",
      fieldErrors: {
        password: ["Incorrect password."],
      },
    }
  }

  await createSession({
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  })

  redirect("/dashboard")
}
