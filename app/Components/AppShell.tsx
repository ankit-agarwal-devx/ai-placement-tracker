import type { ReactNode } from "react"

import Footer from "@/app/components/Footer"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"

type AppShellProps = {
  children: ReactNode
  name: string
  role: "ADMIN" | "STUDENT"
}

export default function AppShell({ children, name, role }: AppShellProps) {
  return (
      <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Navbar name={name} role={role} />
        
        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  )
}
