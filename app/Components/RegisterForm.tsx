"use client"

import Link from "next/link"
import { useActionState } from "react"

import { registerCandidate } from "@/app/register/actions"
import { initialRegisterState } from "@/app/register/register-form-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const fieldClassName =
  "min-h-24 w-full rounded-lg border border-primary/15 bg-card px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-secondary focus-visible:ring-3 focus-visible:ring-secondary/25"

export default function RegisterForm() {
  const [state, formAction, pending] = useActionState(
    registerCandidate,
    initialRegisterState
  )

  return (
    <Card className="w-full max-w-xl border-primary/15 shadow-lg shadow-primary/10">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl">Create your candidate account</CardTitle>
        <CardDescription>
          Every new account is registered as a candidate and gets a connected
          candidate profile automatically.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-5">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium text-primary">
              Full name
            </label>
            <Input id="name" name="name" placeholder="Ankit Agarwal" required />
            <FieldError errors={state.fieldErrors?.name} />
          </div>

          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium text-primary">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />
            <FieldError errors={state.fieldErrors?.email} />
          </div>

          <div className="grid gap-2">
            <label htmlFor="password" className="text-sm font-medium text-primary">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Minimum 6 characters"
              required
            />
            <FieldError errors={state.fieldErrors?.password} />
          </div>

          <div className="grid gap-2">
            <label htmlFor="skills" className="text-sm font-medium text-primary">
              Skills
            </label>
            <textarea
              id="skills"
              name="skills"
              placeholder="React, Node.js, SQL"
              className={fieldClassName}
            />
            <FieldError errors={state.fieldErrors?.skills} />
          </div>

          <div className="grid gap-2">
            <label htmlFor="resume" className="text-sm font-medium text-primary">
              Resume URL
            </label>
            <Input
              id="resume"
              name="resume"
              type="url"
              placeholder="https://example.com/resume.pdf"
            />
            <FieldError errors={state.fieldErrors?.resume} />
          </div>

          <p
            aria-live="polite"
            className={cn(
              "text-sm",
              state.success ? "text-secondary-foreground" : "text-destructive"
            )}
          >
            {state.message}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button type="submit" className="sm:min-w-40" disabled={pending}>
              {pending ? "Creating account..." : "Register now"}
            </Button>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              View dashboard
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) {
    return null
  }

  return <p className="text-sm text-destructive">{errors[0]}</p>
}
