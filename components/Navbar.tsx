"use client"

import { Menu } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

type NavbarProps = {
  name: string
  role: "ADMIN" | "STUDENT"
  onMenuClick: () => void
}

export default function Navbar({ name = "", role, onMenuClick }: NavbarProps) {
  const initials =
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "HF"

  return (
    <div className="flex items-center justify-between border-b border-primary/10 bg-card/95 p-4 backdrop-blur">
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        className="md:hidden"
        onClick={onMenuClick}
        aria-label="Open sidebar"
      >
        <Menu className="size-4" />
      </Button>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="font-medium">{name}</p>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {role}
          </p>
        </div>
        <Avatar>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}
