"use client";

import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Topbar() {
  return (
    <div className="flex items-center justify-between border-b border-primary/10 bg-card/95 p-4 backdrop-blur">
      <Input placeholder="Search candidates, jobs..." className="w-1/3" />

      <div className="flex items-center gap-3">
        <span className="font-medium">Ankit</span>
        <Avatar>
          <AvatarFallback>AA</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
