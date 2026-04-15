"use client";

import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type TopbarProps = {
  name: string
  role: "ADMIN" | "STUDENT"
}

export default function Topbar({ name="", role }: TopbarProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="flex items-center justify-between border-b border-primary/10 bg-card/95 p-4 backdrop-blur">
      <Input placeholder="Search candidates, jobs..." className="w-1/3" />

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
