import { redirect } from "next/navigation"

import Footer from "../components/Footer"
import MainContent from "../components/MainContent"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import { getSession } from "@/lib/session"

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar name={session.name} role={session.role} />
        <MainContent />
        <Footer />
      </div>
    </div>
  )
}
