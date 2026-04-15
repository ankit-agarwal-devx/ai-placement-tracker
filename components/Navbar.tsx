"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

type NavbarProps = {
  name: string
  role: "ADMIN" | "STUDENT"
}

export default function Navbar({ name = "", role }: NavbarProps) {
  const initials =
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "HF"

  return (
    <div className="flex items-center justify-end border-b border-primary/10 bg-card/95 p-4 backdrop-blur">

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
