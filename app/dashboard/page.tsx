import { redirect } from "next/navigation"

import AppShell from "../components/AppShell"
import MainContent from "../components/MainContent"
import { getSession } from "@/lib/session"

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <AppShell name={session.name} role={session.role}>
      <MainContent
        session={{
          userId: session.userId,
          name: session.name,
          role: session.role,
        }}
      />
    </AppShell>
  )
}
