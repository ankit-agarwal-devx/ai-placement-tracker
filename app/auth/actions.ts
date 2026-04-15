"use server"

import { redirect } from "next/navigation"

import { clearSession } from "@/lib/session"

export async function logoutUser() {
  await clearSession()
  redirect("/login")
}
