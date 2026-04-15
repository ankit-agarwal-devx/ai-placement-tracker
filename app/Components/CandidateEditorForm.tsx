"use client"

import Link from "next/link"
import { useActionState } from "react"

import {
  createCandidateProfile,
  updateCandidateProfile,
} from "@/app/candidates/actions"
import { initialCandidateFormState } from "@/app/candidates/candidate-form-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type CandidateEditorFormProps = {
  candidate?: {
    id: string
    name: string
    email: string
    skills: string
    resume: string | null
  } | null
  mode: "create" | "edit"
  role: "ADMIN" | "STUDENT"
}

const textAreaClassName =
  "min-h-32 w-full rounded-lg border border-primary/15 bg-card px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-secondary focus-visible:ring-3 focus-visible:ring-secondary/25"

export default function CandidateEditorForm({
  candidate,
  mode,
  role,
}: CandidateEditorFormProps) {
  const action =
    mode === "edit" && candidate
      ? updateCandidateProfile.bind(null, candidate.id)
      : createCandidateProfile

  const [state, formAction, pending] = useActionState(action, initialCandidateFormState)

  const isCreate = mode === "create"

  return (
    <Card className="w-full max-w-3xl border-primary/15 shadow-lg shadow-primary/10">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl">
          {isCreate ? "Create candidate account" : "Edit candidate profile"}
        </CardTitle>
        <CardDescription>
          {isCreate
            ? "Admins create both the user account and the connected candidate profile here."
            : role === "ADMIN"
              ? "Admins can update candidate details and keep user records in sync."
              : "Update your candidate profile details used across applications."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-5">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium text-primary">
              Full name
            </label>
            <Input
              id="name"
              name="name"
              defaultValue={candidate?.name ?? ""}
              placeholder="Ankit Agarwal"
              required
            />
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
              defaultValue={candidate?.email ?? ""}
              placeholder="candidate@example.com"
              required
            />
            <FieldError errors={state.fieldErrors?.email} />
          </div>

          <div className="grid gap-2">
            <label htmlFor="password" className="text-sm font-medium text-primary">
              {isCreate ? "Password" : "New password"}
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder={isCreate ? "Minimum 6 characters" : "Leave blank to keep current password"}
              required={isCreate}
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
              defaultValue={candidate?.skills ?? ""}
              placeholder="React, Node.js, SQL"
              className={textAreaClassName}
              required
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
              defaultValue={candidate?.resume ?? ""}
              placeholder="https://example.com/resume.pdf"
            />
            <FieldError errors={state.fieldErrors?.resume} />
          </div>

          <p
            aria-live="polite"
            className={cn(
              "text-sm",
              state.message ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {state.message}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button type="submit" className="sm:min-w-40" disabled={pending}>
              {pending
                ? isCreate
                  ? "Creating..."
                  : "Saving..."
                : isCreate
                  ? "Create candidate"
                  : "Save changes"}
            </Button>
            <Link
              href="/candidates"
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Back to candidates
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
