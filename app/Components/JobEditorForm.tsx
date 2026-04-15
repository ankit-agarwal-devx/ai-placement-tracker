"use client"

import Link from "next/link"
import { useActionState } from "react"

import { saveJob } from "@/app/jobs/actions"
import { initialJobFormState } from "@/app/jobs/job-form-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type JobEditorFormProps = {
  job?: {
    id: string
    title: string
    company: string
    description: string
  } | null
}

const textAreaClassName =
  "min-h-40 w-full rounded-lg border border-primary/15 bg-card px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-secondary focus-visible:ring-3 focus-visible:ring-secondary/25"

export default function JobEditorForm({ job }: JobEditorFormProps) {
  const [state, formAction, pending] = useActionState(saveJob, initialJobFormState)
  const isEditing = Boolean(job)

  return (
    <Card className="w-full max-w-3xl border-primary/15 shadow-lg shadow-primary/10">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl">
          {isEditing ? "Update job" : "Create a new job"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Refresh the role, company, or description for this opening."
            : "Add a new opportunity candidates can discover and apply to."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-5">
          <input type="hidden" name="jobId" value={job?.id ?? ""} />

          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-medium text-primary">
              Job title
            </label>
            <Input
              id="title"
              name="title"
              defaultValue={job?.title ?? ""}
              placeholder="Frontend Developer"
              required
            />
            <FieldError errors={state.fieldErrors?.title} />
          </div>

          <div className="grid gap-2">
            <label htmlFor="company" className="text-sm font-medium text-primary">
              Company
            </label>
            <Input
              id="company"
              name="company"
              defaultValue={job?.company ?? ""}
              placeholder="HireFlow AI"
              required
            />
            <FieldError errors={state.fieldErrors?.company} />
          </div>

          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium text-primary">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={job?.description ?? ""}
              placeholder="Describe responsibilities, expectations, and what makes this role exciting."
              className={textAreaClassName}
              required
            />
            <FieldError errors={state.fieldErrors?.description} />
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
              {pending ? "Saving..." : isEditing ? "Update job" : "Create job"}
            </Button>
            <Link
              href="/jobs"
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Back to jobs
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
