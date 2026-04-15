"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Briefcase, FileText, LayoutDashboard, Users, X } from "lucide-react"

import { logoutUser } from "@/app/auth/actions"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/candidates", label: "Candidates", icon: Users },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/applications", label: "Applications", icon: FileText },
] as const

type SidebarProps = {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-primary/35 transition-opacity md:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen w-[70vw] max-w-80 flex-col border-r border-sidebar-border bg-sidebar p-5 text-sidebar-foreground shadow-2xl transition-transform md:static md:z-auto md:w-64 md:max-w-none md:translate-x-0 md:shadow-none",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold">HireFlow AI</h1>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="size-4" />
          </Button>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
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
            <button className="w-full cursor-pointer rounded-lg bg-tertiary py-2 font-medium text-tertiary-foreground transition-colors hover:bg-tertiary/90">
              Logout
            </button>
          </form>
        </div>
      </aside>
    </>
  )
}
