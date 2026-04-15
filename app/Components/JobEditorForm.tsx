"use client"

import Link from "next/link"
import { useActionState } from "react"

import { saveJob } from "@/app/jobs/actions"
import { initialJobFormState } from "@/app/jobs/job-form-state"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/Card"
import {
  FieldError,
  Form,
  FormActions,
  FormField,
  FormLabel,
  FormMessage,
  FormTextarea,
} from "@/components/Form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type JobEditorFormProps = {
  job?: {
    id: string
    title: string
    company: string
    description: string
  } | null
}

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
        <Form action={formAction}>
          <input type="hidden" name="jobId" value={job?.id ?? ""} />

          <FormField>
            <FormLabel htmlFor="title">Job title</FormLabel>
            <Input
              id="title"
              name="title"
              defaultValue={job?.title ?? ""}
              placeholder="Frontend Developer"
              required
            />
            <FieldError errors={state.fieldErrors?.title} />
          </FormField>

          <FormField>
            <FormLabel htmlFor="company">Company</FormLabel>
            <Input
              id="company"
              name="company"
              defaultValue={job?.company ?? ""}
              placeholder="HireFlow AI"
              required
            />
            <FieldError errors={state.fieldErrors?.company} />
          </FormField>

          <FormField>
            <FormLabel htmlFor="description">Description</FormLabel>
            <FormTextarea
              id="description"
              name="description"
              defaultValue={job?.description ?? ""}
              placeholder="Describe responsibilities, expectations, and what makes this role exciting."
              className="min-h-40"
              required
            />
            <FieldError errors={state.fieldErrors?.description} />
          </FormField>

          <FormMessage tone={state.message ? "error" : "muted"}>
            {state.message}
          </FormMessage>

          <FormActions>
            <Button type="submit" className="sm:min-w-40" disabled={pending}>
              {pending ? "Saving..." : isEditing ? "Update job" : "Create job"}
            </Button>
            <Link
              href="/jobs"
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Back to jobs
            </Link>
          </FormActions>
        </Form>
      </CardContent>
    </Card>
  )
}
