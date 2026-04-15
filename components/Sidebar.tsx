"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Briefcase, FileText, LayoutDashboard, Users } from "lucide-react"

import { logoutUser } from "@/app/auth/actions"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/candidates", label: "Candidates", icon: Users },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/applications", label: "Applications", icon: FileText },
] as const

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar p-5 text-sidebar-foreground">
      <h1 className="mb-8 text-2xl font-bold">HireFlow AI</h1>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-sidebar-accent",
                isActive && "bg-sidebar-accent"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto">
        <form action={logoutUser}>
          <button className="w-full rounded-lg bg-tertiary py-2 font-medium text-tertiary-foreground transition-colors hover:bg-tertiary/90">
            Logout
          </button>
        </form>
      </div>
    </div>
  )
}
