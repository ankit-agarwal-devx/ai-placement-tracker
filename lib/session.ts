import "server-only"

import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const SESSION_COOKIE_NAME = "hireflow_session"
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7

type SessionPayload = {
  userId: string
  name: string
  email: string
  role: "ADMIN" | "STUDENT"
}

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET

  if (secret) {
    return secret
  }

  if (process.env.NODE_ENV !== "production") {
    return "dev-only-hireflow-session-secret"
  }

  throw new Error("SESSION_SECRET is not set.")
}

export async function createSession(payload: SessionPayload) {
  const token = jwt.sign(payload, getSessionSecret(), {
    algorithm: "HS256",
    expiresIn: SESSION_DURATION_SECONDS,
  })

  const cookieStore = await cookies()

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  })
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  try {
    const decoded = jwt.verify(token, getSessionSecret())

    if (
      !decoded ||
      typeof decoded !== "object" ||
      !("userId" in decoded) ||
      !("role" in decoded)
    ) {
      return null
    }

    return {
      userId: String(decoded.userId),
      name: String(decoded.name),
      email: String(decoded.email),
      role: decoded.role === "ADMIN" ? "ADMIN" : "STUDENT",
    } satisfies SessionPayload
  } catch {
    return null
  }
}
