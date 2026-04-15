import type { ReactNode } from "react"

import Footer from "@/app/components/Footer"
import Sidebar from "@/app/components/Sidebar"
import Topbar from "@/app/components/Topbar"

type AppShellProps = {
  children: ReactNode
  name: string
  role: "ADMIN" | "STUDENT"
}

export default function AppShell({ children, name, role }: AppShellProps) {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar name={name} role={role} />
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    </div>
  )
}
