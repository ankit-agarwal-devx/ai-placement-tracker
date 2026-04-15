"use client";

import Link from "next/link";
import { LayoutDashboard, Users, Briefcase, FileText } from "lucide-react";

import { logoutUser } from "@/app/auth/actions";

export default function Sidebar() {
  return (
    <div className="flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar p-5 text-sidebar-foreground">
      <h1 className="text-2xl font-bold mb-8">HireFlow AI</h1>

      <nav className="space-y-2">
        <Link href="/dashboard" className="flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-sidebar-accent">
          <LayoutDashboard size={18} /> Dashboard
        </Link>

        <Link href="/candidates" className="flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-sidebar-accent">
          <Users size={18} /> Candidates
        </Link>

        <Link href="/jobs" className="flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-sidebar-accent">
          <Briefcase size={18} /> Jobs
        </Link>

        <Link href="/applications" className="flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-sidebar-accent">
          <FileText size={18} /> Applications
        </Link>
      </nav>

      <div className="mt-auto">
        <form action={logoutUser}>
          <button className="w-full rounded-lg bg-tertiary py-2 font-medium text-tertiary-foreground transition-colors hover:bg-tertiary/90">
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}
